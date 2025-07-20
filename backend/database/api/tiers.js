const db = require('../db');

function addTier(name, color, position) {
  const stmt = db.prepare('INSERT INTO tiers (name, color, position) VALUES (?, ?, ?)');
  return stmt.run(name, color, position);
}

function getTiers() {
  const stmt = db.prepare('SELECT * FROM tiers ORDER BY position');
  return stmt.all();
}

module.exports = { addTier, getTiers };
