@echo off
title EduConnect Client (Port 5173)
set "PATH=%~dp0tools\node;%PATH%"
cd /d "%~dp0client"
echo ====================================================
echo Starting EduConnect Frontend Client on http://localhost:5173
echo ====================================================
npm run dev
pause
