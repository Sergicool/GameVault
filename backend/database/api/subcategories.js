const db = require('../db');

function addSubcategory(name, category) {
  const stmt = db.prepare('INSERT INTO subcategories (name, category) VALUES (?, ?)');
  return stmt.run(name, category);
}

function getSubcategories() {
  const stmt = db.prepare('SELECT * FROM subcategories');
  return stmt.all();
}

module.exports = { addSubcategory, getSubcategories };
