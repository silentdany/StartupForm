/**
 * App configuration
 * This file contains all the configurable parameters for your mini-app
 */

export const appConfig = {
  // App information
  name: 'Character Counter Pro',
  shortName: 'Character Counter',
  description: 'Count characters, words, sentences and more as you type',
  version: '0.1.0',

  // URL configuration
  url: {
    production:
      process.env.NEXT_PUBLIC_APP_URL || 'https://charactercounter.example.com',
    development: 'http://localhost:3000',
  },

  // SEO and metadata
  seo: {
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

    // Open Graph
    openGraph: {
      type: 'website',
      locale: 'en_US',
      title: 'Character Counter Pro | Professional Text Analysis Tool',
      description:
        'Professional online character counter tool with real-time counting for characters, words, sentences, and paragraphs.',
      siteName: 'Character Counter Pro',
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: 'Character Counter Pro | Professional Text Analysis Tool',
      description:
        'Professional online character counter tool with real-time counting.',
    },
  },

  // Content sections
  content: {
    intro: {
      title: 'Professional Online Character Counter Tool',
      description:
        'provides instant character count & word count statistics for text. It reports the number of characters with spaces, characters without spaces, words, sentences, paragraphs, and social media character limits.',
    },
    features: [
      {
        title: 'Accurate Counting',
        description:
          'Precisely count characters, words, sentences, and paragraphs',
        icon: 'text',
      },
      {
        title: 'Social Media Limits',
        description:
          'Check your text against popular platform character limits',
        icon: 'globe',
      },
      {
        title: 'Reading Time',
        description: 'Estimate how long it takes to read your content',
        icon: 'clock',
      },
      {
        title: 'Professional Analysis',
        description: 'Get insights on text complexity and readability',
        icon: 'fileText',
      },
      {
        title: 'SEO-Friendly',
        description: 'Optimize your content length for search engines',
        icon: 'star',
      },
      {
        title: 'No Registration',
        description: 'Use all basic features without signing up',
        icon: 'userPlus',
      },
    ],
    characterLimits: {
      title: 'Common Character Limits',
      platforms: [
        { name: 'Twitter/X', limit: 280 },
        { name: 'SMS', limit: 160 },
        { name: 'Instagram', limit: 2200 },
        { name: 'LinkedIn', limit: 3000 },
        { name: 'Facebook', limit: 63206 },
        { name: 'Reddit Title', limit: 300 },
      ],
    },
  },

  // Blog configuration
  blog: {
    // Blog page metadata
    metadata: {
      title: 'Blog | Tips for Content Creators and Writers',
      description:
        'Learn about character limits, word count best practices, and how to optimize your content with our writing tools and tips.',
      keywords: [
        'character count tips',
        'word count guide',
        'content writing',
        'social media character limits',
        'SEO writing tips',
        'optimal content length',
        'content creation',
        'digital writing',
      ],
    },
    // Blog page content
    pageContent: {
      title: 'Text & Content <span class="text-primary">Insights</span>',
      description:
        'Expert tips, research, and strategies for optimizing your writing across all digital platforms.',
      featuredLabel: 'Featured Article',
      latestLabel: 'Latest Articles',
    },
  },

  // Social media limits for the counter app
  // Remove or customize this section for different app types
  socialMedia: {
    platforms: [
      { name: 'Twitter/X', limit: 280, color: 'bg-blue-400 dark:bg-blue-500' },
      { name: 'SMS', limit: 160, color: 'bg-green-400 dark:bg-green-500' },
      {
        name: 'Instagram Caption',
        limit: 2200,
        color: 'bg-pink-400 dark:bg-pink-500',
      },
      {
        name: 'LinkedIn Post',
        limit: 3000,
        color: 'bg-sky-400 dark:bg-sky-500',
      },
      {
        name: 'Facebook Post',
        limit: 63206,
        color: 'bg-indigo-400 dark:bg-indigo-500',
      },
      {
        name: 'TikTok Caption',
        limit: 2200,
        color: 'bg-purple-400 dark:bg-purple-500',
      },
      {
        name: 'Reddit Title',
        limit: 300,
        color: 'bg-orange-400 dark:bg-orange-500',
      },
    ],
  },

  // Site configuration
  site: {
    // Footer links
    footer: {
      links: [
        { name: 'Home', href: '/' },
        { name: 'About', href: '/about' },
        { name: 'Blog', href: '/blog' },
        { name: 'Privacy', href: '/privacy' },
        { name: 'Terms', href: '/terms' },
      ],
    },
  },

  // Feature flags
  features: {
    analytics: true,
    darkMode: true,
    showAds: false,
  },

  // FAQ section
  faq: {
    title: 'Frequently Asked Questions',
    items: [
      {
        question: 'What is a character counter tool?',
        answer:
          'A character counter tool is an online utility that allows you to count the number of characters, words, sentences and paragraphs in a text. Our Character Counter Pro provides real-time counting and additional features like social media limits checking and reading time estimation.',
      },
      {
        question: 'Why would I need to count characters?',
        answer:
          'Character counting is essential for many purposes including: staying within social media character limits, writing SEO-optimized meta descriptions, creating concise email subject lines, writing SMS messages, and ensuring content fits within specific requirements for applications, forms, or publications.',
      },
      {
        question: 'Does Character Counter Pro count spaces?',
        answer:
          'Yes, Character Counter Pro counts spaces as characters in the total count. However, we also provide a separate count for characters excluding spaces, giving you both metrics for your convenience.',
      },
      {
        question: 'How does Character Counter Pro calculate reading time?',
        answer:
          'Our reading time calculation is based on the average reading speed of 200 words per minute for digital content. This provides an estimate of how long it would take an average person to read your text from start to finish.',
      },
      {
        question: 'Is Character Counter Pro free to use?',
        answer:
          'Yes, Character Counter Pro is completely free to use with no limitations. You can count text of any length as many times as you need without creating an account or subscribing to a service.',
      },
      {
        question: 'Does Character Counter Pro save my text?',
        answer:
          'No, Character Counter Pro does not save, store, or collect any of the text you input. All processing happens locally in your browser for maximum privacy and security.',
      },
      {
        question:
          'What social media character limits does Character Counter Pro track?',
        answer:
          'Character Counter Pro tracks character limits for major social media platforms including Twitter/X (280 characters), Instagram captions (2,200 characters), Facebook posts (63,206 characters), LinkedIn posts (3,000 characters), and more.',
      },
    ],
  },
}

// Helper to get current URL based on environment
export function getBaseUrl() {
  if (typeof window !== 'undefined') return '' // Browser should use relative URL
  if (process.env.NODE_ENV === 'development') return appConfig.url.development
  return appConfig.url.production
}

// Export other config constants
export const isProduction = process.env.NODE_ENV === 'production'
export const isDevelopment = process.env.NODE_ENV === 'development'
