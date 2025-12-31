# Deploying to Vercel with MongoDB

This guide will help you deploy your Attendance & Syllabus Tracking System to Vercel with MongoDB Atlas.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup) (free tier works)
2. A [MongoDB Atlas account](https://www.mongodb.com/cloud/atlas/register) (free tier works)
3. Your code pushed to a GitHub repository

---

## Step 1: Set Up MongoDB Atlas

### 1.1 Create a MongoDB Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Click **"Build a Database"**
3. Choose **"M0 FREE"** tier
4. Select a cloud provider and region (choose one close to your users)
5. Click **"Create Cluster"**

### 1.2 Create a Database User
1. In the left sidebar, click **"Database Access"**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Enter a username and **generate a strong password** (save this!)
5. Set user privileges to **"Read and write to any database"**
6. Click **"Add User"**

### 1.3 Whitelist IP Addresses
1. In the left sidebar, click **"Network Access"**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - This is necessary for Vercel's dynamic IPs
4. Click **"Confirm"**

### 1.4 Get Your Connection String
1. Go back to **"Database"** in the sidebar
2. Click **"Connect"** on your cluster
3. Choose **"Connect your application"**
4. Copy the connection string (it looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. Replace `<username>` with your database username
6. Replace `<password>` with your database password
7. Add your database name after `.net/` (e.g., `attendance-db`):
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/attendance-db?retryWrites=true&w=majority
   ```

---

## Step 2: Push Your Code to GitHub

If you haven't already:

```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/attendance-syllabus-tracking.git
git push -u origin main
```

---

## Step 3: Deploy to Vercel

### 3.1 Import Your Project
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository
4. Vercel will auto-detect it's a Next.js project

### 3.2 Configure Environment Variables
Before deploying, add your environment variables:

1. In the **"Configure Project"** section, expand **"Environment Variables"**
2. Add the following variables:

   | Name | Value |
   |------|-------|
   | `MONGODB_URI` | Your MongoDB connection string from Step 1.4 |
   | `JWT_SECRET` | A random secure string (e.g., use a password generator) |

   **Example JWT_SECRET**: `a8f5f167f44f4964e6c998dee827110c`

3. Click **"Deploy"**

### 3.3 Wait for Deployment
- Vercel will build and deploy your app (takes 2-5 minutes)
- Once complete, you'll get a live URL like: `https://your-app.vercel.app`

---

## Step 4: Seed Your Database (Optional)

After deployment, you need to create the initial admin and test user:

### Option A: Run Seed Script Locally
```bash
# Make sure your .env.local has the production MONGODB_URI
npm run build
npx tsx seed.ts
```

### Option B: Create Users Manually via MongoDB Atlas
1. Go to MongoDB Atlas → **"Browse Collections"**
2. Create a `users` collection
3. Insert documents manually using the MongoDB UI

---

## Step 5: Test Your Deployment

1. Visit your Vercel URL
2. Try logging in with:
   - **Admin**: `admin@system.com` / `adminpassword123`
   - **Student**: `student@system.com` / `studentpassword123`

---

## Troubleshooting

### Build Fails
- Check the Vercel build logs for errors
- Ensure all dependencies are in `package.json`
- Make sure TypeScript has no errors: `npm run build` locally

### Database Connection Issues
- Verify your MongoDB connection string is correct
- Ensure you've whitelisted `0.0.0.0/0` in Network Access
- Check that your database user has the correct permissions

### Environment Variables Not Working
- Make sure you added them in the Vercel dashboard
- Redeploy after adding new environment variables
- Check variable names match exactly (case-sensitive)

### 500 Internal Server Error
- Check Vercel function logs in the dashboard
- Verify MongoDB URI is correct and database is accessible
- Ensure JWT_SECRET is set

---

## Updating Your Deployment

Whenever you push changes to your GitHub repository:
```bash
git add .
git commit -m "Your changes"
git push
```

Vercel will automatically rebuild and redeploy your app!

---

## Custom Domain (Optional)

1. In Vercel Dashboard, go to your project
2. Click **"Settings"** → **"Domains"**
3. Add your custom domain
4. Follow the DNS configuration instructions

---

## Security Recommendations

1. **Change Default Passwords**: After first login, change the default admin/student passwords
2. **Use Strong JWT_SECRET**: Generate a cryptographically secure random string
3. **Enable 2FA**: On both Vercel and MongoDB Atlas accounts
4. **Monitor Usage**: Check Vercel and MongoDB dashboards regularly

---

You're all set! 🎉 Your app is now live and accessible worldwide.
