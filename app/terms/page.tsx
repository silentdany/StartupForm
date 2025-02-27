import type { Metadata } from 'next'
import Link from 'next/link'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export const metadata: Metadata = {
  title: 'Terms of Service | Character Counter Pro',
  description: 'Terms of service for Character Counter Pro.',
}

export default function TermsPage() {
  return (
    <div className="container max-w-3xl px-4 py-12">
      <Link href="/" className="mb-8 inline-block">
        <Button variant="ghost" size="sm">
          &larr; Back to Character Counter
        </Button>
      </Link>

      <Card>
        <CardContent className="pt-6">
          <h1 className="mb-6 text-3xl font-bold">Terms of Service</h1>

          <div className="prose prose-stone dark:prose-invert max-w-none space-y-6">
            <p className="text-muted-foreground">
              Last updated: {new Date().toLocaleDateString()}
            </p>

            <h2 className="text-2xl font-semibold">Introduction</h2>
            <p>
              These Terms of Service govern your use of Character Counter Pro, a
              text analysis tool accessible from charactercounterpro.com. By
              using our website, you accept these terms in full. If you disagree
              with any part of these terms, you must not use our website.
            </p>

            <h2 className="text-2xl font-semibold">Use License</h2>
            <p>
              Permission is granted to temporarily use Character Counter Pro for
              personal, non-commercial purposes. This is the grant of a license,
              not a transfer of title, and under this license you may not:
            </p>
            <ul className="list-disc space-y-2 pl-6">
              <li>Modify or copy the content;</li>
              <li>Use the content for any commercial purpose;</li>
              <li>
                Attempt to decompile or reverse engineer any software contained
                on Character Counter Pro;
              </li>
              <li>Remove any copyright or other proprietary notations;</li>
              <li>
                Transfer the content to another person or &ldquo;mirror&rdquo;
                the content on any other server.
              </li>
            </ul>

            <h2 className="text-2xl font-semibold">No Warranties</h2>
            <p>
              Character Counter Pro is provided &ldquo;as is&rdquo; without any
              warranties, expressed or implied. We make no representations or
              warranties of any kind concerning the accuracy, reliability, or
              suitability of the information, content, or services contained on
              or through our website.
            </p>

            <h2 className="text-2xl font-semibold">Limitation of Liability</h2>
            <p>
              In no event shall Character Counter Pro be liable for any damages
              (including, without limitation, damages for loss of data or
              profit, or due to business interruption) arising out of the use or
              inability to use Character Counter Pro, even if we have been
              notified orally or in writing of the possibility of such damage.
            </p>

            <h2 className="text-2xl font-semibold">Changes to Terms</h2>
            <p>
              We may revise these terms of service at any time without notice.
              By using this website, you are agreeing to be bound by the then
              current version of these terms of service.
            </p>

            <h2 className="text-2xl font-semibold">Contact Us</h2>
            <p>
              If you have any questions about these Terms of Service, please
              contact us at: majorleaguebaguette@gmail.com
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
