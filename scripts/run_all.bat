@echo off
setlocal enabledelayedexpansion
title QuickType - Synchronized All-In-One Runner
color 0b

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%.."
set "BASE_DIR=%CD%"

if exist "server\index.js" (
    set "CODE_DIR=%BASE_DIR%"
) else if exist "quicktype_code\server\index.js" (
    set "CODE_DIR=%BASE_DIR%\quicktype_code"
) else (
    set "CODE_DIR=%BASE_DIR%"
)

cls
echo =======================================================================
echo          QUICKTYPE - MASTER ALL-IN-ONE SYNCHRONIZED RUNNER
echo                     Web Application Development
echo =======================================================================
echo.
echo  Student Name: Ishan Prajapati
echo  Student ID:   2410112090
echo.
echo  DEPLOYMENT & REPO:
echo  * Production Vercel:  https://quicktype-app.vercel.app
echo  * Custom Alias:       https://ishan-quicktype.vercel.app
echo  * GitHub Repository:  https://github.com/ISHAN9173/QUICK-TYPER
echo =======================================================================
echo.
echo Starting synchronized launch sequence in 2 seconds...
timeout /t 2 > nul

echo.
echo -----------------------------------------------------------------------
echo [STEP 1/5] Checking Dependencies...
echo -----------------------------------------------------------------------
cd /d "%CODE_DIR%"
if not exist "node_modules\" (
    echo [Installing] Frontend packages missing, installing now...
    call npm install
) else (
    echo [OK] Frontend packages verified.
)

if not exist "server\node_modules\" (
    echo [Installing] Backend packages missing, installing now...
    cd server
    call npm install
    cd ..
) else (
    echo [OK] Backend packages verified.
)

echo.
echo -----------------------------------------------------------------------
echo [STEP 2/5] Initializing / Syncing PostgreSQL Database Tables...
echo -----------------------------------------------------------------------
node server/apply_schema.js
if %ERRORLEVEL% equ 0 (
    echo [OK] PostgreSQL database "quicktype_db" and all tables ready!
) else (
    echo [Notice] PostgreSQL setup used fail-safe store mode (all features active).
)

echo.
echo -----------------------------------------------------------------------
echo [STEP 3/5] Starting Backend Server (Port 5000)...
echo -----------------------------------------------------------------------
start "QuickType Backend Server (Port 5000)" cmd /k "cd /d \"%CODE_DIR%\server\" && node index.js"
echo [OK] Backend server launched on http://localhost:5000

echo.
echo -----------------------------------------------------------------------
echo [STEP 4/5] Launching Live PostgreSQL Database Inspector...
echo -----------------------------------------------------------------------
start "QuickType PostgreSQL Live Database Inspector" cmd /k "cd /d \"%SCRIPT_DIR%\" && call view_postgres_live.bat"
echo [OK] Database monitor launched in a dedicated terminal window.

echo.
echo -----------------------------------------------------------------------
echo [STEP 5/5] Starting Frontend Client & Opening Web Browser...
echo -----------------------------------------------------------------------
start "QuickType React Frontend (Port 3000)" cmd /k "cd /d \"%CODE_DIR%\" && npm start"
echo [OK] Frontend client launching on http://localhost:3000

echo.
echo Waiting 4 seconds for React server to initialize before opening browser...
timeout /t 4 > nul
start http://localhost:3000

cls
color 0a
echo =======================================================================
echo          SUCCESS! ALL QUICKTYPE SERVICES ARE RUNNING IN SYNC
echo =======================================================================
echo.
echo  1. Frontend Client:   http://localhost:3000
echo  2. Backend API:       http://localhost:5000/api
echo  3. Database:          PostgreSQL (quicktype_db)
echo  4. Live Cloud Site:   https://quicktype-app.vercel.app
echo  5. GitHub:            https://github.com/ISHAN9173/QUICK-TYPER
echo.
echo  * Take a test on the website, then switch to the Database Inspector
echo    terminal and press Enter to see your test record appear in real time!
echo.
echo =======================================================================
echo Press any key to close this runner (servers will stay running)...
echo =======================================================================
pause > nul
