const db = require('../db');

function addGenre(name, color) {
  const stmt = db.prepare("INSERT INTO genres (name, color) VALUES (?, ?)");
  return stmt.run(name, color);
}

function getGenres() {
  const stmt = db.prepare("SELECT * FROM genres");
  return stmt.all();
}

module.exports = {
  addGenre,
  getGenres
};
