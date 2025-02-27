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
  title: 'Character Counter Pro',
  description:
    'Professional online character counter tool with real-time counting for characters, words, sentences, and paragraphs.',
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
