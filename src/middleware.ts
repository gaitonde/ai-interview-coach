import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { clerkMiddleware, type ClerkMiddlewareAuth } from '@clerk/nextjs/server'
import { getProfileByUserId } from '@/app/actions/get-profile'

const publicRoutes = ['/start', '/sign-in', '/sign-up', '/sign-up-start', '/api', '/profile-setup']

const isPublicRoute = (pathname: string): boolean => {
  return publicRoutes.some(route => {
    // Escape special regex characters in the route
    const escapedRoute = route.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    // Create a regex that matches the start of the pathname
    const regex = new RegExp(`^${escapedRoute}`)

    return regex.test(pathname)
  })
}

const afterAuth = async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
  const isPublicPath = isPublicRoute(req.nextUrl.pathname)

  const { userId } = await auth()

  if (!userId && !isPublicPath) {
    const signInUrl = new URL('/start', req.url);
    return NextResponse.redirect(signInUrl);
  }

  //TODO: fix
  // if (userId && !isPublicPath) {
    // console.log('In Middleware fetching profile for userId', userId)
    // const profile = await getProfileByUserId(userId)
    // console.log('In Middleware profile', profile)
  // }

  return NextResponse.next();
}

export default clerkMiddleware((auth, req) => afterAuth(auth, req));

// export default clerkMiddleware(async (auth: ClerkMiddlewareAuth, req: NextRequest) => {
//   const isPublicPath = isPublicRoute(req.nextUrl.pathname)

//   const { userId, redirectToSignIn } = await auth()
//   console.log('XXX =======================')
//   console.log('XXX req.url', req.url)
//   console.log('XXX req.nextUrl.pathname', req.nextUrl.pathname)
//   // console.log('XXX redirectToSignIn', redirectToSignIn)
//   console.log('XXX isPublicPath', isPublicPath)
//   console.log('XXX userId', userId)


//   if (!userId && !isPublicPath) {
//     // const startePath = new URL('/start', req.url)
//     // return NextResponse.redirect(startePath)
//     console.log('XXX here redirectToSignIn()')
//     const protocol = process.env.NEXT_PUBLIC_VERCEL_URL?.startsWith('localhost') ? 'http' : 'https';
//     const signInUrl = new URL('/start', `${protocol}://${process.env.NEXT_PUBLIC_VERCEL_URL}`)

//     // signInUrl.searchParams.set('redirect_url', req.url)
//     console.log('XXX signInUrl', signInUrl)
//     return NextResponse.redirect(signInUrl)

//     // return redirectToSignIn()
//   } else if (userId) {
//     console.log('XXX userId', userId)

//   }

//   return NextResponse.next()
// }
// )

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}

// export default clerkMiddleware({
  // beforeAuth: (req) => {
  //   // Your before auth logic
  // },
  // afterAuth: (auth, req) => {
  //   const isPublicPath = isPublicRoute(req.nextUrl.pathname)
  //   if (!auth.userId && !isPublicPath) {
  //     const signInUrl = new URL('/start', req.url)
  //     return NextResponse.redirect(signInUrl)
  //   }
  //   return NextResponse.next()
  // },

// });