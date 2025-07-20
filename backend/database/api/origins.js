const db = require('../db');

function addOrigin(name) {
  const stmt = db.prepare('INSERT INTO origins (name) VALUES (?)');
  return stmt.run(name);
}

function getOrigins() {
  const stmt = db.prepare('SELECT * FROM origins');
  return stmt.all();
}

module.exports = { addOrigin, getOrigins };
