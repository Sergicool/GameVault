const API_URL = 'http://localhost:3001';

export async function addYear(year) {
  const res = await fetch(`${API_URL}/add-year`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ year }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error adding year');
}

export async function getYears() {
  const res = await fetch(`${API_URL}/years`);
  if (!res.ok) throw new Error('Error obtaining years');
  return await res.json();
}

export async function deleteYear(year) {
  const res = await fetch(`${API_URL}/delete-year`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ year }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error deleting year');
}
