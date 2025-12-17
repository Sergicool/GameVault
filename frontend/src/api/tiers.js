const API_URL = 'http://localhost:3001';

export async function getTiers() {
  const res = await fetch(`${API_URL}/tiers`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al obtener tiers');
  return data;
}

export async function addTier(name, color, position) {
  const res = await fetch(`${API_URL}/add-tier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, color, position }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al añadir tier');
}

export async function updateTier(oldName, newName, color) {
  const res = await fetch(`${API_URL}/update-tier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ oldName, newName, color }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al actualizar tier');
  return data;
}


export async function moveTierUp(name) {
  const res = await fetch(`${API_URL}/move-tier-up`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al subir tier');
}

export async function moveTierDown(name) {
  const res = await fetch(`${API_URL}/move-tier-down`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al bajar tier');
}

export async function deleteTier(name) {
  const res = await fetch(`${API_URL}/delete-tier`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Error al borrar tier');
}
