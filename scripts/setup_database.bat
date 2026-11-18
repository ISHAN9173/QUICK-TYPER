@echo off
title QuickType - PostgreSQL Database Setup
color 0e

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%.."
set "BASE_DIR=%CD%"

if exist "server\apply_schema.js" (
    set "CODE_DIR=%BASE_DIR%"
) else if exist "quicktype_code\server\apply_schema.js" (
    set "CODE_DIR=%BASE_DIR%\quicktype_code"
) else (
    set "CODE_DIR=%BASE_DIR%"
)

cls
echo =======================================================================
echo             QUICKTYPE POSTGRESQL DATABASE SETUP WIZARD
echo =======================================================================
echo.
echo Setting up PostgreSQL database tables for QuickType...
echo.

cd /d "%CODE_DIR%"
node server/apply_schema.js
echo.
echo =======================================================================
echo Database setup finished! 
echo Now run "RUN.bat" to launch the website!
echo =======================================================================
echo.
pause
