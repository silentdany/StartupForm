import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { ThemeProvider } from 'next-themes'

import './globals.css'

import { SiteFooter } from '@/components/site-footer'
import { cn } from '@/lib/utils'

const geistSans = Geist({
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Character Counter Pro | Professional Text Analysis Tool',
    template: '%s | Character Counter Pro',
  },
  description:
    'Professional online character counter tool with real-time counting for characters, words, sentences, and paragraphs. Perfect for writers, students, and social media users.',
  keywords: [
    'character counter',
    'word counter',
    'text analysis',
    'sentence counter',
    'paragraph counter',
    'reading time calculator',
    'free text tools',
    'online text analysis',
  ],
  authors: [
    {
      name: 'Character Counter Pro Team',
    },
  ],
  creator: 'Character Counter Pro',
  publisher: 'Character Counter Pro',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'https://charactercounter.example.com'
  ),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Character Counter Pro | Professional Text Analysis Tool',
    description:
      'Professional online character counter tool with real-time counting for characters, words, sentences, and paragraphs.',
    siteName: 'Character Counter Pro',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Character Counter Pro | Professional Text Analysis Tool',
    description:
      'Professional online character counter tool with real-time counting.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="scroll-smooth">
      <body
        className={cn(
          geistSans.className,
          geistMono.variable,
          'flex min-h-svh flex-col items-center justify-center antialiased'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <main className="flex w-full flex-col items-center justify-center">
            {children}
          </main>
          <SiteFooter />
        </ThemeProvider>
      </body>
    </html>
  )
}
