import { MetadataRoute } from 'next'

import { getBlogPostSlugs } from '@/lib/utils/markdown'

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://charactercounter.example.com'

  const lastModified = new Date()

  // Main site routes
  const routes = [
    {
      url: `${baseUrl}`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 1,
    },

    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
  ]

  // Get blog post slugs from markdown files
  const blogPostSlugs = getBlogPostSlugs()

  // Add blog post routes
  const blogRoutes = blogPostSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...blogRoutes]
}
