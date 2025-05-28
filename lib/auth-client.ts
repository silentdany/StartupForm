import {
  inferAdditionalFields,
  magicLinkClient,
} from 'better-auth/client/plugins'
import { createAuthClient } from 'better-auth/react'

import { auth } from './auth'

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  plugins: [inferAdditionalFields<typeof auth>(), magicLinkClient()],
})

export const { signIn, signOut, useSession } = authClient
