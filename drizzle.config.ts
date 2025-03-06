import { defineConfig } from 'drizzle-kit'
import { env } from '@/env'

export default defineConfig({
  schema: './db/schema/',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    url: env.DATABASE_URL
  }
})
