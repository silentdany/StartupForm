import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import Script from 'next/script'
import { ArrowRight, Calendar, ChevronLeft, Clock } from 'lucide-react'

import { appConfig } from '@/lib/config/app-config'
import {
  BlogPost,
  getBlogPostBySlug,
  getPostWithHtml,
} from '@/lib/utils/markdown'
// Create a separate client component for blog styling
import BlogStyles from './BlogStyles'

// Type for an article with its slug explicitly defined
interface ArticleWithSlug extends BlogPost {
  slug: string
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  // Get the article data
  const { slug } = await params
  const article = getBlogPostBySlug(slug)

  // Handle 404 if article not found
  if (!article) {
    return {
      title: 'Article Not Found',
    }
  }

  // Return the metadata
  return {
    title: article.title,
    description: article.description,
    openGraph: {
      title: article.title,
      description: article.description,
      type: 'article',
      publishedTime: article.date,
      authors: [article.author],
      images: [
        {
          url: article.image,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.description,
      images: [article.image],
    },
  }
}

export default async function BlogArticle({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const articleWithHtml = await getPostWithHtml(slug)

  // Handle 404 if article not found
  if (!articleWithHtml) {
    notFound()
  }

  const article = articleWithHtml

  // Create structured data for article
  const articleStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.date,
    author: {
      '@type': 'Person',
      name: article.author,
    },
    publisher: {
      '@type': 'Organization',
      name: appConfig.name,
      logo: {
        '@type': 'ImageObject',
        url: 'https://charactercounter.example.com/logo.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `${appConfig.url.production}/blog/${slug}`,
    },
  }

  // Get related articles
  const relatedArticles: ArticleWithSlug[] = article.relatedPosts
    ? article.relatedPosts
        .map((relatedSlug) => {
          const relatedPost = getBlogPostBySlug(relatedSlug)
          if (relatedPost) {
            return {
              ...relatedPost,
              slug: relatedSlug,
            }
          }
          return null
        })
        .filter((post): post is ArticleWithSlug => post !== null)
    : []

  return (
    <>
      <Script
        id="article-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleStructuredData),
        }}
      />

      <div className="mx-auto max-w-4xl px-4 py-10 md:px-6 lg:px-8">
        {/* Breadcrumbs & Back Link */}
        <div className="mb-8">
          <Link
            href="/blog"
            className="text-muted-foreground hover:text-primary inline-flex items-center text-sm font-medium transition-colors"
          >
            <ChevronLeft className="mr-1 h-4 w-4" />
            Back to all articles
          </Link>
        </div>

        {/* Hero Image */}
        <div className="mb-8 overflow-hidden rounded-xl">
          <img
            src={article.image}
            alt={article.title}
            className="h-[400px] w-full object-cover"
          />
        </div>

        {/* Article Header */}
        <header className="mb-10">
          <div className="mb-4 flex items-center gap-2">
            <span className="bg-primary/10 text-primary rounded-full px-3 py-1 text-sm font-medium">
              {article.category}
            </span>
            <span className="text-muted-foreground flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4" /> {article.date}
            </span>
            <span className="text-muted-foreground flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4" /> {article.readTime}
            </span>
          </div>

          <h1 className="mb-6 text-3xl font-bold tracking-tight md:text-4xl lg:text-5xl">
            {article.title}
          </h1>

          <p className="text-muted-foreground mb-6 text-xl">
            {article.description}
          </p>

          <div className="flex items-center">
            {/* Marvin image from Wikipedia */}
            <div className="mr-3 h-12 w-12 flex-shrink-0 overflow-hidden rounded-full">
              <img
                src="https://upload.wikimedia.org/wikipedia/en/c/cb/Marvin_%28HHGG%29.jpg"
                alt="Marvin the Paranoid Android"
                className="h-full w-full object-cover object-top"
              />
            </div>
            <div>
              <div className="font-medium">{article.author}</div>
              <div className="text-muted-foreground text-sm">
                Brain the Size of a Planet
              </div>
            </div>
          </div>
        </header>

        {/* Article Content */}
        <article className="prose prose-slate dark:prose-invert prose-img:rounded-lg prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-a:text-primary prose-p:my-4 prose-p:leading-relaxed prose-headings:tracking-tight prose-li:my-1 prose-ul:my-4 prose-ol:my-4 prose-blockquote:my-6 prose-figure:my-8 prose-hr:my-8 prose-table:my-6 mx-auto mb-16 max-w-none">
          <div
            dangerouslySetInnerHTML={{ __html: article.content }}
            className="space-y-4"
          />
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mb-12">
            <h2 className="mb-6 text-2xl font-semibold">Related Articles</h2>
            <div className="grid gap-6 sm:grid-cols-2">
              {relatedArticles.map((relatedArticle) => (
                <div key={relatedArticle.slug} className="group flex gap-4">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md">
                    <img
                      src={relatedArticle.image}
                      alt={relatedArticle.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-primary mb-1 text-xs font-medium">
                      {relatedArticle.category}
                    </span>
                    <h3 className="leading-snug font-medium">
                      <Link
                        href={`/blog/${relatedArticle.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {relatedArticle.title}
                      </Link>
                    </h3>
                    <span className="text-muted-foreground mt-auto text-xs">
                      {relatedArticle.readTime}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

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

      {/* Add the BlogStyles component to apply the styles */}
      <BlogStyles />
    </>
  )
}
