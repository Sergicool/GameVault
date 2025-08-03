import { useEffect, useState } from 'react';

import { getYears } from '../api/years';
import { getOrigins } from '../api/origins';
import { getCategories } from '../api/categories';
import { getSubcategories } from '../api/subcategories';
import { getGenres } from '../api/genres';
import { getGames, addGame, updateGame } from '../api/games';

import GameCard from '../components/GameCard';

function AddGame({ editingGame = null }) {

  const isEditMode = editingGame !== null;

  const [name, setName] = useState('');

  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const [years, setYears] = useState([]);
  const [year, setYear] = useState('');

  const [origins, setOrigins] = useState([]);
  const [origin, setOrigin] = useState('');

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');

  const [subcategories, setSubcategories] = useState([]);
  const [subcategory, setSubcategory] = useState('');

  const [allGames, setAllGames] = useState([]);
  const [isExtension, setIsExtension] = useState(false);
  const [extensionOf, setExtensionOf] = useState('');

  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);

  const loadAll = async () => {
    try {
      const [yearsData, originsData, categoriesData, subcategoriesData, genresData, gamesData] = await Promise.all([
        getYears(),
        getOrigins(),
        getCategories(),
        getSubcategories(),
        getGenres(),
        getGames(),
      ]);
      setYears(yearsData);
      setOrigins(originsData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setGenres(genresData);
      setAllGames(gamesData);

    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  useEffect(() => {
    if (editingGame) {
      setName(editingGame.name);
      setYear(editingGame.year || '');
      setOrigin(editingGame.origin || '');
      setCategory(editingGame.category || '');
      setSubcategory(editingGame.subcategory || '');
      setIsExtension(Boolean(editingGame.extension_of));
      setExtensionOf(editingGame.extension_of || '');
      setSelectedGenres(editingGame.genres || []);
      setImagePreview(`http://localhost:3001/game-image/${editingGame.name}`); // Preview, la imagen no es real
    }
  }, [editingGame]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !image || !year || !origin || !category || !subcategory) {
      alert('Por favor completa todos los campos obligatorios.');
      return;
    }

    const gameData = {
      name,
      image,
      year,
      origin,
      category,
      subcategory,
      extension_of: isExtension ? extensionOf : '',
      genres: selectedGenres,
    };

    try {
      if (isEditMode) {
        await updateGame(gameData);
        alert('Juego actualizado correctamente');
      } else {
        await addGame(gameData);
        alert('Juego agregado correctamente');
        // Limpiar formulario
        setName('');
        setImage(null);
        setImagePreview(null);
        setYear('');
        setOrigin('');
        setCategory('');
        setSubcategory('');
        setIsExtension(false);
        setExtensionOf('');
        setSelectedGenres([]);
      }
      await loadAll();
    } catch (err) {
      alert(err.message || 'Error al procesar juego');
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const filteredSubcategories = subcategories.filter((sub) => sub.category === category);

  const toggleGenre = (genreName) => {
    setSelectedGenres((prev) =>
      prev.includes(genreName)
        ? prev.filter((g) => g !== genreName)
        : [...prev, genreName]
    );
  };

  const gamePreview = {
    name,
    imagePreview,
    year,
    origin,
    category,
    subcategory,
    extension_of: isExtension ? extensionOf : '',
    genres: selectedGenres,
  };

  return (
    <div className='grid grid-cols-5 overflow-hidden'>
      <div className="col-span-3 mx-20 my-auto p-6 bg-gray-500 rounded-2xl shadow-md space-y-6">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold">Añadir Nuevo Juego</h2>

          {/* Nombre */}
          <div>
            <label className="block font-medium mb-1">Título del juego</label>
            <input
              type="text"
              maxLength={50}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border rounded-lg p-2"
              disabled={isEditMode}
            />
          </div>

          {/* Imagen */}
          <div>
            <label className="block font-medium mb-1">Imagen / Portada</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="mt-2 w-40 h-auto rounded-lg" />
            )}
          </div>

          {/* Año */}
          <div>
            <label className="block font-medium mb-1">Año</label>
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="w-full border rounded-lg p-2"
              disabled={years.length === 0}
            >
              <option value="">Seleccionar año</option>
              {years.map((y) => (
                <option key={y.year} value={y.year}>{y.year}</option>
              ))}
            </select>
          </div>

          {/* Origen */}
          <div>
            <label className="block font-medium mb-1">Origen</label>
            <select
              value={origin}
              onChange={(e) => setOrigin(e.target.value)}
              className="w-full border rounded-lg p-2"
              disabled={origins.length === 0}
            >
              <option value="">Seleccionar origen</option>
              {origins.map((o) => (
                <option key={o.name} value={o.name}>{o.name}</option>
              ))}
            </select>
          </div>

          {/* Categoría */}
          <div>
            <label className="block font-medium mb-1">Categoría</label>
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setSubcategory(''); // Reset subcategory
              }}
              className="w-full border rounded-lg p-2"
              disabled={categories.length === 0}
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((c) => (
                <option key={c.name} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Subcategoría */}
          <div>
            <label className="block font-medium mb-1">Subcategoría</label>
            <select
              value={subcategory}
              onChange={(e) => setSubcategory(e.target.value)}
              className="w-full border rounded-lg p-2"
              disabled={filteredSubcategories.length === 0}
            >
              <option value="">Seleccionar subcategoría</option>
              {filteredSubcategories.map((sub) => (
                <option key={sub.name} value={sub.name}>{sub.name}</option>
              ))}
            </select>
          </div>

          {/* Extension Switch */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="extension"
              checked={isExtension}
              onChange={(e) => {
                setIsExtension(e.target.checked);
                if (!e.target.checked) setExtensionOf('');
              }}
            />
            <label htmlFor="extension" className="font-medium">¿Es una extensión?</label>
          </div>

          {/* Si es extensión, selecciona juego base */}
          {isExtension && (
            <div>
              <label className="block font-medium mb-1">Juego base</label>
              <select
                value={extensionOf}
                onChange={(e) => setExtensionOf(e.target.value)}
                className="w-full border rounded-lg p-2"
              >
                <option value="">Seleccionar juego</option>
                {allGames.map((g) => (
                  <option key={g.name} value={g.name}>{g.name}</option>
                ))}
              </select>
            </div>
          )}

          {/* Géneros */}
          <div>
            <label className="block font-medium mb-2">Géneros</label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <button
                  key={genre.name}
                  type="button"
                  onClick={() => toggleGenre(genre.name)}
                  className={`px-3 py-1 rounded-full border transition
                    ${selectedGenres.includes(genre.name)
                      ? 'text-white'
                      : 'text-gray-700 border-gray-300'}
                    `}
                  style={{
                    backgroundColor: selectedGenres.includes(genre.name)
                      ? genre.color
                      : 'transparent',
                    borderColor: genre.color,
                  }}
                >
                  {genre.name}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <div>
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              onClick={handleSubmit}
            >
              {isEditMode ? 'Guardar cambios' : 'Añadir Juego'}
            </button>
          </div>
        </form>
      </div>
      {/* Preview - Derecha */}
      <div className="col-span-2 sticky top-6 self-start flex justify-center items-center min-h-screen flex-col">
        <h2 className="text-2xl font-semibold mb-4 text-center w-full">Vista previa</h2>
        <GameCard game={gamePreview} />
      </div>
    </div>
    
  );
}

export default AddGame;
