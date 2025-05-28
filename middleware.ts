import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { auth } from './lib/auth'

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!session) {
      const redirectUrl = new URL('/login', request.url)
      // Add ?from=/dashboard to redirect back after login
      redirectUrl.searchParams.set('from', request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

// Configure which routes to protect
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/settings/:path*', // Also protect settings routes while we're at it
  ],
}
