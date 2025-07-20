const express = require('express');
const cors = require('cors');
const db = require('./database/db');
require('./database/init');

const app = express();
const PORT = 3001;
const URL = 'http://localhost:5173';

app.use(cors({ origin: URL }));
app.use(express.json());

// ------------------------------ Routes ------------------------------ //

// ----- Genres ----- //
app.post('/add-genre', (req, res) => {
  const { name, color } = req.body;
  try {
    const stmt = db.prepare("INSERT INTO genres (name, color) VALUES (?, ?)");
    const result = stmt.run(name, color);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/genres', (req, res) => {
  const genres = db.prepare("SELECT * FROM genres").all();
  res.json(genres);
});

// ----- Categories ----- //
app.post('/add-category', (req, res) => {
  const { name } = req.body;
  try {
    const stmt = db.prepare("INSERT INTO categories (name) VALUES (?)");
    const result = stmt.run(name);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/categories', (req, res) => {
  const categories = db.prepare("SELECT * FROM categories").all();
  res.json(categories);
});

// ----- Subcategories ----- //
app.post('/add-subcategory', (req, res) => {
  const { name, category } = req.body;
  try {
    const stmt = db.prepare("INSERT INTO subcategories (name, category) VALUES (?, ?)");
    const result = stmt.run(name, category);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/subcategories', (req, res) => {
  const subcategories = db.prepare("SELECT * FROM subcategories").all();
  res.json(subcategories);
});

// ----- Origins ----- //
app.post('/add-origin', (req, res) => {
  const { name } = req.body;
  try {
    const stmt = db.prepare("INSERT INTO origins (name) VALUES (?)");
    const result = stmt.run(name);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/origins', (req, res) => {
  const origins = db.prepare("SELECT * FROM origins").all();
  res.json(origins);
});

// ----- Tiers ----- //
app.post('/add-tier', (req, res) => {
  const { name, color, position } = req.body;
  try {
    const stmt = db.prepare("INSERT INTO tiers (name, color, position) VALUES (?, ?, ?)");
    const result = stmt.run(name, color, position);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/tiers', (req, res) => {
  const tiers = db.prepare("SELECT * FROM tiers").all();
  res.json(tiers);
});

// ----- Years ----- //
app.post('/add-year', (req, res) => {
  const { year } = req.body;
  try {
    const stmt = db.prepare("INSERT INTO years (year) VALUES (?)");
    const result = stmt.run(year);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.get('/years', (req, res) => {
  const years = db.prepare("SELECT * FROM years ORDER BY year DESC").all();
  res.json(years);
});

// ------------------------------ Listener ------------------------------ //

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
