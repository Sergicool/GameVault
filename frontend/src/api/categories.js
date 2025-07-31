const API_URL = 'http://localhost:3001';

export async function addCategory(name) {
  const res = await fetch(`${API_URL}/add-category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al añadir categoría');
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Error al obtener las categorías');
  return await res.json();
}

export async function deleteCategory(id) {
  const res = await fetch(`${API_URL}/delete-category`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al eliminar categoría');
}
