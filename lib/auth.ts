/* eslint-disable @typescript-eslint/no-unused-vars */
import { PrismaClient, Role } from '@prisma/client'
import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { magicLink } from 'better-auth/plugins/magic-link'

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql', // or "mysql", "postgresql", ...etc
  }),
  account: {
    accountLinking: {
      enabled: true,
      trustedProviders: ['google', 'twitter'], // Auto-link these providers even without email verification
    },
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, token, url }, request) => {
        const response = await fetch(
          'https://app.loops.so/api/v1/transactional',
          {
            body: JSON.stringify({
              transactionalId: process.env.LOOPS_TRANSACTION_ID,
              email,
              dataVariables: {
                url,
              },
            }),
            headers: {
              Authorization: `Bearer ${process.env.LOOPS_API_KEY}`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
          }
        )
        if (!response.ok) {
          const { errors } = await response.json()
          throw new Error(JSON.stringify(errors))
        }
      },
    }),
  ],
  socialProviders: {
    twitter: {
      clientId: process.env.TWITTER_CLIENT_ID as string,
      clientSecret: process.env.TWITTER_CLIENT_SECRET as string,
    },
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        defaultValue: Role.USER,
      },
    },
  },
})
