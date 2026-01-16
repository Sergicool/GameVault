@echo off
title GameVault Uninstaller
setlocal EnableExtensions EnableDelayedExpansion

echo ===============================
echo    GameVault - Uninstaller
echo ===============================
echo.

:: -----------------------------
:: Check admin privileges
:: -----------------------------
net session >nul 2>nul
if %errorlevel% neq 0 (
    echo Please run this uninstaller as ADMINISTRATOR.
    echo Right-click -> Run as administrator
    pause
    exit /b
)

:: -----------------------------
:: Stop and delete PM2 processes
:: -----------------------------
echo Stopping GameVault PM2 processes...

pm2 list | findstr /i "gamevault-backend" >nul
if %errorlevel% equ 0 (
    echo Stopping backend...
    call pm2 stop gamevault-backend
    call pm2 delete gamevault-backend
)

pm2 list | findstr /i "gamevault-frontend" >nul
if %errorlevel% equ 0 (
    echo Stopping frontend...
    call pm2 stop gamevault-frontend
    call pm2 delete gamevault-frontend
)

:: -----------------------------
:: Save PM2 process list
:: -----------------------------
call pm2 save --force

echo.
echo ===============================
echo PM2 processes removed.
echo ===============================
echo.

:: -----------------------------
:: Prompt to delete project folder
:: -----------------------------
set INSTALL_DIR=%~dp0
echo The GameVault files are located in:
echo %INSTALL_DIR%GameVault
echo.
echo Do you want to delete the GameVault folder? (Y/N)
set /p DELETEFOLDER="> "

if /i "%DELETEFOLDER%"=="Y" (
    echo Deleting folder...
    rmdir /s /q "%INSTALL_DIR%GameVault"
    if %errorlevel% equ 0 (
        echo Folder deleted successfully.
    ) else (
        echo Could not delete the folder. Please delete it manually.
    )
) else (
    echo Folder not deleted. You can remove it manually if desired.
)

echo.
echo ===============================
echo GameVault uninstallation complete.
echo ===============================
pause
