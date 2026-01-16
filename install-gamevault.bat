@echo off
title GameVault Installer
setlocal EnableExtensions EnableDelayedExpansion

echo ===============================
echo    GameVault - Installer
echo ===============================
echo.

:: -----------------------------
:: Check admin privileges
:: -----------------------------
net session >nul 2>nul
if %errorlevel% neq 0 (
    echo Please run this installer as ADMINISTRATOR.
    echo Right-click -> Run as administrator
    pause
    exit /b
)

:: -----------------------------
:: Check Node.js
:: -----------------------------
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo Node.js is not installed.
    echo Download from https://nodejs.org
    pause
    exit /b
)

:: -----------------------------
:: Check npm
:: -----------------------------
where npm >nul 2>nul
if %errorlevel% neq 0 (
    echo npm is not available.
    pause
    exit /b
)

echo Node.js and npm detected
echo.

:: -----------------------------
:: Check Git
:: -----------------------------
where git >nul 2>nul
if %errorlevel% neq 0 (
    echo Git is not installed.
    echo Download from https://git-scm.com
    pause
    exit /b
)

echo Git detected
echo.

:: -----------------------------
:: Install PM2
:: -----------------------------
call pm2 -v >nul 2>nul
if %errorlevel% neq 0 (
    echo Installing PM2...
    call npm install -g pm2
)

echo PM2 ready
echo.

:: -----------------------------
:: Set working directory to where .bat is located
:: -----------------------------
set INSTALL_DIR=%~dp0
cd /d "%INSTALL_DIR%"

:: -----------------------------
:: Clone repository
:: -----------------------------
if not exist GameVault (
    echo Cloning GameVault repository into "%INSTALL_DIR%"...
    git clone https://github.com/Sergicool/GameVault.git
) else (
    echo GameVault folder already exists, skipping clone.
)

cd GameVault

:: -----------------------------
:: Install all dependencies from root (monorepo)
:: -----------------------------
echo Installing all dependencies from root...
call npm install --legacy-peer-deps
echo Running npm audit fix...
call npm audit fix --force
echo Dependencies installed
echo.

:: -----------------------------
:: Backend setup
:: -----------------------------
echo Installing backend dependencies...
cd backend
call npm install
echo Running npm audit fix for backend...
call npm audit fix --force
cd ..

:: -----------------------------
:: Frontend setup
:: -----------------------------
echo Installing frontend dependencies...
cd frontend
call npm install

:: Install known missing dependencies
echo Installing missing frontend dependencies...
call npm install framer-motion @headlessui/react react-beautiful-dnd

echo Running npm audit fix for frontend...
call npm audit fix --force

echo Building frontend...
call npm run build
cd ..

:: -----------------------------
:: Start services with PM2
:: -----------------------------
echo Starting backend...
call pm2 start backend/server.js --name gamevault-backend

echo Starting frontend...
call pm2 serve frontend/dist 5173 --name gamevault-frontend --spa

:: -----------------------------
:: Save PM2 processes
:: -----------------------------
call pm2 save

:: -----------------------------
:: Setup auto-start on Windows
:: -----------------------------
echo Setting up auto-start task...
schtasks /create /sc onlogon /tn "GameVault" /tr "\"%APPDATA%\npm\pm2.cmd\" resurrect" /rl highest /f >nul 2>nul

echo.
echo ===============================
echo GameVault installed successfully!
echo Open your browser at: http://localhost:5173
echo GameVault will automatically start on Windows login.
echo ===============================
pause
