import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Auth is opt-in: with no Clerk key the middleware is a no-op (demo mode).
// With a key, the app routes below require sign-in.
const clerkEnabled = !!process.env.CLERK_SECRET_KEY;

const isProtected = createRouteMatcher(['/chat(.*)', '/parcel(.*)', '/inventory(.*)', '/team(.*)']);

const withClerk = clerkMiddleware(async (auth, req) => {
  if (isProtected(req)) await auth.protect();
});

export default clerkEnabled ? withClerk : () => NextResponse.next();

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ico|webp|woff2?|ttf|map)).*)',
    '/(api|trpc)(.*)',
  ],
};
