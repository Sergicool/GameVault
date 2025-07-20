const API_URL = 'http://localhost:3001';

export async function addTier(name, color, position) {
  const res = await fetch(`${API_URL}/add-tier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color, position }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al añadir tier');
}
