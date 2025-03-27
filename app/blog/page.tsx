import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'

import { appConfig } from '@/lib/config/app-config'
import { BlogPost, getAllBlogPosts } from '@/lib/utils/markdown'

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

export default function BlogPage() {
  // Use blog posts from markdown files
  const blogPosts: BlogPost[] = getAllBlogPosts()

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

      {/* CTA */}
      <div className="bg-primary/5 rounded-xl border p-8 text-center">
        <h3 className="mb-2 text-2xl font-bold">Try {appConfig.name}</h3>
        <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
          {appConfig.shortName} {appConfig.content.intro.description}
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-6 py-3 font-medium shadow"
        >
          Try {appConfig.name} Free
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    </div>
  )
}
