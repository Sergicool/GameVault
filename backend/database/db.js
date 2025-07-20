const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.resolve(__dirname, 'game_vault.db'));
module.exports = db;
