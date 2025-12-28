module.exports = function recomputeGamePositions(db) {
  const transaction = db.transaction(() => {

    // Obtener tiers en orden
    const tiers = db.prepare(`
      SELECT name
      FROM tiers
      ORDER BY position ASC
    `).all();

    // Obtener juegos agrupados POR TIER conservando su orden actual
    const gamesByTier = new Map();

    for (const tier of tiers) {
      const games = db.prepare(`
        SELECT name
        FROM games
        WHERE tier = ?
        ORDER BY position ASC
      `).all(tier.name);

      gamesByTier.set(tier.name, games);
    }

    // Juegos sin tier (también conservan orden previo)
    const unassignedGames = db.prepare(`
      SELECT name
      FROM games
      WHERE tier IS NULL
      ORDER BY position ASC
    `).all();

    // Liberar TODAS las posiciones
    db.prepare(`UPDATE games SET position = NULL`).run();

    // Reasignar posiciones globales
    const updateStmt = db.prepare(`
      UPDATE games SET position = ? WHERE name = ?
    `);

    let globalPos = 0;

    for (const tier of tiers) {
      const games = gamesByTier.get(tier.name) || [];
      for (const game of games) {
        updateStmt.run(globalPos++, game.name);
      }
    }

    for (const game of unassignedGames) {
      updateStmt.run(globalPos++, game.name);
    }
  });

  transaction();
};
