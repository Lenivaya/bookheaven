import { env } from '@/env'
import 'server-only'

import Stripe from 'stripe'

export const stripe = new Stripe(env.STRIPE_SECRET_KEY as string, {
  // https://github.com/stripe/stripe-node#configuration
  apiVersion: '2025-02-24.acacia',
  appInfo: {
    name: 'bookheaven',
    url: env.NEXT_PUBLIC_APP_URL
  }
})
