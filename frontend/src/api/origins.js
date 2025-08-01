const API_URL = 'http://localhost:3001';

export async function addOrigin(name) {
  const res = await fetch(`${API_URL}/add-origin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al añadir origen');
}

export async function getOrigins() {
  const res = await fetch(`${API_URL}/origins`);
  if (!res.ok) throw new Error('Error al obtener los orígenes');
  return await res.json();
}

export async function updateOrigin(oldName, newName) {
  const res = await fetch(`${API_URL}/update-origin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al actualizar origen');
}

export async function deleteOrigin(name) {
  const res = await fetch(`${API_URL}/delete-origin`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar origen');
}
