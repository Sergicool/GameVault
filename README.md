# Dependencies

npm install concurrently@8.2.2

npm install cors@2.8.5

npm install framer-motion@11.0.4

npm install multer@2.0.2

npm install react-beautiful-dnd@13.1.1

npm install react-colorful@5.6.1

npm install react-use@17.6.0




# GameVault - Instructions to Run on Windows with PM2

## 1️⃣ Prerequisites

* Node.js and npm installed.
* PM2 installed globally:

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

