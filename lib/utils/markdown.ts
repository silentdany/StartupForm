import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const blogDirectory = path.join(process.cwd(), 'content/blog')

export interface BlogPostFrontmatter {
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
  relatedPosts?: string[]
}

export interface BlogPost extends BlogPostFrontmatter {
  content: string
}

export function getBlogPostSlugs() {
  try {
    return fs.readdirSync(blogDirectory)
  } catch (error) {
    console.error('Error reading blog directory:', error)
    return []
  }
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  try {
    const fullPath = path.join(blogDirectory, slug, 'index.md')
    const fileContents = fs.readFileSync(fullPath, 'utf8')

    // Use gray-matter to parse the post metadata section
    const { data, content } = matter(fileContents)

    // Validate front matter
    const frontmatter = data as BlogPostFrontmatter

    if (!frontmatter.slug) {
      frontmatter.slug = slug
    }

    return {
      ...frontmatter,
      content: content, // Return raw markdown content
    }
  } catch (error) {
    console.error(`Error reading blog post ${slug}:`, error)
    return null
  }
}

export function getAllBlogPosts(): BlogPost[] {
  const slugs = getBlogPostSlugs()
  const posts = slugs
    .map((slug) => getBlogPostBySlug(slug))
    .filter((post): post is BlogPost => post !== null)

  // Sort posts by date (newest first)
  return posts.sort((a, b) => {
    return new Date(b.date).getTime() - new Date(a.date).getTime()
  })
}

// Separate async function to convert markdown to HTML
export async function getPostWithHtml(slug: string): Promise<BlogPost | null> {
  const post = getBlogPostBySlug(slug)

  if (!post) return null

  try {
    const processedContent = await remark()
      .use(html, { sanitize: false })
      .process(post.content)

    return {
      ...post,
      content: processedContent.toString(),
    }
  } catch (error) {
    console.error('Error converting markdown to HTML:', error)
    return post
  }
}
