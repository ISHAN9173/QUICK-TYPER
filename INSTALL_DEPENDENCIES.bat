@echo off
title QuickType - First Time Setup & Dependency Installer
color 0b
cls
echo =======================================================================
echo          QUICKTYPE - ONE-CLICK INSTALLER FOR ANY LAPTOP
echo =======================================================================
echo.
echo Installing Frontend Dependencies (React, UI components)...
call npm install
echo.
echo Installing Backend Server Dependencies (Express, PostgreSQL client)...
cd server
call npm install
cd ..
echo.
echo =======================================================================
echo All dependencies installed successfully!
echo You can now double-click "START_WEBSITE.bat" to run QuickType!
echo =======================================================================
echo.
pause
