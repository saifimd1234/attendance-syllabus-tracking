#!/bin/bash

echo "🚀 Vercel Deployment Checklist"
echo "================================"
echo ""

# Check if git is initialized
if [ -d .git ]; then
    echo "✅ Git repository initialized"
else
    echo "❌ Git repository not initialized"
    echo "   Run: git init"
fi

# Check if .env.local exists
if [ -f .env.local ]; then
    echo "✅ .env.local file exists"
else
    echo "⚠️  .env.local file not found (this is OK if deploying fresh)"
fi

# Check if MongoDB URI is set
if grep -q "MONGODB_URI" .env.local 2>/dev/null; then
    echo "✅ MONGODB_URI found in .env.local"
else
    echo "⚠️  MONGODB_URI not found in .env.local"
fi

# Check if JWT_SECRET is set
if grep -q "JWT_SECRET" .env.local 2>/dev/null; then
    echo "✅ JWT_SECRET found in .env.local"
else
    echo "⚠️  JWT_SECRET not found in .env.local"
fi

# Check if node_modules exists
if [ -d node_modules ]; then
    echo "✅ Dependencies installed"
else
    echo "❌ Dependencies not installed"
    echo "   Run: npm install"
fi

# Try to build
echo ""
echo "🔨 Testing build..."
npm run build > /dev/null 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed - check for errors with: npm run build"
fi

echo ""
echo "📋 Next Steps:"
echo "1. Create MongoDB Atlas cluster (see DEPLOYMENT.md)"
echo "2. Push to GitHub: git push origin main"
echo "3. Import project in Vercel dashboard"
echo "4. Add environment variables in Vercel"
echo "5. Deploy!"
echo ""
echo "📖 Full guide: See DEPLOYMENT.md"
