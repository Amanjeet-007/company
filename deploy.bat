@echo off
cls
echo 📦 Compiling and minifying Tailwind CSS...

call ./node_modules/.bin/tailwindcss.cmd -i ./style.css -o ./dist/output.css --minify
if %errorlevel% neq 0 (
    echo ❌ Build failed. Deployment aborted.
    pause
    exit /b %errorlevel%
)

echo ✅ Tailwind CSS built successfully!

echo.
set /p msg="💬 Enter your Git commit message: "

if "%msg%"=="" (
    echo ❌ Commit message cannot be empty. Deployment aborted.
    pause
    exit /b 1
)

echo.
echo 🚀 Staging files and pushing to GitHub...
git add .
git commit -m "%msg%"
git push origin main

echo.
echo ✅ Successfully pushed to GitHub! Hostinger and Git Pages will update shortly.
pause
