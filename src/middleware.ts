import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

const isPublicRoute = createRouteMatcher(['/', '/home', '/privacy', '/terms', '/api/(.*)', '/sign-in(.*)', '/sign-up(.*)'])

export function middleware(request: NextRequest) {
  //TODO: re-enable logging
  // Only log API routes
  // if (request.nextUrl.pathname.startsWith('/api')) {
  //   console.log(`API Request: ${request.method} ${request.nextUrl.pathname}`)
  // }

  return NextResponse.next()
}
export default clerkMiddleware(async (auth, request) => {
  const isDemoMode = request.cookies.get('mode')?.value === 'demo';

  // if (!isPublicRoute(request) && !isDemoMode) {
  //   await auth.protect()
  // }
})

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};