'use server'

import { db } from '@/db'
import { authorImages, authors, bookEditions, bookImages } from '@/db/schema'
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
    if (previousImages.length > 0) {
      await utapi.deleteFiles(previousImages)
    }
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

export async function uploadBookImage(
  editionId: string,
  fileKey: string,
  url: string
) {
  await db.transaction(async (tx) => {
    const previousImages = await tx.query.bookImages.findMany({
      where: eq(bookImages.editionId, editionId)
    })
    await tx.delete(bookImages).where(eq(bookImages.editionId, editionId))
    await tx.insert(bookImages).values({
      editionId,
      fileKey,
      url
    })
    await tx
      .update(bookEditions)
      .set({
        thumbnailUrl: url,
        smallThumbnailUrl: url
      })
      .where(eq(bookEditions.id, editionId))
    const previousImagesIds = previousImages.map((image) => image.id)
    if (previousImagesIds.length > 0) {
      await utapi.deleteFiles(previousImagesIds)
    }
  })
}

export async function deleteBookImage(editionId: string) {
  await db.transaction(async (tx) => {
    const image = await tx.query.bookImages.findFirst({
      where: eq(bookImages.editionId, editionId)
    })
    if (!image) return
    await tx.delete(bookImages).where(eq(bookImages.id, image.id))
    await tx
      .update(bookEditions)
      .set({
        thumbnailUrl: null,
        smallThumbnailUrl: null
      })
      .where(eq(bookEditions.id, editionId))
    await utapi.deleteFiles([image.fileKey])
  })
}
