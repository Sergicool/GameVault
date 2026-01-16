const API_URL = 'http://localhost:3001';

export async function getGenres() {
  const res = await fetch(`${API_URL}/genres`);
  if (!res.ok) throw new Error('Error obtaining genres');
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
    throw new Error(err.error || 'Error adding genre');
  }

  return res.json();
}

export async function updateGenre(oldName, newName, color) {
  const res = await fetch(`${API_URL}/update-genre`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName, color }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error updating genre');
}


export async function deleteGenre(name) {
  const res = await fetch(`${API_URL}/delete-genre`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Error deleting genre');
  }

  return res.json();
}
