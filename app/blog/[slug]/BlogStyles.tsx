'use client'

export default function BlogStyles() {
  return (
    <style jsx global>{`
      /* Tip box styling */
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

      /* Heading styles with clear hierarchy */
      .prose h2 {
        font-size: 2rem;
        font-weight: 700;
        color: var(--foreground);
        margin-top: 2.5rem;
        margin-bottom: 1.5rem;
        border-bottom: 1px solid rgba(var(--muted-foreground-rgb), 0.2);
        padding-bottom: 0.5rem;
      }

      .prose h3 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--foreground);
        margin-top: 2rem;
        margin-bottom: 1rem;
      }

      .prose h4 {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--foreground);
        margin-top: 1.5rem;
        margin-bottom: 0.75rem;
      }

      .prose h5 {
        font-size: 1.1rem;
        font-weight: 600;
        color: var(--foreground);
        margin-top: 1.25rem;
        margin-bottom: 0.5rem;
      }

      .prose h6 {
        font-size: 1rem;
        font-weight: 600;
        color: var(--muted-foreground);
        margin-top: 1.25rem;
        margin-bottom: 0.5rem;
      }

      /* Paragraph styling */
      .prose p {
        margin-bottom: 1.25rem;
        line-height: 1.7;
      }

      /* List styling */
      .prose ul {
        list-style-type: disc;
        padding-left: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .prose ol {
        list-style-type: decimal;
        padding-left: 1.5rem;
        margin-bottom: 1.5rem;
      }

      .prose li {
        margin-bottom: 0.5rem;
        padding-left: 0.5rem;
      }

      .prose li::marker {
        color: var(--primary);
      }

      /* Table styling */
      .prose table {
        width: 100%;
        border-collapse: collapse;
        margin: 2rem 0;
        font-size: 0.9rem;
      }

      .prose table th {
        background-color: rgba(var(--muted-foreground-rgb), 0.1);
        font-weight: 600;
        text-align: left;
        padding: 0.75rem 1rem;
        border-bottom: 2px solid rgba(var(--muted-foreground-rgb), 0.2);
      }

      .prose table td {
        padding: 0.75rem 1rem;
        border-bottom: 1px solid rgba(var(--muted-foreground-rgb), 0.1);
      }

      .prose table tr:nth-child(even) {
        background-color: rgba(var(--muted-foreground-rgb), 0.03);
      }

      /* Image and figure styling */
      .prose img {
        border-radius: 0.5rem;
        max-width: 100%;
        height: auto;
        margin: 2rem auto;
      }

      .prose figure {
        margin: 2.5rem auto;
      }

      .prose figure img {
        margin-bottom: 0.5rem;
      }

      .prose figcaption {
        text-align: center;
        font-size: 0.9rem;
        color: var(--muted-foreground);
        font-style: italic;
      }

      /* Blockquote styling */
      .prose blockquote {
        font-style: italic;
        border-left-width: 4px;
        border-left-color: var(--primary);
        background-color: rgba(var(--muted-foreground-rgb), 0.05);
        padding: 1.5rem;
        border-radius: 0.5rem;
        margin: 2rem 0;
      }

      .prose blockquote p:last-child {
        margin-bottom: 0;
      }

      /* Code styling */
      .prose code {
        font-family: monospace;
        background-color: rgba(var(--muted-foreground-rgb), 0.1);
        padding: 0.2rem 0.4rem;
        border-radius: 0.25rem;
        font-size: 0.9em;
      }

      .prose pre {
        background-color: rgba(var(--muted-foreground-rgb), 0.1);
        padding: 1rem;
        border-radius: 0.5rem;
        overflow-x: auto;
        margin: 1.5rem 0;
      }

      .prose pre code {
        background-color: transparent;
        padding: 0;
        border-radius: 0;
        font-size: 0.9rem;
        color: var(--foreground);
      }

      /* Horizontal rule */
      .prose hr {
        border: 0;
        height: 1px;
        background-color: rgba(var(--muted-foreground-rgb), 0.2);
        margin: 2.5rem 0;
      }

      /* Links */
      .prose a {
        color: var(--primary);
        text-decoration: none;
        transition: text-decoration 0.2s ease;
      }

      .prose a:hover {
        text-decoration: underline;
      }

      /* Strong and emphasis */
      .prose strong {
        font-weight: 700;
        color: var(--foreground);
      }

      .prose em {
        font-style: italic;
      }
    `}</style>
  )
}
