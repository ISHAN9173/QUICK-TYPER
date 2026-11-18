@echo off
setlocal enabledelayedexpansion
title QuickType - PostgreSQL Live Database Inspector
color 0a

set "BASE_DIR=%~dp0"
cd /d "%BASE_DIR%"

if exist "server\view_db.js" (
    set "TARGET_DIR=%BASE_DIR%"
) else if exist "quicktype_code\server\view_db.js" (
    set "TARGET_DIR=%BASE_DIR%quicktype_code"
) else (
    set "TARGET_DIR=%BASE_DIR%"
)

:loop
cls
echo =======================================================================
echo              QUICKTYPE LIVE POSTGRESQL DATABASE VIEWER
echo =======================================================================
echo  Live Website:     https://quicktype-app.vercel.app
echo  Local Database:   PostgreSQL (quicktype_db) on localhost:5432
echo.
echo  Take a test or practice in the browser, then press Enter to see updates!
echo =======================================================================
echo.

cd /d "%TARGET_DIR%"
node server/view_db.js

echo.
echo -----------------------------------------------------------------------
echo [ENTER] Press Enter to REFRESH and see latest database changes
echo [Q]     Type Q and press Enter to quit
echo -----------------------------------------------------------------------
set /p userchoice="Action: "
if /i "!userchoice!"=="q" exit
goto loop
