const db = require('../db');

function addCategory(name) {
  const stmt = db.prepare('INSERT INTO categories (name) VALUES (?)');
  return stmt.run(name);
}

function getCategories() {
  const stmt = db.prepare('SELECT * FROM categories');
  return stmt.all();
}

module.exports = { addCategory, getCategories };
