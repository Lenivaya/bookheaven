import { timestamp } from 'drizzle-orm/pg-core'
import { createSchemaFactory } from 'drizzle-zod'

export const timestamps = {
  updated_at: timestamp(),
  created_at: timestamp().defaultNow().notNull(),
  deleted_at: timestamp()
}

export const { createInsertSchema, createSelectSchema, createUpdateSchema } =
  createSchemaFactory({
    // This configuration will only coerce dates. Set `coerce` to `true` to coerce all data types or specify others
    coerce: {
      date: true
    }
  })
