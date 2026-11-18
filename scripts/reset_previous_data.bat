@echo off
title QuickType - Reset & Clear Previous Data
color 0c
cls
echo =======================================================================
echo          QUICKTYPE - CLEAR PREVIOUS TEST DATA (FRESH START)
echo =======================================================================
echo.
echo This will reset the PostgreSQL database so all test history is clean (0 tests).
echo.
set /p confirm="Are you sure you want to reset all test data? (y/n): "
if /i not "%confirm%"=="y" exit /b 0

set "SCRIPT_DIR=%~dp0"
cd /d "%SCRIPT_DIR%.."
set "BASE_DIR=%CD%"

if exist "server\apply_schema.js" (
    node server\apply_schema.js
) else if exist "quicktype_code\server\apply_schema.js" (
    cd /d "%BASE_DIR%\quicktype_code"
    node server\apply_schema.js
)

echo.
echo =======================================================================
echo All previous test data has been cleared! Database is completely fresh.
echo =======================================================================
pause
