const express = require('express');
const cors = require('cors');
const db = require('./database/statements');

const app = express();
const PORT = 3001;

// Configurar CORS para permitir acceso desde React (puerto 5173 por defecto con Vite)
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST'],
  credentials: true,
}));

app.use(express.json());

// Ruta para insertar un nuevo genero
app.post('/add-genre', (req, res) => {
  const { name, color } = req.body;
  try {
    const stmt = db.prepare("INSERT INTO genres (name, color) VALUES (?, ?)");
    stmt.run(name, color);
    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
