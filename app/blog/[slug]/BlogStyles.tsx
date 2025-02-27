'use client'

export default function BlogStyles() {
  return (
    <style jsx global>{`
      .tip-box {
        background-color: rgba(var(--primary-rgb), 0.05);
        border-radius: 0.5rem;
        padding: 1.5rem;
        margin: 2rem 0;
        border-left: 4px solid var(--primary);
      }

      .tip-box h4 {
        margin-top: 0;
        font-size: 1.1rem;
        color: var(--primary);
      }

      .prose h2 {
        border-bottom: 1px solid rgba(var(--muted-foreground-rgb), 0.2);
        padding-bottom: 0.5rem;
      }

      .prose table th,
      .prose table td {
        padding: 0.75rem 1rem;
      }

      .prose figure {
        margin: 2.5rem auto;
      }

      .prose blockquote {
        font-style: italic;
        border-left-width: 4px;
        padding-left: 1.5rem;
        background-color: rgba(var(--muted-foreground-rgb), 0.05);
        padding: 1.5rem;
        border-radius: 0.5rem;
      }
    `}</style>
  )
}
