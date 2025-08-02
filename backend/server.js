const express = require('express');
const cors = require('cors');
const db = require('./database/db');
db.exec('PRAGMA foreign_keys = ON'); // Para que ON UPDATE CASCADE funcione
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
  try {
    const genres = db.prepare(`
      SELECT g.name, g.color,
             EXISTS (
               SELECT 1
               FROM game_genres gg
               WHERE gg.genre_name = g.name
             ) AS inUse
      FROM genres g
      ORDER BY g.name
    `).all();
    res.json(genres);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/update-genre', (req, res) => {
  const { oldName, newName } = req.body;
  try {
    const stmt = db.prepare("UPDATE genres SET name = ? WHERE name = ?");
    const result = stmt.run(newName, oldName);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar género' });
  }
});

app.post('/delete-genre', (req, res) => {
  const { name } = req.body;
  try {
    const inUse = db.prepare(`
      SELECT 1
      FROM game_genres
      WHERE genre_name = ?
      LIMIT 1
    `).get(name);

    if (inUse) {
      return res.status(400).json({
        error: 'No se puede eliminar el género porque está asignado a uno o más juegos',
      });
    }

    const stmt = db.prepare("DELETE FROM genres WHERE name = ?");
    const result = stmt.run(name);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// ------------------------------ Categories ------------------------------ //
app.get('/categories', (req, res) => {
  try {
    const categoriesStmt = db.prepare(`
      SELECT c.name,
        EXISTS (
          SELECT 1 FROM games g WHERE g.category = c.name
        ) OR
        EXISTS (
          SELECT 1 FROM subcategories s WHERE s.category = c.name
        ) AS inUse
      FROM categories c
      ORDER BY c.name
    `);
    const categories = categoriesStmt.all();
    res.json(categories);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
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
  try {
    const subcategoriesStmt = db.prepare(`
      SELECT s.name, s.category,
             EXISTS (
               SELECT 1 FROM games g WHERE g.subcategory = s.name
             ) AS inUse
      FROM subcategories s
      ORDER BY s.name
    `);
    const subcategories = subcategoriesStmt.all();
    res.json(subcategories);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
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
  try {
    const originsStmt = db.prepare(`
      SELECT o.name,
             EXISTS (
               SELECT 1 FROM games g WHERE g.origin = o.name
             ) AS inUse
      FROM origins o
      ORDER BY o.name
    `);
    const origins = originsStmt.all();
    res.json(origins);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
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
app.get('/tiers', (req, res) => {
  try {
    const stmt = db.prepare(`
      SELECT t.*, 
             EXISTS (
               SELECT 1 FROM games g WHERE g.tier = t.name
             ) AS inUse
      FROM tiers t
      ORDER BY t.position ASC
    `);
    const tiers = stmt.all();
    res.json(tiers);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

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

app.post('/update-tier', (req, res) => {
  const { oldName, newName } = req.body;
  try {
    const stmt = db.prepare("UPDATE tiers SET name = ? WHERE name = ?");
    const result = stmt.run(newName, oldName);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    res.status(500).json({ error: 'Error al actualizar tier' });
  }
});

app.post('/delete-tier', (req, res) => {
  const { name } = req.body;
  try {
    const stmt = db.prepare("DELETE FROM tiers WHERE name = ?");
    const result = stmt.run(name);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/move-tier-up', (req, res) => {
  const { name } = req.body;
  try {
    const current = db.prepare("SELECT * FROM tiers WHERE name = ?").get(name);
    if (!current) throw new Error("Tier no encontrado");

    const above = db.prepare("SELECT * FROM tiers WHERE position < ? ORDER BY position DESC LIMIT 1").get(current.position);
    if (!above) return res.json({ success: false, message: "Ya está en la primera posición" });

    const update = db.prepare("UPDATE tiers SET position = ? WHERE name = ?");

    update.run(-1, above.name);

    update.run(above.position, current.name);
    update.run(current.position, above.name);

    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/move-tier-down', (req, res) => {
  const { name } = req.body;
  try {
    const current = db.prepare("SELECT * FROM tiers WHERE name = ?").get(name);
    if (!current) throw new Error("Tier no encontrado");

    const below = db.prepare("SELECT * FROM tiers WHERE position > ? ORDER BY position ASC LIMIT 1").get(current.position);
    if (!below) return res.json({ success: false, message: "Ya está en la última posición" });

    const update = db.prepare("UPDATE tiers SET position = ? WHERE name = ?");

    update.run(-1, below.name);

    update.run(below.position, current.name);
    update.run(current.position, below.name);

    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
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
