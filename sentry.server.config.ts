// This file configures the initialization of Sentry on the server.
// The config you add here will be used whenever the server handles a request.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/

import * as Sentry from '@sentry/nextjs'
import { env } from '@/env'

Sentry.init({
  dsn: 'https://946ba079404b1b73de8b12fd2ff9aa29@o4508966976552960.ingest.de.sentry.io/4508967011876944',

  // Define how likely traces are sampled. Adjust this value in production, or use tracesSampler for greater control.
  tracesSampleRate: 1,

  // Setting this option to true will print useful information to the console while you're setting up Sentry.
  debug: false,
  enabled: env.NODE_ENV === 'production'
})
