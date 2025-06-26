@echo off
echo 🚀 Starting Agentic To-Do List (Next.js)...
echo.

if not exist .env.local (
    echo ❌ .env.local file not found!
    echo Please run setup.bat first and configure your API key.
    echo.
    pause
    exit /b 1
)

echo 🔍 Checking .env.local configuration...
findstr /C:"ANTHROPIC_API_KEY=" .env.local >nul
if %errorlevel% equ 0 (
    findstr /C:"ANTHROPIC_API_KEY=your_" .env.local >nul
    if %errorlevel% equ 0 (
        echo ⚠️  Please configure your ANTHROPIC_API_KEY in .env.local
        goto :configure
    ) else (
        echo ✅ Anthropic API key configured
        goto :start
    )
)

findstr /C:"OPENAI_API_KEY=" .env.local >nul
if %errorlevel% equ 0 (
    findstr /C:"OPENAI_API_KEY=your_" .env.local >nul
    if %errorlevel% equ 0 (
        echo ⚠️  Please configure your OPENAI_API_KEY in .env.local
        goto :configure
    ) else (
        echo ✅ OpenAI API key configured
        goto :start
    )
)

:configure
echo.
echo 🔑 API Key Configuration Required:
echo Edit .env.local and add either:
echo    ANTHROPIC_API_KEY=your_actual_key_here
echo    OR
echo    OPENAI_API_KEY=your_actual_key_here
echo.
pause
exit /b 1

:start
echo.
echo 🎯 Starting Next.js development server...
echo 🌐 App will be available at http://localhost:3000
echo.
echo Press Ctrl+C to stop the server
echo.

call npm run dev
