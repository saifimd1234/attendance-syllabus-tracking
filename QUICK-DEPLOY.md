# Quick Deployment Reference

## 🔗 Important Links
- **Vercel Dashboard**: https://vercel.com/dashboard
- **MongoDB Atlas**: https://cloud.mongodb.com/
- **Full Guide**: See `DEPLOYMENT.md`

## ⚡ Quick Steps

### 1. MongoDB Atlas Setup (5 minutes)
```
1. Create free cluster at cloud.mongodb.com
2. Create database user (save password!)
3. Whitelist IP: 0.0.0.0/0
4. Get connection string
```

### 2. GitHub Push
```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### 3. Vercel Deploy
```
1. Import GitHub repo at vercel.com
2. Add environment variables:
   - MONGODB_URI=mongodb+srv://...
   - JWT_SECRET=random_secure_string
3. Click Deploy
```

## 🔐 Environment Variables Needed

| Variable | Example | Where to Get |
|----------|---------|--------------|
| `MONGODB_URI` | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` | MongoDB Atlas → Connect |
| `JWT_SECRET` | `a8f5f167f44f4964e6c998dee827110c` | Generate random string |

## 🧪 Test Locally First
```bash
npm install
npm run build
npm run dev
```

## 📝 Default Login Credentials
After seeding database:
- **Admin**: admin@system.com / adminpassword123
- **Student**: student@system.com / studentpassword123

## 🆘 Common Issues

**Build fails?**
- Run `npm run build` locally to see errors
- Check all TypeScript errors are fixed

**Can't connect to MongoDB?**
- Verify connection string format
- Check IP whitelist (0.0.0.0/0)
- Ensure database user exists

**Environment variables not working?**
- Redeploy after adding variables
- Check spelling (case-sensitive)

## 🔄 Update Deployment
```bash
git add .
git commit -m "Update"
git push
```
Vercel auto-deploys on push!
