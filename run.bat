@echo off
setlocal
title AYUSH.OS - Personal AI Operating System Launcher

cd /d "%~dp0"

echo ================================================================
echo                   AYUSH.OS - SYSTEM LAUNCHER
echo          Personal AI Operating System ^& Career Archive
echo ================================================================
echo.

:: 1. Check if Node.js is installed
where node >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not found in your system PATH!
    echo Please install Node.js from https://nodejs.org/ and try again.
    echo.
    pause
    exit /b 1
)

:: 2. Check if dependencies are installed
if not exist "node_modules\" (
    echo [SETUP] First-time setup detected. Installing dependencies...
    echo.
    call npm install
    if %errorlevel% neq 0 (
        echo.
        echo [ERROR] Failed to install dependencies.
        pause
        exit /b 1
    )
    echo [SETUP] Dependencies installed successfully.
    echo.
)

:: 3. Free port 2903 if an orphaned server process is holding it
echo [SYSTEM] Checking port 2903 availability...
node backend/clearPort.js
echo.

echo [SYSTEM] Starting AYUSH.OS Server (Frontend + Backend APIs)...
echo [LOCAL]     http://localhost:2903
echo [TAILSCALE] https://desktop-h8mo8ja.tail990fed.ts.net/
echo [APPS]      Projects Explorer, Internships, Resume, Media Gallery
echo.
echo ================================================================
echo Server is running. Keep this window open for Tailscale access.
echo ================================================================
echo.

:: Open default browser to the app
start http://localhost:2903

:: Start the Express server
node server.js

if %errorlevel% neq 0 (
    echo.
    echo [SYSTEM] Server stopped with exit code %errorlevel%.
    pause
)
