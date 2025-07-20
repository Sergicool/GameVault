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
