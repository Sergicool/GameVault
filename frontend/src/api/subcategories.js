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

export async function getSubcategories() {
  const res = await fetch(`${API_URL}/subcategories`);
  if (!res.ok) throw new Error('Error al obtener subcategorías');
  return await res.json();
}

export async function deleteSubcategory(name) {
  const res = await fetch(`${API_URL}/delete-subcategory`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar subcategoría');
}
