import { MetadataRoute } from 'next'

// Mock blog post slugs - in a real app these would come from a CMS or database
const blogPostSlugs = [
  'optimal-word-count',
  'social-media-character-limits',
  'seo-friendly-content',
  'science-of-reading-time',
  'essential-writing-tools',
]

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
      url: `${baseUrl}/counter`,
      lastModified,
      changeFrequency: 'monthly' as const,
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: 'yearly' as const,
      priority: 0.5,
    },
  ]

  // Add blog post routes
  const blogRoutes = blogPostSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }))

  return [...routes, ...blogRoutes]
}
