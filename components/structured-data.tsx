import Script from 'next/script'

interface StructuredDataProps {
  type:
    | 'WebApplication'
    | 'WebSite'
    | 'WebPage'
    | 'Organization'
    | 'SoftwareApplication'
  name: string
  description: string
  url: string
  additionalData?: Record<string, unknown>
}

export function StructuredData({
  type,
  name,
  description,
  url,
  additionalData,
}: StructuredDataProps) {
  // Base structured data for all types
  const baseData = {
    '@context': 'https://schema.org',
    '@type': type,
    name,
    description,
    url,
  }

  // Merge additional data
  const structuredData = {
    ...baseData,
    ...additionalData,
  }

  return (
    <Script
      id={`structured-data-${type.toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
    />
  )
}

// Specialized component for Character Counter as SoftwareApplication
export function CharacterCounterStructuredData() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://charactercounter.example.com'

  return (
    <StructuredData
      type="SoftwareApplication"
      name="Character Counter Pro"
      description="Professional online character counter tool with real-time counting for characters, words, sentences, and paragraphs."
      url={baseUrl}
      additionalData={{
        applicationCategory: 'UtilitiesApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.8',
          ratingCount: '1024',
          bestRating: '5',
          worstRating: '1',
        },
        features: [
          'Character counting',
          'Word counting',
          'Sentence counting',
          'Paragraph counting',
          'Reading time estimation',
          'Social media length checks',
        ],
      }}
    />
  )
}

// Specialized component for website
export function WebsiteStructuredData() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://charactercounter.example.com'

  return (
    <StructuredData
      type="WebSite"
      name="Character Counter Pro"
      description="Professional online character counter tool with real-time counting for characters, words, sentences, and paragraphs."
      url={baseUrl}
      additionalData={{
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${baseUrl}/counter?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  )
}

// Specialized component for organization
export function OrganizationStructuredData() {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL || 'https://charactercounter.example.com'

  return (
    <StructuredData
      type="Organization"
      name="Character Counter Pro"
      description="Professional online character counter tool with real-time counting for characters, words, sentences, and paragraphs."
      url={baseUrl}
      additionalData={{
        logo: `${baseUrl}/logo.png`,
        sameAs: [
          'https://twitter.com/charactercounterpro',
          'https://facebook.com/charactercounterpro',
          'https://linkedin.com/company/charactercounterpro',
        ],
      }}
    />
  )
}
