const API_URL = 'http://localhost:3001';

export async function getGenres() {
  const res = await fetch(`${API_URL}/genres`);
  if (!res.ok) throw new Error('Error al obtener géneros');
  return res.json();
}

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

export async function updateGenre(oldName, newName) {
  const res = await fetch(`${API_URL}/update-genre`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al actualizar género');
}

export async function deleteGenre(name) {
  const res = await fetch(`${API_URL}/delete-genre`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error al eliminar género');
  }

  return res.json();
}
