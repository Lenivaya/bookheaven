'use server'

import { db } from '@/db'
import { authorImages, authors } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { utapi } from '../api/uploadthing/utapi'

export async function uploadAuthorImage(
  authorId: string,
  fileKey: string,
  url: string
) {
  await db.transaction(async (tx) => {
    const previousImages = (
      await tx.query.authorImages.findMany({
        where: eq(authorImages.authorId, authorId)
      })
    ).map((image) => image.fileKey)
    await tx.delete(authorImages).where(eq(authorImages.authorId, authorId))
    await tx.insert(authorImages).values({
      authorId,
      fileKey,
      url
    })
    await tx
      .update(authors)
      .set({
        photoUrl: url
      })
      .where(eq(authors.id, authorId))
    await utapi.deleteFiles(previousImages)
  })
}

export async function deleteAuthorImage(authorId: string) {
  await db.transaction(async (tx) => {
    const image = await tx.query.authorImages.findFirst({
      where: eq(authorImages.authorId, authorId)
    })
    if (!image) return
    await tx.delete(authorImages).where(eq(authorImages.id, image.id))
    await tx
      .update(authors)
      .set({
        photoUrl: null
      })
      .where(eq(authors.id, authorId))
    await utapi.deleteFiles([image.fileKey])
  })
}
