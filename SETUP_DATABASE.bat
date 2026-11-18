@echo off
title QuickType - PostgreSQL Database Setup
color 0e
cls
echo =======================================================================
echo             QUICKTYPE POSTGRESQL DATABASE SETUP WIZARD
echo =======================================================================
echo.
echo Setting up PostgreSQL database tables for QuickType...
echo.
node server/apply_schema.js
echo.
echo =======================================================================
echo Database setup finished! 
echo Now double click "START_WEBSITE.bat" to launch the website!
echo =======================================================================
echo.
pause
