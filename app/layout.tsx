import ReactQueryProvider from '@/components/providers/ReactQueryProvider'
import { NextSSRPlugin } from '@uploadthing/react/next-ssr-plugin'
import { ClerkProvider } from '@clerk/nextjs'
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { dark } from '@clerk/themes'
import { Navbar } from '../components/layout/navbar/Navbar'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'
import { ShoppingStripeCartProvider } from '@/components/providers/CartProdiver'
import { ViewTransitions } from 'next-view-transitions'
import { extractRouterConfig } from 'uploadthing/server'
import { ourFileRouter } from './api/uploadthing/core'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin']
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin']
})

export const metadata: Metadata = {
  title: 'BookHeaven 📚🌿',
  description:
    'Discover your next literary adventure at Bookheaven - a vibrant marketplace for book lovers. Browse, rate, and organize your personal library, join discussions, track your reading progress, and connect with fellow bibliophiles in our thriving community.'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider
      appearance={{
        baseTheme: dark
      }}
    >
      <ViewTransitions>
        <html lang='en' className='dark' suppressHydrationWarning>
          <body
            className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          >
            <NuqsAdapter>
              <ReactQueryProvider>
                <ShoppingStripeCartProvider>
                  <Navbar />
                  <NextSSRPlugin
                    routerConfig={extractRouterConfig(ourFileRouter)}
                  />
                  <main className='px-2 sm:px-0'>{children}</main>
                  <Toaster position='bottom-right' />
                </ShoppingStripeCartProvider>
              </ReactQueryProvider>
            </NuqsAdapter>
          </body>
        </html>
      </ViewTransitions>
    </ClerkProvider>
  )
}
