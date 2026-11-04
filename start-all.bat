@echo off
title EduConnect One-Click Launcher
echo ====================================================
echo Launching EduConnect Monorepo Services...
echo ====================================================

start "EduConnect Server [Port 5000]" cmd /k "set PATH=%~dp0tools\node;%%PATH%% && cd /d %~dp0server && npm run dev"

timeout /t 3 /nobreak > nul

start "EduConnect Client [Port 5173]" cmd /k "set PATH=%~dp0tools\node;%%PATH%% && cd /d %~dp0client && npm run dev"

echo.
echo Both services have been launched in separate windows!
echo Backend:  http://localhost:5000
echo Frontend: http://localhost:5173
echo.
pause
