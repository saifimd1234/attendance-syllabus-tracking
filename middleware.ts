import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public paths that don't need authentication
    const isPublicPath = path === '/login' || path === '/register' || path.startsWith('/api/auth') || path === '/';

    const token = request.cookies.get('token')?.value || '';

    if ((path === '/login' || path === '/register') && token) {
        // If logged in and trying to access login/register, redirect to dashboard
        return NextResponse.redirect(new URL('/dashboard', request.nextUrl));
    }

    if (!isPublicPath && !token) {
        // If not logged in and trying to access protected page, redirect to login
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    return NextResponse.next();
}

// Config to match all paths except static files
export const config = {
    matcher: [
        '/',
        '/dashboard/:path*',
        '/students/:path*',
        '/attendance/:path*',
        '/login',
        '/register',
    ],
};
