@echo off
echo.
echo 🚀 Vercel Deployment Checklist
echo ================================
echo.

REM Check if git is initialized
if exist .git\ (
    echo ✅ Git repository initialized
) else (
    echo ❌ Git repository not initialized
    echo    Run: git init
)

REM Check if .env.local exists
if exist .env.local (
    echo ✅ .env.local file exists
) else (
    echo ⚠️  .env.local file not found (this is OK if deploying fresh^)
)

REM Check if node_modules exists
if exist node_modules\ (
    echo ✅ Dependencies installed
) else (
    echo ❌ Dependencies not installed
    echo    Run: npm install
)

echo.
echo 🔨 Testing build...
call npm run build >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Build successful
) else (
    echo ❌ Build failed - check for errors with: npm run build
)

echo.
echo 📋 Next Steps:
echo 1. Create MongoDB Atlas cluster (see DEPLOYMENT.md^)
echo 2. Push to GitHub: git push origin main
echo 3. Import project in Vercel dashboard
echo 4. Add environment variables in Vercel
echo 5. Deploy!
echo.
echo 📖 Full guide: See DEPLOYMENT.md
echo.
pause
