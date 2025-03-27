import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { appConfig } from '@/lib/config/app-config'

export const metadata: Metadata = {
  title: `Privacy Policy | ${appConfig.name}`,
  description: `Privacy policy for ${appConfig.name}.`,
}

export default function PrivacyPage() {
  return (
    <div className="container max-w-3xl px-4 py-12">
      <Link href="/" className="mb-8 inline-block">
        <Button variant="ghost" size="sm">
          &larr; Back to {appConfig.shortName}
        </Button>
      </Link>

      <Card>
        <CardContent className="pt-6">
          <h1 className="mb-6 text-3xl font-bold">Privacy Policy</h1>

          <div className="prose prose-stone dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-semibold">Overview</h2>
            <p>
              {appConfig.name} is a simple text analysis tool that respects your
              privacy. This privacy policy explains how we handle any
              information when you use our website.
            </p>

            <h2 className="text-2xl font-semibold">No Data Collection</h2>
            <p>
              {appConfig.name} does not collect, store, or process any personal
              data. All text analysis happens directly in your browser, and we
              do not transmit or store your text on our servers.
            </p>

            <h2 className="text-2xl font-semibold">No Cookies</h2>
            <p>
              Our website does not use cookies or similar technologies to track
              you or store information about your preferences.
            </p>

            <h2 className="text-2xl font-semibold">Browser Storage</h2>
            <p>
              {appConfig.name} does not use browser storage (such as
              localStorage) to persist any data between sessions.
            </p>

            <h2 className="text-2xl font-semibold">
              Analytics and Third Parties
            </h2>
            <p>
              We do not use analytics tools or third-party services that collect
              data about your usage of the website.
            </p>

            <h2 className="text-2xl font-semibold">Changes to This Policy</h2>
            <p>
              We may update our Privacy Policy from time to time. We will notify
              you of any changes by posting the new Privacy Policy on this page.
            </p>

            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please
              contact us at: majorleaguebaguette@gmail.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
