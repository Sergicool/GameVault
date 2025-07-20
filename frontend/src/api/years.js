const API_URL = 'http://localhost:3001';

export async function addYear(year) {
  const res = await fetch(`${API_URL}/add-year`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ year }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al añadir año');
}
