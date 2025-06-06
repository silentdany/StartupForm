import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // Check for Better Auth session cookie
  // Better Auth uses 'better-auth.session_token' as the default cookie name
  const sessionToken = request.cookies.get('better-auth.session_token')

  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith('/dashboard')) {
    if (!sessionToken) {
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
