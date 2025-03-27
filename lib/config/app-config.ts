/**
 * App configuration
 * This file contains all the configurable parameters for your mini-app
 */

export const appConfig = {
  // App information
  name: 'Random App Boilerplate',
  shortName: 'Random App',
  description:
    'This app is a simple boilerplate for testing and development purposes.',
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
      default: 'Random App Boilerplate',
      template: '%s | Random App Boilerplate',
    },
    description:
      'This app is a simple boilerplate for testing and develo  pment purposes.',
    keywords: [
      'random app',
      'boilerplate',
      'testing',
      'development',
      'random app boilerplate',
    ],
    authors: [
      {
        name: 'Random App Boilerplate Team',
      },
    ],
    creator: 'Random App Boilerplate',
    publisher: 'Random App Boilerplate',

    // Open Graph
    openGraph: {
      type: 'website',
      locale: 'en_US',
      title: 'Random App Boilerplate',
      description:
        'This app is a simple boilerplate for testing and development purposes.',
      siteName: 'Random App Boilerplate',
    },

    // Twitter
    twitter: {
      card: 'summary_large_image',
      title: 'Random App Boilerplate',
      description:
        'This app is a simple boilerplate for testing and development purposes.',
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
