const API_URL = 'http://localhost:3001';

export async function getGames() {
  const res = await fetch(`${API_URL}/games`);
  if (!res.ok) throw new Error('Error al obtener juegos');
  return res.json();
}

export async function addGame(gameData) {
  const formData = new FormData();

  formData.append('name', gameData.name);
  formData.append('image', gameData.image);
  formData.append('year', gameData.year);
  formData.append('origin', gameData.origin);
  formData.append('category', gameData.category);
  formData.append('subcategory', gameData.subcategory);
  formData.append('extension_of', gameData.extension_of || '');

  gameData.genres.forEach((genre) => {
    formData.append('genres[]', genre);
  });

  const res = await fetch(`${API_URL}/add-game`, {
    method: 'POST',
    body: formData,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al agregar juego');
  }

  return res.json();
}

export async function updateGame(gameData) {
  const formData = new FormData();

  formData.append('name', gameData.name);
  formData.append('year', gameData.year);
  formData.append('origin', gameData.origin);
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
    throw new Error(err.error || 'Error al actualizar juego');
  }

  return res.json();
}

