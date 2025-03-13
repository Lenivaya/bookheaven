import { uploadAuthorImage } from '@/app/actions/images.actions'
import { checkRole } from '@/lib/auth/utils'
import { isNone } from '@/lib/types'
import { auth } from '@clerk/nextjs/server'
import { createUploadthing, type FileRouter } from 'uploadthing/next'
import { UploadThingError } from 'uploadthing/server'
import { z } from 'zod'

const f = createUploadthing()

const authMiddleware = async <TInput>({ input }: { input: TInput }) => {
  const user = await auth()
  const isAdmin = await checkRole('admin')
  if (isNone(user.userId) || !isAdmin)
    throw new UploadThingError('Unauthorized')
  return { userId: user.userId, input }
}

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  authorImageUploader: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
      minFileCount: 1
    }
  })
    .input(
      z.object({
        authorId: z.string()
      })
    )
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId)
      console.log('file url', file.ufsUrl)
      await uploadAuthorImage(metadata.input.authorId, file.key, file.ufsUrl)
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
