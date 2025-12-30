import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || "your_super_secret_jwt_key_123";

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Define public paths
    const isPublicPath = path === '/login' || path === '/register' || path.startsWith('/api/auth');

    const token = request.cookies.get('token')?.value || '';

    if (isPublicPath && token) {
        // If logged in and trying to access public page, redirect to dashboard
        return NextResponse.redirect(new URL('/', request.nextUrl));
    }

    if (!isPublicPath && !token) {
        // If not logged in and trying to access protected page, redirect to login
        return NextResponse.redirect(new URL('/login', request.nextUrl));
    }

    // Role-based protection could go here if needed via token decoding
    // For now, simple auth check is sufficient for basic protection

    return NextResponse.next();
}

// Config to match all paths except static files
export const config = {
    matcher: [
        '/',
        '/students/:path*',
        '/attendance/:path*',
        '/login',
        '/register',
    ],
};
