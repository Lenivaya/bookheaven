// import { drizzle as drizzleNeonPostgres } from 'drizzle-orm/neon-http'
import { drizzle as drizzleNeonServerless } from 'drizzle-orm/neon-serverless'
import { drizzle as drizzlePostgres } from 'drizzle-orm/node-postgres'
import { env } from '@/env'
import { Pool } from 'pg'
import * as schema from './schema'
import {
  Pool as NeonServerLessPool,
  neonConfig
} from '@neondatabase/serverless'
import ws from 'ws'

const isProduction = env.NODE_ENV === 'production'
neonConfig.webSocketConstructor = ws

// ? drizzleNeonPostgres(neon(env.DATABASE_URL), {
//     schema,
//     logger: !isProduction
//   })
export const db = isProduction
  ? drizzleNeonServerless(
      new NeonServerLessPool({ connectionString: env.DATABASE_URL }),
      {
        schema,
        logger: !isProduction
      }
    )
  : drizzlePostgres(
      new Pool({
        connectionString: env.DATABASE_URL
      }),
      {
        schema,
        logger: !isProduction
      }
    )

export type DB = typeof db
