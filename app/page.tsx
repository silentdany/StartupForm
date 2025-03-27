// import { Suspense } from 'react'
import type { Metadata } from 'next'
import { Text } from 'lucide-react'

// import AdBanner from '@/components/ads/ad-banner'
import { CharacterCounterFAQ } from '@/components/faq-section'
import { ThemeToggle } from '@/components/theme-toggle'
import { appConfig } from '@/lib/config/app-config'

export const metadata: Metadata = {
  title: `${appConfig.name} `,
  description: appConfig.description,
  keywords: appConfig.seo.keywords,
  openGraph: {
    title: `${appConfig.name}`,
    description: appConfig.seo.description,
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
            {appConfig.shortName} <span className="text-primary">Pro</span>
          </h1>
        </div>
        <p className="text-muted-foreground mb-6 text-center">
          {appConfig.description}
        </p>
      </div>

      {/* Top Ad Banner */}
      {/* <Suspense fallback={<div className="bg-muted h-12 animate-pulse" />}>
        <AdBanner position="top" />
      </Suspense> */}

      {/* Main Character Counter Component */}
      <div className="w-full">
        <div className="bg-card overflow-hidden rounded-lg border shadow-sm">
          <div className="border-b p-6 pb-4">
            <h3 className="text-xl font-semibold">Your App Content</h3>
            <p className="text-muted-foreground mt-1 text-sm">
              Replace this with your actual app functionality
            </p>
          </div>

          <div className="p-6">
            {/* Main content area */}
            <div className="space-y-6">
              {/* Placeholder item 1 */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="bg-muted h-8 w-48 animate-pulse rounded"></div>
                  <div className="bg-muted h-8 w-24 animate-pulse rounded"></div>
                </div>
                <div className="bg-muted h-24 w-full animate-pulse rounded"></div>
              </div>

              {/* Placeholder item 2 */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div key={item} className="rounded-lg border p-4">
                    <div className="bg-muted mb-3 h-6 w-36 animate-pulse rounded"></div>
                    <div className="bg-muted mb-2 h-4 w-full animate-pulse rounded"></div>
                    <div className="bg-muted mb-2 h-4 w-3/4 animate-pulse rounded"></div>
                    <div className="bg-muted h-4 w-5/6 animate-pulse rounded"></div>
                  </div>
                ))}
              </div>

              {/* Placeholder item 3 */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="bg-muted h-48 w-full animate-pulse rounded-lg sm:w-64"></div>
                <div className="flex-1 space-y-3">
                  <div className="bg-muted h-6 w-3/4 animate-pulse rounded"></div>
                  <div className="bg-muted h-4 w-full animate-pulse rounded"></div>
                  <div className="bg-muted h-4 w-full animate-pulse rounded"></div>
                  <div className="bg-muted h-4 w-2/3 animate-pulse rounded"></div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="mt-6 flex justify-end space-x-2">
                <div className="bg-muted h-9 w-24 animate-pulse rounded"></div>
                <div className="bg-primary/20 h-9 w-24 animate-pulse rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Ad Banner */}
      {/* <Suspense fallback={<div className="bg-muted h-12 animate-pulse" />}>
        <AdBanner position="bottom" />
      </Suspense> */}

      {/* Redesigned SEO Content */}
      <section className="mt-16 space-y-12">
        {/* Main intro section */}
        <div className="text-center">
          <h2 className="mb-4 text-2xl font-bold tracking-tight">
            {appConfig.content.intro.title}
          </h2>
          <p className="text-muted-foreground mx-auto max-w-2xl">
            {appConfig.shortName}{' '}
            <span className="text-primary font-medium">Pro</span>{' '}
            {appConfig.content.intro.description}
          </p>
        </div>

        {/* Features section */}
        <div>
          <h3 className="mb-6 text-center text-xl font-semibold">
            Why Choose {appConfig.shortName} Pro?
          </h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {appConfig.content.features.map((feature, index) => (
              <div
                key={index}
                className="bg-card rounded-lg border p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start space-x-3">
                  <div className="bg-primary/10 rounded-full p-2">
                    {feature.icon === 'text' && (
                      <Text className="text-primary h-5 w-5" />
                    )}
                    {feature.icon === 'globe' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                      </svg>
                    )}
                    {feature.icon === 'clock' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <polyline points="12 6 12 12 16 14" />
                      </svg>
                    )}
                    {feature.icon === 'fileText' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                        <line x1="16" y1="13" x2="8" y2="13" />
                        <line x1="16" y1="17" x2="8" y2="17" />
                        <polyline points="10 9 9 9 8 9" />
                      </svg>
                    )}
                    {feature.icon === 'star' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                      </svg>
                    )}
                    {feature.icon === 'userPlus' && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="text-primary h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                        <circle cx="8.5" cy="7" r="4" />
                        <line x1="20" y1="8" x2="20" y2="14" />
                        <line x1="23" y1="11" x2="17" y2="11" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium">{feature.title}</h4>
                    <p className="text-muted-foreground mt-1 text-sm">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Frequently Asked Questions */}
        <CharacterCounterFAQ />
      </section>
    </div>
  )
}
