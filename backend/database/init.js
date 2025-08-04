const db = require('./db');

db.exec(`

CREATE TABLE IF NOT EXISTS years (
  year INTEGER PRIMARY KEY CHECK(year >= 2010 AND year <= 2100)
);

CREATE TABLE IF NOT EXISTS origins (
  name TEXT PRIMARY KEY CHECK(length(name) <= 20)
);

CREATE TABLE IF NOT EXISTS categories (
  name TEXT PRIMARY KEY CHECK(length(name) <= 20)
);

CREATE TABLE IF NOT EXISTS subcategories (
  name TEXT PRIMARY KEY CHECK(length(name) <= 30),
  category TEXT NOT NULL,
  FOREIGN KEY (category) REFERENCES categories(name) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS tiers (
  name TEXT PRIMARY KEY CHECK(length(name) <= 20),
  color TEXT NOT NULL CHECK(color GLOB '#[A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9]'),
  position INTEGER NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS genres (
  name TEXT PRIMARY KEY CHECK(length(name) <= 20),
  color TEXT NOT NULL CHECK(color GLOB '#[A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9][A-Fa-f0-9]')
);

CREATE TABLE IF NOT EXISTS games (
  name TEXT PRIMARY KEY CHECK(length(name) <= 50),
  image BLOB,
  year INTEGER NOT NULL,
  origin TEXT NOT NULL,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  tier TEXT,
  position INTEGER UNIQUE,
  extension_of TEXT,

  FOREIGN KEY (year) REFERENCES years(year),
  FOREIGN KEY (origin) REFERENCES origins(name),
  FOREIGN KEY (category) REFERENCES categories(name),
  FOREIGN KEY (subcategory) REFERENCES subcategories(name),
  FOREIGN KEY (tier) REFERENCES tiers(name),
  FOREIGN KEY (extension_of) REFERENCES games(name) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS game_genres (
  game_name TEXT,
  genre_name TEXT,
  PRIMARY KEY (game_name, genre_name),
  FOREIGN KEY (game_name) REFERENCES games(name) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (genre_name) REFERENCES genres(name) ON UPDATE CASCADE ON DELETE CASCADE
);

`);
