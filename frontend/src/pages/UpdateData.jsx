import { useState } from 'react';

function UpdateData() {
  const [name, setName] = useState('');
  const [color, setColor] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('http://localhost:3001/add-genre', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, color })
    });
    const data = await res.json();
    if (data.success) {
      setStatus('Género agregado correctamente');
    } else {
      setStatus('Error: ' + data.error);
    }
  };

  return (
    <div>
      <h2>Agregar Género</h2>
      <form onSubmit={handleSubmit}>
        <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} />
        <input placeholder="Color" value={color} onChange={(e) => setColor(e.target.value)} />
        <button type="submit">Agregar</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default UpdateData;
