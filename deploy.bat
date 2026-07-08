@echo off
cls
echo 📦 Compiling and minifying Tailwind CSS...

:: 1. बिना npx के सीधे विंडोज कमांड प्रॉम्प्ट से टेलविंड बिल्ड करना
call ./node_modules/.bin/tailwindcss.cmd -i ./style.css -o ./dist/output.css --minify
if %errorlevel% neq 0 (
    echo ❌ Build failed. Deployment aborted.
    pause
    exit /b %errorlevel%
)

echo ✅ Tailwind CSS built successfully!

:: 2. यूजर से कमिट मैसेज इनपुट लेना
echo.
set /p msg="💬 Enter your Git commit message: "

if "%msg%"=="" (
    echo ❌ Commit message cannot be empty. Deployment aborted.
    pause
    exit /b 1
)

:: 3. गिट कमांड्स रन करना
echo.
echo 🚀 Staging files and pushing to GitHub...
git add .
git commit -m "%msg%"
git push origin main

echo.
echo ✅ Successfully pushed to GitHub! Hostinger and Git Pages will update shortly.
pause
