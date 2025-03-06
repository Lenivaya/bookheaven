import { drizzle as drizzleNeonPostgres } from 'drizzle-orm/neon-http'
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres'
import { env } from '@/env'
import { Pool } from 'pg'
import { neon } from '@neondatabase/serverless'

const isProduction = env.NODE_ENV === 'production'

export const db = isProduction
  ? drizzleNeonPostgres(neon(env.DATABASE_URL))
  : drizzlePostgres(
      new Pool({
        connectionString: env.DATABASE_URL
      })
    )

export type DB = typeof db
