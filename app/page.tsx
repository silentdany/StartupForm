// import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Text } from 'lucide-react'

// import AdBanner from '@/components/ads/ad-banner'
import CharacterCounter from '@/components/character-counter/counter'
import { ThemeToggle } from '@/components/theme-toggle'

export const metadata: Metadata = {
  title: 'Character Counter Pro | Count Characters, Words, and More',
  description:
    'Professional online character counter tool with real-time character, word, sentence, and paragraph counting. Perfect for Twitter, essays, and social media posts.',
  keywords:
    'character counter pro, word counter, text counter, online character count, character limit checker, twitter character count, social media character limit',
  openGraph: {
    title: 'Character Counter Pro | Count Characters, Words, and More',
    description:
      'Professional online character counter tool with real-time character, word, sentence, and paragraph counting. Perfect for Twitter, essays, and social media posts.',
    type: 'website',
  },
}

export default function Home() {
  return (
    <div className="relative container px-4 py-8 sm:px-6 lg:px-8">
      <div className="absolute top-2 right-2 z-10">
        <ThemeToggle />
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="mb-2 flex items-center gap-2">
          <Text className="text-primary h-8 w-8" aria-hidden="true" />
          <h1 className="text-3xl font-bold">
            Character Counter <span className="text-primary">Pro</span>
          </h1>
        </div>
        <p className="text-muted-foreground mb-6 text-center">
          Count characters, words, sentences and more as you type
        </p>
      </div>

      {/* Top Ad Banner */}
      {/* <Suspense fallback={<div className="bg-muted h-12 animate-pulse" />}>
        <AdBanner position="top" />
      </Suspense> */}

      {/* Main Character Counter Component */}
      <CharacterCounter />

      {/* Bottom Ad Banner */}
      {/* <Suspense fallback={<div className="bg-muted h-12 animate-pulse" />}>
        <AdBanner position="bottom" />
      </Suspense> */}

      {/* SEO Content */}
      <section className="prose prose-sm dark:prose-invert mt-12 max-w-none">
        <h2 className="mb-4 text-2xl font-semibold">
          Professional Online Character Counter Tool
        </h2>
        <p>
          Character Counter{' '}
          <span className="text-primary font-medium">Pro</span> provides instant
          character count & word count statistics for text. It reports the
          number of characters with spaces, characters without spaces, words,
          sentences, paragraphs, and social media character limits. Perfect for
          writers, students, and professionals who need to stay within specific
          character limits.
        </p>

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          Why Choose Character Counter Pro?
        </h3>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Accurate Counting:</strong> Precisely count characters,
            words, sentences, and paragraphs
          </li>
          <li>
            <strong>Social Media Limits:</strong> Check your text against
            popular platform character limits
          </li>
          <li>
            <strong>Reading Time:</strong> Estimate how long it takes to read
            your content
          </li>
          <li>
            <strong>Professional Analysis:</strong> Get insights on text
            complexity and readability
          </li>
          <li>
            <strong>SEO-Friendly:</strong> Optimize your content length for
            search engines
          </li>
          <li>
            <strong>No Registration Required:</strong> Use all basic features
            without signing up
          </li>
        </ul>

        <h3 className="mt-6 mb-3 text-xl font-semibold">
          Common Character Limits
        </h3>
        <ul className="list-disc space-y-2 pl-5">
          <li>
            <strong>Twitter/X:</strong> 280 characters
          </li>
          <li>
            <strong>SMS:</strong> 160 characters
          </li>
          <li>
            <strong>Instagram:</strong> 2,200 characters for captions
          </li>
          <li>
            <strong>Facebook:</strong> 63,206 characters for posts
          </li>
          <li>
            <strong>LinkedIn:</strong> 700 characters for posts, 3,000 for
            articles
          </li>
          <li>
            <strong>Pinterest:</strong> 500 characters for descriptions
          </li>
        </ul>
      </section>
    </div>
  )
}
