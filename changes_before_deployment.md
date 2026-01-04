# Pre-Deployment Checklist & Guide

This guide outlines essential steps and optimizations to ensure your application is secure, performant, and correctly configured for production on Vercel.

## 1. Environment Variables (Critical)
In development, you often use fallback values. In production, these **must** be set in the Vercel Dashboard.

| Variable | Usage | Requirement |
| :--- | :--- | :--- |
| `MONGODB_URI` | Database Connection | Standard MongoDB Atlas connection string. |
| `JWT_SECRET` | Auth Token Encryption | A long, random string (at least 32 characters). |

> [!IMPORTANT]
> Remove hardcoded fallbacks for these variables in your code (e.g., in `middleware.ts` and API routes) to prevent security leaks.

## 2. The `"use client"` Directive
You asked if you should remove `"use client"`. **No, do not remove them unless the file doesn't need client-side features.**

### When `"use client"` IS required:
- Using `useState`, `useEffect`, or `useContext`.
- Using UI libraries like `framer-motion`, `recharts`, or `confetti`.
- Handling events like `onClick` or `onChange`.
- Using hooks from `next/navigation` (like `useRouter` or `usePathname`).

### When it can be REMOVED (Optimization):
- If the file is purely for layout/structure and only imports other server components.
- If the file only fetches data from the database and passes it to children.

**Locations in your project:**
- `app/login/page.tsx`, `app/register/page.tsx`, `app/dashboard/page.tsx`: These **must** remain `"use client"` because they use state, effects, and animations.
- `app/layout.tsx`: This is a Server Component (no directive), which is good for SEO and performance.

## 3. Deployment-Specific Fixes
- **Login Redirection**: We already updated `app/login/page.tsx` to use `window.location.href = '/dashboard'`. This is crucial for Vercel to handle cookies correctly.
- **Database Connection**: Your `lib/db.ts` uses a global cache. This is perfect for Vercel Serverless Functions to prevent opening too many connections.

## 4. Production Build Test
Before deploying, run this command in your terminal:
```bash
npm run build
```
If this command fails locally, it will also fail on Vercel. Fix any TypeScript or Lint errors shown here first.

## 5. Security Cleanup
Check the following files and remove any hardcoded testing strings:
- `middleware.ts:L5` (JWT_SECRET fallback)
- `app/api/auth/login/route.ts:L6` (JWT_SECRET fallback)
- `app/api/auth/me/route.ts` (If any fallback exists)
