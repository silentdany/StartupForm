import React from 'react'
import Script from 'next/script'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'

interface FAQProps {
  faqs: {
    question: string
    answer: string
  }[]
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

// Predefined FAQs for Character Counter
export function CharacterCounterFAQ() {
  const faqs = [
    {
      question: 'What is a character counter tool?',
      answer:
        'A character counter tool is an online utility that allows you to count the number of characters, words, sentences and paragraphs in a text. Our Character Counter Pro provides real-time counting and additional features like social media limits checking and reading time estimation.',
    },
    {
      question: 'Why would I need to count characters?',
      answer:
        'Character counting is essential for many purposes including: staying within social media character limits, writing SEO-optimized meta descriptions, creating concise email subject lines, writing SMS messages, and ensuring content fits within specific requirements for applications, forms, or publications.',
    },
    {
      question: 'Does Character Counter Pro count spaces?',
      answer:
        'Yes, Character Counter Pro counts spaces as characters in the total count. However, we also provide a separate count for characters excluding spaces, giving you both metrics for your convenience.',
    },
    {
      question: 'How does Character Counter Pro calculate reading time?',
      answer:
        'Our reading time calculation is based on the average reading speed of 200 words per minute for digital content. This provides an estimate of how long it would take an average person to read your text from start to finish.',
    },
    {
      question: 'Is Character Counter Pro free to use?',
      answer:
        'Yes, Character Counter Pro is completely free to use with no limitations. You can count text of any length as many times as you need without creating an account or subscribing to a service.',
    },
    {
      question: 'Does Character Counter Pro save my text?',
      answer:
        'No, Character Counter Pro does not save, store, or collect any of the text you input. All processing happens locally in your browser for maximum privacy and security.',
    },
    {
      question:
        'What social media character limits does Character Counter Pro track?',
      answer:
        'Character Counter Pro tracks character limits for major social media platforms including Twitter/X (280 characters), Instagram captions (2,200 characters), Facebook posts (63,206 characters), LinkedIn posts (3,000 characters), and more.',
    },
  ]

  return <FAQSection faqs={faqs} />
}
