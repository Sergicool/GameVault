import { useState } from 'react';

function UpdateData() {
  const [year, setYear] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const parsedYear = parseInt(year);
    if (isNaN(parsedYear) || parsedYear < 2010 || parsedYear > 2100) {
      setStatus('❌ Año inválido (2010–2100)');
      return;
    }

    try {
      const res = await fetch('http://localhost:3001/add-year', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ year: parsedYear }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus('✅ Año agregado correctamente');
        setYear('');
      } else {
        setStatus(`❌ ${data.error}`);
      }
    } catch (err) {
      setStatus(`❌ ${err.message}`);
    }
  };

  return (
    <div className="max-w-sm mx-auto mt-8 p-4 border rounded-2xl shadow bg-white">
      <h2 className="text-xl font-semibold mb-4">Agregar Año</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <input
          type="number"
          className="border p-2 rounded"
          placeholder="Ej: 2024"
          value={year}
          onChange={(e) => setYear(e.target.value)}
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Agregar
        </button>
      </form>
      {status && <p className="mt-3 text-sm">{status}</p>}
    </div>
  );
}

export default UpdateData;
