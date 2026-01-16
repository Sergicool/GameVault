const API_URL = 'http://localhost:3001';

export async function addCategory(name) {
  const res = await fetch(`${API_URL}/add-category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error adding category');
}

export async function getCategories() {
  const res = await fetch(`${API_URL}/categories`);
  if (!res.ok) throw new Error('Error obtaining categories');
  return await res.json();
}

export async function updateCategory(oldName, newName) {
  const res = await fetch(`${API_URL}/update-category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error updating category');
}

export async function deleteCategory(name) {
  const res = await fetch(`${API_URL}/delete-category`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error deleting category');
}
