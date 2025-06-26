@echo off
echo 🤖 Setting up Agentic To-Do List (Next.js)...
echo.

echo 📦 Installing dependencies...
call npm install

echo.
echo ⚙️ Setting up environment...
if not exist .env.local (
    copy .env.local.example .env.local
    echo ✅ Created .env.local file - Please add your API key!
    echo.
    echo 🔑 You need to add either:
    echo    ANTHROPIC_API_KEY=your_key_here
    echo    OR
    echo    OPENAI_API_KEY=your_key_here
    echo.
    echo 📝 Edit .env.local file with your API key, then run:
    echo    npm run dev
    echo.
    echo 🌐 Then open http://localhost:3000 in your browser
) else (
    echo ✅ .env.local file already exists
)

echo.
echo 🚀 Setup complete! 
echo.
echo Next steps:
echo 1. Edit .env.local with your API key
echo 2. Run: npm run dev
echo 3. Open: http://localhost:3000
echo.
pause
