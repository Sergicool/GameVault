# Description

GameVault is a silly and simple local application that you can install on your PC to keep track of the video games you’ve played. It allows you to rate them, organize them by category, and keep your entire gaming history in one convenient, visual place.

It was created primarily for my personal use, as a kind of game journal, but if you’d like to try it yourself, here’s a simple step-by-step installation guide to get you started.

# GameVault – Installation on Windows

GameVault is a local application for keeping track of the video games you’ve played.

The installer automates the entire setup and startup process using PM2.

## 📋 Prerequisites

* Windows 10 / 11
* [Node.js and npm](https://nodejs.org/en/download) installed. Last version should work.
* [Git](https://git-scm.com/)

## 📁 Where to use the installer

1. Download the `install-gamevault.bat` file
2. Place it in **the folder where you want the GameVault files to be installed**

The project will be cloned automatically inside that folder.

## 🚀 Installation

1. Right-click on install-gamevault.bat
2. Select `Run as administrator`

Wait for the process to finish (this may take a few minutes).

The installer will:

* Clone the GameVault repository
* Install PM2 (if it’s not already installed)
* Install all dependencies
* Build the frontend
* Start both backend and frontend
* Configure GameVault to start automatically with Windows

## 🎮 Usage

Once the installation is complete, the application will be running at http://localhost:5173.
For easier access, you can save this address as a browser bookmark.

GameVault will start automatically every time Windows boots.
You just need to open it in your browser.

## ❌ Uninstallation (manual)

Stop and remove the PM2 processes, open a terminal and execute:

```
pm2 delete gamevault-backend
pm2 delete gamevault-frontend
pm2 save
```

Delete the GameVault folder from the location where you installed it.