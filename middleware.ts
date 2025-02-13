import { auth } from "@/auth"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const session = await auth()
  
  // Protect dashboard routes
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!session) {
      const redirectUrl = new URL("/login", request.url)
      // Add ?from=/dashboard to redirect back after login
      redirectUrl.searchParams.set("from", request.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }
  }

  return NextResponse.next()
}

// Configure which routes to protect
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/settings/:path*"  // Also protect settings routes while we're at it
  ]
}