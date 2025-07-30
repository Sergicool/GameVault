const db = require('../db');

function addYear(year) {
  const stmt = db.prepare('INSERT INTO years (year) VALUES (?)');
  return stmt.run(year);
}

function getYears() {
  const stmt = db.prepare('SELECT * FROM years ORDER BY year');
  return stmt.all();
}

function deleteYear(year) {
  const stmt = db.prepare('DELETE FROM years WHERE year = ?');
  return stmt.run(year);
}

module.exports = { addYear, getYears, deleteYear };
