'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Github, LucideIcon, Text } from 'lucide-react'

interface NavigationItem {
  name: string
  href: string
}

type IconComponent =
  | LucideIcon
  | (({ className }: { className?: string }) => React.ReactElement)

interface SocialItem extends NavigationItem {
  icon: IconComponent
}

const navigation: {
  features: NavigationItem[]
  resources: NavigationItem[]
  categories: NavigationItem[]
  popular: NavigationItem[]
  legal: NavigationItem[]
  social: SocialItem[]
} = {
  features: [
    { name: 'Character Counter', href: '/' },
    { name: 'IndiesReadIt', href: 'https://indiesread.it' },
  ],
  resources: [
    { name: 'Blog', href: '/blog' },
    { name: 'Reading Time Calculator', href: '/blog/science-of-reading-time' },
    {
      name: 'Email Subject Optimization',
      href: '/blog/email-subject-line-optimization',
    },
  ],
  popular: [
    { name: 'Optimal Word Count', href: '/blog/optimal-word-count' },
    {
      name: 'Social Media Limits',
      href: '/blog/social-media-character-limits',
    },
    { name: 'Quality vs. Quantity', href: '/blog/content-length-vs-quality' },
  ],
  legal: [
    { name: 'Privacy', href: '/privacy' },
    { name: 'Terms', href: '/terms' },
  ],
  social: [
    {
      name: 'X',
      href: 'https://twitter.com/MajorBaguette',
      icon: ({ className }: { className?: string }) => (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={className}
        >
          <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
          <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
        </svg>
      ),
    },
    {
      name: 'GitHub',
      href: 'https://github.com/silentdany',
      icon: Github,
    },
  ],
}

export function SiteFooter() {
  const pathname = usePathname()
  const currentYear = new Date().getFullYear()

  // Hide on specific routes if needed
  if (pathname?.startsWith('/dashboard')) return null

  return (
    <footer
      className="bg-muted/40 w-full border-t"
      aria-labelledby="footer-heading"
    >
      <h2 id="footer-heading" className="sr-only">
        Footer
      </h2>
      <div className="container mx-auto max-w-screen-2xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <div className="xl:grid xl:grid-cols-5 xl:gap-8">
          <div className="flex flex-col items-center space-y-8 text-center xl:col-span-1 xl:items-start xl:text-left">
            <div className="inline-flex items-center gap-2 font-semibold">
              <Text className="text-primary h-6 w-6" />
              <span>
                Character Counter <span className="text-primary">Pro</span>
              </span>
            </div>
            <p className="text-muted-foreground max-w-xs text-sm">
              Professional text analysis tool that counts characters, words,
              sentences, and paragraphs with advanced features for content
              creators.
            </p>
            <div className="flex space-x-6">
              {navigation.social.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="text-muted-foreground hover:text-foreground"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.name} social link`}
                >
                  <span className="sr-only">{item.name}</span>
                  {React.createElement(
                    typeof item.icon === 'function' ? item.icon : item.icon,
                    { className: 'h-5 w-5', 'aria-hidden': true }
                  )}
                </Link>
              ))}
            </div>
          </div>
          <div className="mt-12 grid grid-cols-2 gap-8 md:grid-cols-4 xl:col-span-4 xl:mt-0">
            <div>
              <h3 className="text-sm font-semibold">Tools</h3>
              <ul role="list" className="mt-4 space-y-4">
                {navigation.features.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm"
                      target={
                        item.href.startsWith('http') ? '_blank' : undefined
                      }
                      rel={
                        item.href.startsWith('http')
                          ? 'noopener noreferrer'
                          : undefined
                      }
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Resources</h3>
              <ul role="list" className="mt-4 space-y-4">
                {navigation.resources.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Popular Articles</h3>
              <ul role="list" className="mt-4 space-y-4">
                {navigation.popular.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-semibold">Legal</h3>
              <ul role="list" className="mt-4 space-y-4">
                {navigation.legal.map((item) => (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className="text-muted-foreground hover:text-foreground text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-12 border-t pt-8 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {currentYear} Character Counter Pro. All rights reserved.
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            <Link href="/sitemap.xml" className="hover:text-foreground">
              Sitemap
            </Link>
          </p>
        </div>
      </div>
    </footer>
  )
}
