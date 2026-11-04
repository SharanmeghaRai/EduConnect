@echo off
title EduConnect Server (Port 5000)
set "PATH=%~dp0tools\node;%PATH%"
cd /d "%~dp0server"
echo ====================================================
echo Starting EduConnect Backend Server on http://localhost:5000
echo ====================================================
npm run dev
pause
