const API_URL = 'http://localhost:3001';

export async function getGames() {
  const res = await fetch(`${API_URL}/games`);
  if (!res.ok) throw new Error('Error obtaining games');
  return res.json();
}

export async function getGameByName(name) {
  const res = await fetch(`${API_URL}/games/${encodeURIComponent(name)}`);
  if (!res.ok) throw new Error('Error obtaining game');
  return res.json();
}

export async function addGame(gameData) {
  const formData = new FormData();

  formData.append('name', gameData.name);
  formData.append('image', gameData.image);
  formData.append('year', gameData.year);
  formData.append('origin', gameData.origin);
  formData.append('platform', gameData.platform);
  formData.append('category', gameData.category);
  formData.append('subcategory', gameData.subcategory);
  formData.append('extension_of', gameData.extension_of || '');

  gameData.genres.forEach((genre) => {
    formData.append('genres', genre);
  });

  const res = await fetch(`${API_URL}/add-game`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error adding game');
  }

  return res.json();
}

export async function updateGame(gameData) {
  const formData = new FormData();

  formData.append('name', gameData.name);
  formData.append('year', gameData.year);
  formData.append('origin', gameData.origin);
  formData.append('platform', gameData.platform);
  formData.append('category', gameData.category);
  formData.append('subcategory', gameData.subcategory);
  formData.append('extension_of', gameData.extension_of || '');

  if (gameData.image) {
    formData.append('image', gameData.image);
  }

  gameData.genres.forEach((genre) => {
    formData.append('genres', genre);
  });

  const res = await fetch(`${API_URL}/update-game`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error updating game');
  }

  return res.json();
}

export async function updateGamesTierList(games) {
  const res = await fetch(`${API_URL}/games/tierlist`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(games),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error updating tier list');
  return data;
}

export async function deleteGame(name) {

  const res = await fetch(`${API_URL}/delete-game`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error deleting game');
  }

  return res.json();
}
