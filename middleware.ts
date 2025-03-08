import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createMiddlewareSupabaseClient } from '@/lib/supabase';

export async function middleware(request: NextRequest) {
  try {
    // Create authenticated Supabase Client
    const { supabase, response } = createMiddlewareSupabaseClient(request);

    // Check if we have a session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Check auth condition
    if (session?.user) {
      // Authentication successful, forward request to protected route
      return response;
    }

    // Auth condition not met, redirect to login page
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);

  } catch (e) {
    // If there is an error, return to the login page
    return NextResponse.redirect(new URL('/login', request.url));
  }
}

// Specify which routes to protect
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/meal-plans/:path*',
    '/profile/:path*',
    // Add other protected routes here
  ],
}; 