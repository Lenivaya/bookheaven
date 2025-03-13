import {
  uploadAuthorImage,
  uploadBookImage
} from '@/app/actions/images.actions'
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
      await uploadAuthorImage(metadata.input.authorId, file.key, file.ufsUrl)
      console.log(
        'Upload complete for author image for authorId:',
        metadata.input.authorId
      )
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl }
    }),
  bookImageUploader: f({
    image: {
      maxFileSize: '2MB',
      maxFileCount: 1,
      minFileCount: 1
    }
  })
    .input(
      z.object({
        editionId: z.string()
      })
    )
    .middleware(authMiddleware)
    .onUploadComplete(async ({ metadata, file }) => {
      await uploadBookImage(metadata.input.editionId, file.key, file.ufsUrl)
      console.log(
        'Upload complete for book image for editionId:',
        metadata.input.editionId
      )
      return { uploadedBy: metadata.userId, fileUrl: file.ufsUrl }
    })
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter
