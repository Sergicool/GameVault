const API_URL = 'http://localhost:3001';

export async function addPlatform(name) {
  const res = await fetch(`${API_URL}/add-platform`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al añadir plataforma');
}

export async function getPlatforms() {
  const res = await fetch(`${API_URL}/platforms`);
  if (!res.ok) throw new Error('Error al obtener las plataformas');
  return await res.json();
}

export async function updatePlatform(oldName, newName) {
  const res = await fetch(`${API_URL}/update-platform`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al actualizar plataforma');
}

export async function deletePlatform(name) {
  const res = await fetch(`${API_URL}/delete-platform`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar plataforma');
}
