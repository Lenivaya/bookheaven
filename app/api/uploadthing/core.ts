import { checkRole } from '@/lib/auth/utils'
import { isNone } from '@/lib/types'
import { auth } from '@clerk/nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'

const f = createUploadthing()

const authMiddleware = async () => {
  const user = await auth()
  const isAdmin = await checkRole('admin')
  if (isNone(user) || !isAdmin) throw new UploadThingError('Unauthorized')
  return { userId: user.userId }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  imageUploader: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1
    }
  })
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.ufsUrl)
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
