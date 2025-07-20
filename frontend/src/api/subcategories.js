const API_URL = 'http://localhost:3001';

export async function addSubcategory(name, category) {
  const res = await fetch(`${API_URL}/add-subcategory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, category }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al añadir subcategoría');
}
