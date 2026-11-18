@echo off
setlocal enabledelayedexpansion
title QuickType - Real-Time Typing Speed Platform
color 0b

set "BASE_DIR=%~dp0"
cd /d "%BASE_DIR%"

if exist "server\index.js" (
    set "CODE_DIR=%BASE_DIR%"
) else if exist "quicktype_code\server\index.js" (
    set "CODE_DIR=%BASE_DIR%quicktype_code"
) else (
    set "CODE_DIR=%BASE_DIR%"
)

cls
echo =======================================================================
echo          QUICKTYPE - ADVANCED REAL-TIME TYPING SPEED PLATFORM
echo                     Web Application Development
echo =======================================================================
echo.
echo  Student Name: Ishan Prajapati
echo  Student ID:   2410112090
echo.
echo  LIVE DEPLOYMENT LINKS:
echo  -----------------------------------------------------------------------
echo  * Production Vercel App:  https://quicktype-app.vercel.app
echo  * Custom Domain Alias:    https://ishan-quicktype.vercel.app
echo  * GitHub Repository:      https://github.com/ISHAN9173/QUICK-TYPER
echo.
echo  LOCAL HOST URLS:
echo  * Frontend Client:        http://localhost:3000
echo  * Backend Server:         http://localhost:5000/api
echo  * Database:               PostgreSQL (quicktype_db)
echo =======================================================================
echo.

cd /d "%CODE_DIR%"

:: 1. Check if frontend node_modules exists
if not exist "node_modules\" (
    echo [Setup] First time run detected! Installing frontend packages...
    call npm install
)

:: 2. Check if server node_modules exists
if not exist "server\node_modules\" (
    echo [Setup] Installing server packages...
    cd server
    call npm install
    cd ..
)

echo [1/3] Starting Backend Server with PostgreSQL Support...
start "QuickType Backend (Port 5000)" cmd /k "cd /d \"%CODE_DIR%\server\" && node index.js"

echo [2/3] Starting Frontend React Application...
start "QuickType Frontend (Port 3000)" cmd /k "cd /d \"%CODE_DIR%\" && npm start"

echo [3/3] Opening Live PostgreSQL Database Inspector...
start "QuickType PostgreSQL Live Data Viewer" cmd /k "cd /d \"%BASE_DIR%\" && call VIEW_POSTGRES_DATABASE.bat"

echo.
echo Launching QuickType in your default browser...
timeout /t 5 > nul
start http://localhost:3000

echo.
echo =======================================================================
echo Both Frontend (3000) and Backend (5000) are running!
echo Keep this terminal window open while using the app.
echo =======================================================================
echo.
pause
