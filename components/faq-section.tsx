import React from 'react'
import Script from 'next/script'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { appConfig } from '@/lib/config/app-config'

interface FAQProps {
  faqs: {
    question: string
    answer: string
  }[]
  title?: string
}

export function FAQSection({ faqs }: FAQProps) {
  // Generate JSON-LD structured data for FAQs
  const faqStructuredData = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }

  return (
    <div className="mx-auto w-full max-w-3xl py-12">
      <Script
        id="faq-structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData) }}
      />

      <h2 className="mb-8 text-center text-2xl font-bold">
        Frequently Asked Questions
      </h2>

      <Accordion type="single" collapsible className="w-full">
        {faqs.map((faq, index) => (
          <AccordionItem key={index} value={`item-${index}`}>
            <AccordionTrigger className="text-left">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent>
              <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  )
}

// Use FAQ data from app configuration
export function CharacterCounterFAQ() {
  return <FAQSection faqs={appConfig.faq.items} title={appConfig.faq.title} />
}
