import { clerkMiddleware } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Auth is opt-in: when Clerk keys are absent the middleware is a no-op so the
// app still boots and public pages render. Add CLERK_SECRET_KEY to enable it.
const clerkEnabled = !!process.env.CLERK_SECRET_KEY;

export default clerkEnabled ? clerkMiddleware() : () => NextResponse.next();

export const config = {
  matcher: [
    // Skip Next internals and static files, run on everything else.
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|png|gif|svg|ico|webp|woff2?|ttf|map)).*)',
    '/(api|trpc)(.*)',
  ],
};
