# Description

GameVault is a silly and simple local application that you can install on your PC to keep track of the video games you've played. It allows you to rate them, organize them by category, and keep your entire gaming history in one convenient, visual place.

It was created primarily for my personal use, as a sort of game journal, but if you want to try it out and give it a try, here's the step-by-step installation guide to help you do so.

# GameVault - Instructions to Run on Windows with PM2

You can use Visual Studio Code or whatever id you like to run the commands during the installation.

## 1️⃣ Prerequisites

* [Node.js and npm](https://nodejs.org/en/download) installed. Last version should work.
* PM2 installed globally.

```powershell
npm install -g pm2
```

---

## 2️⃣ Clone the Project

```powershell
git clone <your-github-repository>
cd GameVault
```

---

## 3️⃣ Install Dependencies

### Backend:

```powershell
cd backend
npm install
cd ..
```

### Frontend:

```powershell
cd frontend
npm install
cd ..
```

---

## 4️⃣ Build Frontend (Production)

```powershell
cd frontend
npm run build
cd ..
```

* This creates the `frontend/dist` folder with optimized files.

---

## 5️⃣ Start Backend and Frontend with PM2

### Backend:

```powershell
pm2 start backend/server.js --name gamevault-backend
```

### Frontend (SPA):

```powershell
pm2 serve frontend/dist 5173 --name gamevault-frontend --spa
```

* `5173` is the port where the frontend will be served.
* `--spa` ensures that all React routes work correctly.

---

## 6️⃣ Set Up Auto-Start on Windows

PM2 puede configurarse para arrancar automáticamente como un **servicio de Windows**, sin necesidad de scripts manuales.

1. Instala el soporte de auto-start para Windows:

```powershell
npm install pm2-windows-startup -g
```

2. Registra el servicio:

```powershell
pm2-startup install
```

---

## 7️⃣ Save Processes for Auto-Start

```powershell
pm2 save
```

* Saves the current processes so they can be restored later.

---

## 8️⃣ Useful PM2 Commands

* View processes: `pm2 status`
* View logs: `pm2 logs gamevault-backend`
* Stop a process: `pm2 stop gamevault-frontend`
* Restart a process: `pm2 restart gamevault-backend`
* Delete a process: `pm2 delete gamevault-frontend`

