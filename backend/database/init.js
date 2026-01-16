const db = require('./db');

db.exec(`

CREATE TABLE IF NOT EXISTS years (
  year INTEGER PRIMARY KEY CHECK(year >= 1900)
);

CREATE TABLE IF NOT EXISTS origins (
  name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS platforms (
  name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS categories (
  name TEXT PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS subcategories (
  name TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tiers (
  name TEXT PRIMARY KEY,
  color TEXT NOT NULL CHECK(color GLOB '#[A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9]'),
  position INTEGER NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS genres (
  name TEXT PRIMARY KEY,
  color TEXT NOT NULL CHECK(color GLOB '#[A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9]')
);

CREATE TABLE IF NOT EXISTS games (
  name TEXT PRIMARY KEY,
  image BLOB,
  year INTEGER,
  origin TEXT,
  platform TEXT,
  category TEXT,
  subcategory TEXT,
  tier TEXT,
  position INTEGER UNIQUE,
  extension_of TEXT,
  pending_replay INTEGER NOT NULL DEFAULT 0,

  FOREIGN KEY (year) REFERENCES years(year),
  FOREIGN KEY (origin) REFERENCES origins(name) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (platform) REFERENCES platforms(name) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (subcategory) REFERENCES subcategories(name) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (tier) REFERENCES tiers(name) ON UPDATE CASCADE ON DELETE SET NULL,
  FOREIGN KEY (extension_of) REFERENCES games(name) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_genres (
  game_name TEXT,
  genre_name TEXT,
  order_index INTEGER DEFAULT 0,
  PRIMARY KEY (game_name, genre_name),
  FOREIGN KEY (game_name) REFERENCES games(name) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (genre_name) REFERENCES genres(name) ON UPDATE CASCADE ON DELETE CASCADE
);

`);
