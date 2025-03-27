import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock, Text } from 'lucide-react'

import { appConfig } from '@/lib/config/app-config'

export const metadata: Metadata = {
  title: appConfig.blog.metadata.title,
  description: appConfig.blog.metadata.description,
  keywords: appConfig.blog.metadata.keywords,
  openGraph: {
    title: `${appConfig.name} Blog | Tips for Content Creators`,
    description: appConfig.blog.metadata.description,
    type: 'website',
  },
}

interface BlogPost {
  id: string
  title: string
  description: string
  date: string
  readTime: string
  slug: string
  image: string
  category: string
  excerpt: string
  featured?: boolean
  author: string
}

export default function BlogPage() {
  // Use blog posts from app configuration
  const blogPosts: BlogPost[] = appConfig.blog.posts

  // Find the featured post
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-12 max-w-3xl">
        <h1
          className="mb-3 text-4xl font-bold tracking-tight lg:text-5xl"
          dangerouslySetInnerHTML={{ __html: appConfig.blog.pageContent.title }}
        ></h1>
        <p className="text-muted-foreground text-lg md:text-xl">
          {appConfig.blog.pageContent.description}
        </p>
      </div>

      {/* Featured Article */}
      {featuredPost && (
        <div className="mb-16">
          <div className="text-primary mb-2 text-sm font-medium tracking-wide uppercase">
            {appConfig.blog.pageContent.featuredLabel}
          </div>
          <div className="group bg-card overflow-hidden rounded-xl border shadow-sm transition-all hover:shadow-md">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="aspect-video w-full overflow-hidden md:aspect-auto md:h-full">
                <img
                  src={featuredPost.image}
                  alt={featuredPost.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-col justify-center p-6">
                <div className="text-primary mb-2 flex items-center gap-2 text-sm">
                  <span className="bg-primary/10 rounded-full px-3 py-1">
                    {featuredPost.category}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {featuredPost.date}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {featuredPost.readTime}
                  </span>
                </div>
                <h2 className="mb-2 text-2xl font-bold tracking-tight md:text-3xl">
                  {featuredPost.title}
                </h2>
                <p className="text-muted-foreground mb-4 text-base md:text-lg">
                  {featuredPost.excerpt}
                </p>
                <div className="mt-auto">
                  <Link
                    href={`/blog/${featuredPost.slug}`}
                    className="text-primary inline-flex items-center text-sm font-medium transition-colors hover:underline"
                  >
                    Read Full Article
                    <ArrowRight className="ml-1 h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Regular Articles Grid */}
      <div className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">
          {appConfig.blog.pageContent.latestLabel}
        </h2>
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {regularPosts.map((post) => (
            <article
              key={post.id}
              className="group bg-card flex h-full flex-col overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={post.image}
                  alt={post.title}
                  className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="text-primary mb-2 flex flex-wrap items-center gap-2 text-xs">
                  <span className="bg-primary/10 rounded-full px-3 py-1">
                    {post.category}
                  </span>
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {post.readTime}
                  </span>
                </div>
                <h3 className="mb-2 text-xl leading-tight font-semibold">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-primary transition-colors"
                  >
                    {post.title}
                  </Link>
                </h3>
                <p className="text-muted-foreground mb-4 flex-1 text-sm">
                  {post.description}
                </p>
                <div className="mt-auto flex items-center justify-between">
                  <span className="text-muted-foreground text-xs">
                    {post.date}
                  </span>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-primary inline-flex items-center text-sm font-medium transition-colors hover:underline"
                  >
                    Read More
                    <ArrowRight className="ml-1 h-3 w-3" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter Signup */}
      {/* <div className="bg-card/50 mb-12 rounded-xl border p-8 text-center shadow-sm">
        <div className="mx-auto max-w-xl">
          <h3 className="mb-3 text-2xl font-semibold">
            Get Content Tips in Your Inbox
          </h3>
          <p className="text-muted-foreground mb-6">
            Subscribe to our newsletter for weekly insights on content
            optimization, character limits, and writing strategies.
          </p>
          <div className="flex flex-col gap-2 sm:flex-row">
            <input
              type="email"
              placeholder="Enter your email"
              className="border-input bg-background text-foreground placeholder:text-muted-foreground flex-1 rounded-lg border p-2 text-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            />
            <button className="bg-primary hover:bg-primary/90 text-primary-foreground inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium shadow transition-colors">
              Subscribe
            </button>
          </div>
          <p className="text-muted-foreground mt-4 text-xs">
            We respect your privacy. Unsubscribe at any time.
          </p>
        </div>
      </div> */}

      {/* Helpful Resources */}
      <div className="bg-card rounded-xl border p-6 shadow-sm">
        <h3 className="mb-4 text-xl font-semibold">Helpful Resources</h3>
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          <Link
            href="/"
            className="group bg-background hover:bg-primary/5 flex flex-col items-center rounded-lg border p-4 text-center transition-colors"
          >
            <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <Text className="text-primary h-6 w-6" />
            </div>
            <h4 className="mb-1 font-medium">Character Counter</h4>
            <p className="text-muted-foreground text-sm">
              Count characters, words, and sentences instantly
            </p>
          </Link>
          <Link
            href="/blog/social-media-character-limits"
            className="group bg-background hover:bg-primary/5 flex flex-col items-center rounded-lg border p-4 text-center transition-colors"
          >
            <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 12a9 9 0 0 1-9 9m9-9a9 9 0 0 0-9-9m9 9H3m9 9a9 9 0 0 1-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
              </svg>
            </div>
            <h4 className="mb-1 font-medium">Social Media Limits</h4>
            <p className="text-muted-foreground text-sm">
              Platform-specific character limits guide
            </p>
          </Link>
          <Link
            href="/blog/science-of-reading-time"
            className="group bg-background hover:bg-primary/5 flex flex-col items-center rounded-lg border p-4 text-center transition-colors"
          >
            <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary h-6 w-6"
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
            </div>
            <h4 className="mb-1 font-medium">Reading Time</h4>
            <p className="text-muted-foreground text-sm">
              Learn how reading time is calculated
            </p>
          </Link>
          <Link
            href="/blog/email-subject-line-optimization"
            className="group bg-background hover:bg-primary/5 flex flex-col items-center rounded-lg border p-4 text-center transition-colors"
          >
            <div className="bg-primary/10 mb-3 flex h-12 w-12 items-center justify-center rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="text-primary h-6 w-6"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </div>
            <h4 className="mb-1 font-medium">Email Optimization</h4>
            <p className="text-muted-foreground text-sm">
              Subject line character count best practices
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
