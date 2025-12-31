# Technical Explanation & Issue Resolution

This document explains the technical architecture, issues encountered, and their solutions for the Attendance & Syllabus Tracking System.

---

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 15 (React 19) with TypeScript
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with httpOnly cookies
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, Framer Motion
- **Charts**: Recharts

### Key Features
1. **Role-Based Access Control**: Admin and Student roles with different permissions
2. **Student Management**: CRUD operations for student profiles
3. **Attendance Tracking**: Daily attendance recording with status (Present, Absent, Late, Excused)
4. **Syllabus Tracking**: Subject and chapter progress tracking with time metrics
5. **Real-time Updates**: Automatic calculation of attendance percentages and syllabus completion

---

## Issues Encountered & Solutions

### Issue 1: Forbidden Access to Other Student Profiles

**Problem:**
Students logged in could not view other students' profiles. The API was returning a 403 Forbidden error when accessing `/students/[id]` for any student other than themselves.

**Root Cause:**
The `GET` handler in `app/api/students/[id]/route.ts` had overly restrictive authorization:
```typescript
// Only admins or the student themselves can access the profile
if (!user || (!user.admin && user.studentId !== id)) {
    return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
}
```

**Solution:**
Relaxed the `GET` endpoint to allow any authenticated user to view profiles (read-only), while keeping `PUT` restricted:
```typescript
// Any logged in user can view profiles
if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
```

**Files Modified:**
- `app/api/students/[id]/route.ts`

---

### Issue 2: Students Unable to Edit Their Own Profiles

**Problem:**
After fixing Issue 1, students still couldn't edit their own profiles and syllabus. The UI showed read-only mode even when viewing their own data.

**Root Cause:**
The authentication system was returning stale data from the JWT token payload instead of fetching fresh user data from the database. The token didn't contain the updated `studentId` field, causing the permission check `user.studentId === id` to fail.

**Solution:**
Updated the authentication flow to fetch fresh user data from MongoDB on every request:

1. **Modified `lib/auth.ts`:**
```typescript
export async function getUser(req: NextRequest) {
    try {
        const token = req.cookies.get("token")?.value;
        if (!token) return null;

        const decoded: any = jwt.verify(token, JWT_SECRET);
        
        await connect();
        const user = await User.findById(decoded.id);  // Fetch from DB
        
        return user;  // Returns full mongoose document
    } catch (error) {
        return null;
    }
}
```

2. **Updated `app/api/auth/me/route.ts`:**
```typescript
import { getUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
    const user = await getUser(req);
    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ user });
}
```

3. **Fixed ObjectId comparison in API routes:**
```typescript
// Convert Mongoose ObjectId to string before comparison
if (!user || (!user.admin && user.studentId?.toString() !== studentId)) {
    return NextResponse.json({ error: "Forbidden: Access denied" }, { status: 403 });
}
```

**Files Modified:**
- `lib/auth.ts`
- `app/api/auth/me/route.ts`
- `app/api/syllabus/[studentId]/route.ts`
- `app/api/students/[id]/route.ts`

---

### Issue 3: Next.js 15 Build Error - Invalid Route Export

**Problem:**
Build failed with TypeScript error:
```
Type error: Route "app/api/syllabus/[studentId]/route.ts" has an invalid "GET" export:
  Type "{ params: { studentId: string; }; }" is not a valid type for the function's second argument.
```

**Root Cause:**
Next.js 15 introduced a breaking change where dynamic route parameters are now **Promises** and must be awaited. The old synchronous parameter access pattern was no longer valid.

**Old Pattern (Next.js 14):**
```typescript
export async function GET(req: NextRequest, { params }: { params: { studentId: string } }) {
    const syllabus = await Syllabus.findOne({ studentId: params.studentId });
}
```

**Solution:**
Updated all dynamic route handlers to use Promise-based params and await them:

```typescript
export async function GET(
    req: NextRequest, 
    { params }: { params: Promise<{ studentId: string }> }  // ← Promise type
) {
    const { studentId } = await params;  // ← Must await!
    const syllabus = await Syllabus.findOne({ studentId });
}
```

**Why This Change?**
Next.js 15 made params asynchronous to support:
- Streaming and progressive rendering
- Better performance with dynamic routes
- Consistency with the new async component model

**Files Modified:**
- `app/api/syllabus/[studentId]/route.ts` (GET and POST handlers)
- `app/api/students/[id]/route.ts` (already had Promise type, verified correct)

---

## Best Practices Implemented

### 1. Security
- JWT tokens stored in httpOnly cookies (prevents XSS attacks)
- CSRF protection through sameSite cookie policy
- Role-based access control at API level
- Password hashing with bcrypt
- Environment variables for sensitive data

### 2. Database
- Connection pooling with Mongoose
- Cached connections in serverless environment
- Proper error handling and validation
- Indexed fields for performance

### 3. Type Safety
- Full TypeScript coverage
- Strict type checking enabled
- Proper typing for API responses
- Mongoose schema types aligned with TypeScript interfaces

### 4. Performance
- Server-side rendering (SSR) where appropriate
- Client-side state management with Zustand
- Optimized re-renders with React hooks
- Lazy loading of components

---

## Deployment Considerations

### Environment Variables Required
```bash
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/dbname
JWT_SECRET=random_secure_string_minimum_32_characters
```

### Vercel-Specific Configuration
- Serverless functions for API routes
- Edge runtime compatibility
- MongoDB connection pooling for serverless
- Environment variable management through Vercel dashboard

### Database Setup
- MongoDB Atlas free tier (M0) sufficient for development
- Network access whitelist: `0.0.0.0/0` for Vercel's dynamic IPs
- Database user with read/write permissions
- Proper indexes on frequently queried fields

---

## Future Improvements

1. **Authentication**
   - Add password reset functionality
   - Implement email verification
   - Add OAuth providers (Google, GitHub)

2. **Features**
   - Export attendance reports (PDF/CSV)
   - Bulk student import
   - Email notifications for low attendance
   - Mobile app support

3. **Performance**
   - Implement Redis caching
   - Add pagination for large datasets
   - Optimize database queries with aggregation

4. **Security**
   - Rate limiting on API routes
   - Input sanitization
   - CAPTCHA on login
   - Two-factor authentication

---

## References

- [Next.js 15 Documentation](https://nextjs.org/docs)
- [MongoDB Atlas](https://www.mongodb.com/docs/atlas/)
- [Vercel Deployment](https://vercel.com/docs)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)
