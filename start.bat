@echo off
cd /d "%~dp0"
echo ========================================
echo   Resume Builder — Starting Up...
echo ========================================
echo.

REM ── Check for node ──────────────────────
node --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Node.js is not installed.
    echo Install it from https://nodejs.org (LTS version)
    pause
    exit /b 1
)

REM ── Check for node_modules, install if missing ──
if not exist "node_modules" (
    echo First run detected — installing dependencies...
    echo This may take a minute...
    npm install
    if errorlevel 1 (
        echo [ERROR] npm install failed.
        pause
        exit /b 1
    )
    echo.
)

REM ── Start the dev server ───────────────
echo Starting Resume Builder...
echo Open in your browser: http://localhost:3000
echo.
echo Press Ctrl+C to stop.
echo ========================================
echo.
npm run dev
