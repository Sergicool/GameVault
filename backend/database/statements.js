const Database = require('better-sqlite3');

// Crea o abre la base de datos
const db = new Database('./game_vault.db');

// Inicializa la tabla si no existe
db.exec(`
  CREATE TABLE IF NOT EXISTS genres (
    name TEXT PRIMARY KEY,
    color TEXT
  );
`);

module.exports = db;
