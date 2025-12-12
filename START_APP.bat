@echo off
title MyFit MK Launcher
color 0A
cd /d "%~dp0"
cls

echo ===================================================
echo      MYFIT MK - VLADO SMILEVSKI
echo ===================================================
echo.

REM 1. Check for Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0C
    echo [ERROR] Node.js is not installed!
    echo Please download and install it from: https://nodejs.org/
    echo.
    pause
    exit
)

REM 2. Install dependencies if missing
if not exist "node_modules" (
    echo [INFO] First run detected. Installing dependencies...
    echo This might take a few minutes. Please wait.
    echo.
    call npm install
    if %errorlevel% neq 0 (
        color 0C
        echo [ERROR] Failed to install dependencies.
        pause
        exit
    )
    cls
    echo ===================================================
    echo      MYFIT MK - VLADO SMILEVSKI
    echo ===================================================
    echo.
)

REM 3. Start the App
echo [INFO] Starting Application on Port 5175...
echo.
echo ---------------------------------------------------
echo  App Password: 1111
echo  Admin Code:   VLADO-BOSS-KEY-2025
echo ---------------------------------------------------
echo.
echo Press Ctrl+C to stop the server.
echo.

start "" "http://localhost:5175"
call npm run dev

pause