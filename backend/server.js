const express = require('express');
const path = require("path");
const cors = require('cors');
const db = require('./database/db');
db.pragma('foreign_keys = ON'); // Para que ON UPDATE CASCADE funcione
require('./database/init');
const app = express();
const PORT = 3001;
const URL = 'http://localhost:5173';
app.use(cors({ origin: URL }));
app.use(express.json());

const multer = require('multer');

const storage = multer.memoryStorage(); // Almacena en memoria, no en disco
const upload = multer({ storage });

const fs = require("fs");
const dbUpload = multer({ dest: "uploads/" });

const recomputeGamePositions = require('./recomputeGamePositions');

// -------------------------------------------------------------------- //
//                       Download database backup                       //
// -------------------------------------------------------------------- //

app.get("/download-db", (req, res) => {
  const dbPath = path.join(__dirname, "database", "game_vault.db");
  res.download(dbPath, "game_vault.db", (err) => {
    if (err) {
      console.error("Error al enviar la DB:", err);
      res.status(500).send("Error descargando la base de datos");
    }
  });
});

// -------------------------------------------------------------------- //
//                         Import database file                         //
// -------------------------------------------------------------------- //

app.post("/upload-db", dbUpload.single("dbfile"), (req, res) => {
  const tempPath = req.file.path; // archivo subido en /uploads
  const targetPath = path.join(__dirname, "database", "game_vault.db");

  fs.copyFile(tempPath, targetPath, (err) => {
    if (err) {
      console.error("❌ Error copiando DB:", err);
      return res.status(500).json({ success: false, error: err.message });
    }

    // eliminar archivo temporal
    fs.unlink(tempPath, () => {});
    console.log("✅ Base de datos reemplazada");
    res.json({ success: true, message: "Base de datos importada correctamente" });
  });
});

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
  const { oldName, newName, color } = req.body;
  if (!oldName || !newName || !color) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const stmt = db.prepare("UPDATE genres SET name = ?, color = ? WHERE name = ?");
    const result = stmt.run(newName, color, oldName);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    console.error(e);
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

// ------------------------------ Platforms ------------------------------ //
app.get('/platforms', (req, res) => {
  try {
    const originsStmt = db.prepare(`
      SELECT p.name,
             EXISTS (
               SELECT 1 FROM games g WHERE g.platform = p.name
             ) AS inUse
      FROM platforms p
      ORDER BY p.name
    `);
    const origins = originsStmt.all();
    res.json(origins);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/add-platform', (req, res) => {
  const { name } = req.body;
  try {
    const stmt = db.prepare("INSERT INTO platforms (name) VALUES (?)");
    const result = stmt.run(name);
    res.json({ success: true, id: result.lastInsertRowid });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/update-platform', (req, res) => {
  const { oldName, newName } = req.body;
  try {
    const stmt = db.prepare("UPDATE platforms SET name = ? WHERE name = ?");
    const result = stmt.run(newName, oldName);
    res.json({ success: true, changes: result.changes });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/delete-platform', (req, res) => {
  const { name } = req.body;
  try {
    const stmt = db.prepare("DELETE FROM platforms WHERE name = ?");
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
  const { name, color } = req.body;

  try {
    const lastPos = db
      .prepare('SELECT MAX(position) as maxPos FROM tiers')
      .get();

    const position = (lastPos.maxPos ?? -1) + 1;

    const stmt = db.prepare(`
      INSERT INTO tiers (name, color, position)
      VALUES (?, ?, ?)
    `);

    const result = stmt.run(name, color, position);

    res.json({ success: true });
  } catch (e) {
    console.error(e);
    res.status(400).json({ error: e.message });
  }
});

app.post('/update-tier', (req, res) => {
  const { oldName, newName, color } = req.body;

  if (!oldName || !newName || !color) {
    return res.status(400).json({ error: 'Datos incompletos' });
  }

  try {
    const stmt = db.prepare(`
      UPDATE tiers
      SET name = ?, color = ?
      WHERE name = ?
    `);

    const result = stmt.run(newName, color, oldName);

    res.json({
      success: true,
      changes: result.changes
    });
  } catch (e) {
    console.error(e);
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

    recomputeGamePositions(db);
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

    recomputeGamePositions(db);
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

// ------------------------------ Games ------------------------------ //


app.get('/games', (req, res) => {
  try {
    const gameStmt = db.prepare(`
      SELECT g.*, t.color as tierColor
      FROM games g
      LEFT JOIN tiers t ON g.tier = t.name
    `);

    const genreStmt = db.prepare(`
      SELECT g.name, g.color, gg.order_index
      FROM game_genres gg
      JOIN genres g ON g.name = gg.genre_name
      WHERE gg.game_name = ?
      ORDER BY gg.order_index ASC
    `);

    const games = gameStmt.all();

    const enrichedGames = games.map(game => {
      const genres = genreStmt.all(game.name).sort((a, b) => a.order_index - b.order_index);
      return {
        ...game,
        genres,
        tierColor: game.tierColor, // color del tier
      };
    });

    res.json(enrichedGames);
  } catch (err) {
    console.error('Error al obtener juegos:', err.message);
    res.status(500).json({ error: 'Error al obtener juegos' });
  }
});


app.get('/games/:name', (req, res) => {
  try {
    const gameStmt = db.prepare('SELECT * FROM games WHERE name = ?');
    const genreStmt = db.prepare(`
      SELECT g.name, g.color, gg.order_index
      FROM game_genres gg
      JOIN genres g ON g.name = gg.genre_name
      WHERE gg.game_name = ?
      ORDER BY gg.order_index ASC;
    `);

    const game = gameStmt.get(req.params.name);
    if (!game) return res.status(404).json({ error: 'Juego no encontrado' });

    const genres = genreStmt.all(game.name);
    res.json({ ...game, genres });
  } catch (err) {
    console.error('Error al obtener juego:', err.message);
    res.status(500).json({ error: 'Error al obtener juego' });
  }
});

app.post('/games/tierlist', (req, res) => {
  try {
    const updates = req.body;

    const transaction = db.transaction(() => {
      // Liberar todas las posiciones de golpe
      db.prepare('UPDATE games SET position = NULL').run();

      // Aplicar actualizaciones
      const stmt = db.prepare('UPDATE games SET tier = ?, position = ? WHERE name = ?');

      for (const game of updates) {
        stmt.run(game.tier, game.position, game.name);
      }
    });

    transaction();

    res.json({ success: true });
  } catch (e) {
    console.error("❌ Error en /games/tierlist:", e.message);
    res.status(400).json({ error: e.message });
  }
});

app.post('/add-game', upload.single('image'), (req, res) => {
  const {
    name,
    year,
    origin,
    platform,
    category,
    subcategory,
    extension_of,
  } = req.body;

  const genres = req.body.genres
    ? Array.isArray(req.body.genres)
      ? req.body.genres
      : [req.body.genres]
    : [];

  const imageBuffer = req.file ? req.file.buffer : null;

  try {
    const insertGame = db.prepare(`
      INSERT INTO games (
        name, image, year, origin, platform, category, subcategory, tier, position, extension_of
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insertGame.run(
      name,
      imageBuffer,
      parseInt(year),
      origin,
      platform,
      category,
      subcategory,
      null,
      null,
      extension_of || null
    );

    const insertGenre = db.prepare(`
      INSERT INTO game_genres (game_name, genre_name, order_index)
      VALUES (?, ?, ?)
    `);

    for (let i = 0; i < genres.length; i++) {
      insertGenre.run(name, genres[i], i);
    }

    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/update-game', upload.single('image'), (req, res) => {
  const {
    name,
    year,
    origin,
    platform,
    category,
    subcategory,
    extension_of,
  } = req.body;

  const genres = req.body.genres
    ? Array.isArray(req.body.genres)
      ? req.body.genres
      : [req.body.genres]
    : [];

  const imageBuffer = req.file ? req.file.buffer : null;

  try {
    const stmt = db.prepare(`
      UPDATE games SET
        image = COALESCE(?, image),
        year = ?, origin = ?, platform = ?, category = ?, subcategory = ?, extension_of = ?
      WHERE name = ?
    `);
    stmt.run(
      imageBuffer,
      parseInt(year),
      origin,
      platform,
      category,
      subcategory,
      extension_of || null,
      name
    );

    // Actualizar géneros con nuevo orden
    db.prepare('DELETE FROM game_genres WHERE game_name = ?').run(name);

    const insertGenre = db.prepare(`
      INSERT INTO game_genres (game_name, genre_name, order_index)
      VALUES (?, ?, ?)
    `);

    for (let i = 0; i < genres.length; i++) {
      insertGenre.run(name, genres[i], i);
    }

    res.json({ success: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/delete-game', (req, res) => {
  const { name } = req.body;
  
  try {
    const deleteGenres = db.prepare('DELETE FROM game_genres WHERE game_name = ?');
    deleteGenres.run(name);

    const deleteGame = db.prepare('DELETE FROM games WHERE name = ?');
    const result = deleteGame.run(name);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Juego no encontrado' });
    }

    recomputeGamePositions(db);
    res.json({ success: true });
  } catch (e) {
    console.error('Error al eliminar juego:', e.message);
    res.status(500).json({ error: 'Error al eliminar juego' });
  }
});

// Imagen

app.get('/game-image/:name', (req, res) => {
  const { name } = req.params;

  try {
    const stmt = db.prepare('SELECT image FROM games WHERE name = ?');
    const result = stmt.get(name);

    if (!result || !result.image) {
      return res.status(404).send('Imagen no encontrada');
    }

    res.set('Content-Type', 'image/jpeg'); // o 'image/png' si usas PNG
    res.send(result.image);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

app.post('/update-game-image', upload.single('image'), (req, res) => {
  const { name } = req.body;
  const imageBuffer = req.file ? req.file.buffer : null;

  try {
    const stmt = db.prepare('UPDATE games SET image = ? WHERE name = ?');
    const result = stmt.run(imageBuffer, name);

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
