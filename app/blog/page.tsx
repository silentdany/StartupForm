import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Calendar, Clock } from 'lucide-react'

export const metadata: Metadata = {
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
  openGraph: {
    title: 'Character Counter Pro Blog | Tips for Content Creators',
    description:
      'Learn about character limits, word count best practices, and how to optimize your content with our writing tools and tips.',
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
}

// Enhanced blog posts data based on actual article content from [slug]/page.tsx
const blogPosts: BlogPost[] = [
  {
    id: '1',
    title: 'The Science Behind Optimal Word Count for SEO and Engagement',
    description:
      'Research-based guidelines for content length to maximize both search visibility and reader engagement across different platforms.',
    date: 'January 15, 2025',
    readTime: '4 min read',
    slug: 'optimal-word-count',
    image:
      'https://images.unsplash.com/photo-1501504905252-473c47e087f8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'SEO',
    excerpt:
      'The average word count of content ranking on page 1 of Google is 1,890 words, but ideal content length varies significantly by industry, intent, and platform. Learn the ideal length for different content formats.',
    featured: true,
  },
  {
    id: '2',
    title: 'Complete Guide to Social Media Character Limits in 2025',
    description:
      'Stay up-to-date with the latest character limits across all major social media platforms with platform-specific optimization tips.',
    date: 'January 22, 2025',
    readTime: '3 min read',
    slug: 'social-media-character-limits',
    image:
      'https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Social Media',
    excerpt:
      'Character limits define the boundaries of digital communication. Master the exact limits for Twitter/X (280), Instagram (2,200), Facebook (63,206), LinkedIn (3,000), and more with platform-specific optimization strategies.',
  },
  {
    id: '3',
    title: 'Advanced SEO Techniques: How Content Length Impacts Rankings',
    description:
      'In-depth analysis of how word count affects SEO rankings with actionable strategies for content optimization.',
    date: 'January 28, 2025',
    readTime: '8 min read',
    slug: 'seo-friendly-content',
    image:
      'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'SEO',
    excerpt:
      'Content in the top 3 positions of Google SERPs averages 1,890 words across all industries. Our analysis of content performance shows how length correlates with SERP performance, while revealing the four dimensions of effective content length strategy.',
  },
  {
    id: '4',
    title: 'The Depressing Science of Reading Time Calculations',
    description:
      "A painfully precise analysis of how reading time is calculated, why most estimates are wrong, and why it probably doesn't matter anyway.",
    date: 'February 10, 2025',
    readTime: '8 min read',
    slug: 'science-of-reading-time',
    image:
      'https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Content Analytics',
    excerpt:
      'Reading time estimates are off by an average of 52.7%. Dive into the flawed mathematics of reading time calculations, the variables that are routinely ignored, and how different content types dramatically affect actual reading speeds.',
  },
  {
    id: '5',
    title: 'Email Subject Line Optimization: Character Count Best Practices',
    description:
      'Data-driven strategies for crafting email subject lines that boost open rates and conversions.',
    date: 'February 3, 2025',
    readTime: '5 min read',
    slug: 'email-subject-line-optimization',
    image:
      'https://images.unsplash.com/photo-1516387938699-a93567ec168e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Email Marketing',
    excerpt:
      'The overall average open rate for emails is 21.33%. Subject lines with 21-40 characters have a 3.08% higher open rate than average, while personalized subject lines achieve a 22.3% higher open rate on average.',
  },
  {
    id: '6',
    title: 'Quality vs. Quantity: The Meaningless Debate in Content Creation',
    description:
      'A data-driven analysis of the relationship between content length and perceived quality, and why obsessing over either metric is an exercise in futility.',
    date: 'February 20, 2025',
    readTime: '10 min read',
    slug: 'content-length-vs-quality',
    image:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80',
    category: 'Content Strategy',
    excerpt:
      'When asked to define "quality content," 83.6% of marketing professionals cited subjective criteria that could not be consistently measured, while simultaneously using word count as a primary metric in their content planning. The irony is almost too painful to contemplate.',
  },
]

export default function BlogPage() {
  // Find the featured post
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 md:px-6 lg:px-8">
      {/* Page Header */}
      <div className="mb-12 max-w-3xl">
        <h1 className="mb-3 text-4xl font-bold tracking-tight lg:text-5xl">
          Text & Content <span className="text-primary">Insights</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl">
          Expert tips, research, and strategies for optimizing your writing
          across all digital platforms.
        </p>
      </div>

      {/* Featured Article */}
      {featuredPost && (
        <div className="mb-16">
          <div className="text-primary mb-2 text-sm font-medium tracking-wide uppercase">
            Featured Article
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
        <h2 className="mb-6 text-2xl font-bold">Latest Articles</h2>
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
        <h3 className="mb-2 text-2xl font-bold">
          Get Content Optimization Tips
        </h3>
        <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
          Subscribe to our newsletter for expert advice on content length,
          readability, SEO best practices, and more.
        </p>
        <div className="mx-auto flex max-w-md flex-col gap-2 sm:flex-row">
          <Input placeholder="Enter your email" className="flex-1" />
          <Button>Subscribe</Button>
        </div>
        <p className="text-muted-foreground mt-4 text-xs">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </div> */}

      {/* CTA Section */}
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-2xl font-bold">
          Need help with your content length?
        </h2>
        <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">
          Try our free character counter tool to optimize your content for
          social media, emails, SEO and more.
        </p>
        <Link
          href="/"
          className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center justify-center rounded-md px-6 py-3 font-medium shadow"
        >
          Use Character Counter Pro
        </Link>
      </div>
    </div>
  )
}
