const express = require('express');
const cors = require('cors');
const db = require('./database/db');
require('./database/init');

const app = express();
const PORT = 3001;
const URL = 'http://localhost:5173';

app.use(cors({ origin: URL }));
app.use(express.json());

// -------------------------------------------------------------------- //
//                                Routes                                //
// -------------------------------------------------------------------- //

// ------------------------------ Genres ------------------------------ //
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

// ------------------------------ Categories ------------------------------ //
app.get('/categories', (req, res) => {
  const categories = db.prepare("SELECT * FROM categories").all();
  res.json(categories);
});

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

app.post('/update-category', (req, res) => {
  const { oldName, newName } = req.body;

  try {
    const updateCategory = db.prepare("UPDATE categories SET name = ? WHERE name = ?");
    const categoryResult = updateCategory.run(newName, oldName);
    res.json({ success: true, categoryChanges: categoryResult.changes });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/delete-category', (req, res) => {
  const { name } = req.body;
  try {
    const stmt = db.prepare("DELETE FROM categories WHERE name = ?");
    const result = stmt.run(name);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ------------------------------ Subcategories ------------------------------ //
app.get('/subcategories', (req, res) => {
  const subcategories = db.prepare("SELECT * FROM subcategories").all();
  res.json(subcategories);
});

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

app.post('/update-subcategory', (req, res) => {
  const { oldName, newName } = req.body;
  try {
    const stmt = db.prepare("UPDATE subcategories SET name = ? WHERE name = ?");
    const result = stmt.run(newName, oldName);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/delete-subcategory', (req, res) => {
  const { name } = req.body;
  try {
    const stmt = db.prepare("DELETE FROM subcategories WHERE name = ?");
    const result = stmt.run(name);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ------------------------------ Origins ------------------------------ //
app.get('/origins', (req, res) => {
  const origins = db.prepare("SELECT * FROM origins").all();
  res.json(origins);
});

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

app.post('/update-origin', (req, res) => {
  const { oldName, newName } = req.body;
  try {
    const stmt = db.prepare("UPDATE origins SET name = ? WHERE name = ?");
    const result = stmt.run(newName, oldName);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/delete-origin', (req, res) => {
  const { name } = req.body;
  try {
    const stmt = db.prepare("DELETE FROM origins WHERE name = ?");
    const result = stmt.run(name);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ------------------------------ Tiers ------------------------------ //
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

// ------------------------------ Years ------------------------------ //
// Incluye la variable 'inUse' que indica si esta siendo utilizado en un juego
app.get('/years', (req, res) => {
  try {
    const yearsStmt = db.prepare(`
      SELECT y.year, 
             EXISTS (
               SELECT 1 FROM games g WHERE g.year = y.year
             ) AS inUse
      FROM years y
      ORDER BY y.year DESC
    `);
    const years = yearsStmt.all();
    res.json(years);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/add-year', (req, res) => {
  const { year } = req.body;
  try {
    const stmt = db.prepare('INSERT INTO years (year) VALUES (?)');
    const result = stmt.run(year);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/delete-year', (req, res) => {
  const { year } = req.body;
  try {
    const stmt = db.prepare('DELETE FROM years WHERE year = ?');
    const result = stmt.run(year);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// -------------------------------------------------------------------- //
//                                Listener                              //
// -------------------------------------------------------------------- //

app.listen(PORT, () => {
  console.log(`✅ Backend corriendo en http://localhost:${PORT}`);
});
