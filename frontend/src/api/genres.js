const API_URL = 'http://localhost:3001';

export async function addGenre(name, color) {
  const res = await fetch(`${API_URL}/add-genre`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al agregar género');
  }

  return res.json();
}

export async function getGenres() {
  const res = await fetch(`${API_URL}/genres`);
  if (!res.ok) throw new Error('Error al obtener géneros');
  return res.json();
}