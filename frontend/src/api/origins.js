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

export async function deleteOrigin(id) {
  const res = await fetch(`${API_URL}/delete-origin`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar origen');
}
