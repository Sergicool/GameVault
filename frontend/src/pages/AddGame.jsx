import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { getYears } from '../api/years';
import { getOrigins } from '../api/origins';
import { getCategories } from '../api/categories';
import { getSubcategories } from '../api/subcategories';
import { getGenres } from '../api/genres';
import { getGames, addGame, updateGame, deleteGame } from '../api/games';

import GameCard from '../components/GameCard';

function AddGame() {

  const navigate = useNavigate();
  const location = useLocation();
  const editingGame = location.state?.editingGame || null;

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
      setSelectedGenres(editingGame.genres?.map((g) => g.name) || []);
      setImagePreview(`http://localhost:3001/game-image/${editingGame.name}`); // Preview, la imagen no es real
    }
  }, [editingGame]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || (!image && !isEditMode) || !year || !origin || !category || !subcategory ) {
      alert('Please complete all fields.');
      return;
    }

    if (selectedGenres.length === 0) {
      alert('You must select at least one gender.');
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
      genres: selectedGenres, // Se pasa solo los nombres
    };

    try {
      if (isEditMode) {
        await updateGame(gameData);
        alert('Game updated successfully');
        navigate('/Games');
      } else {
        await addGame(gameData);
        alert('Game added successfully');
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
      alert(err.message || 'Error processing game');
    }
  };

  const handleDelete = async () => {
    if (!editingGame) return;
    const confirmed = window.confirm(`Are you sure you want to delete the game? "${editingGame.name}"?`);
    if (!confirmed) return;

    try {
      await deleteGame(editingGame.name);
      alert('Successfully deleted game');
      navigate('/Games');
    } catch (err) {
      alert(err.message || 'Error when deleting game');
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
    genres: selectedGenres.map((name) =>
      genres.find((g) => g.name === name)
    ).filter(Boolean), // Se pasa el objeto completo
  };

  const getSelectStyles = (isDisabled) =>
  `w-full bg-neutral-800 text-white rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
    isDisabled ? 'border border-gray-700' : 'border border-white'
  }`;

  const getLabelStyles = (isDisabled) =>
    `block font-semibold mb-1 ${isDisabled ? 'text-gray-400' : 'text-gray-100'}`;

  return (
    <div className="flex justify-center gap-8 p-10 mt-20">
      
      {/* Formulario */}
      <div className="
        bg-gradient-to-br from-gray-800 to-gray-900
        rounded-xl shadow-lg p-6 w-full max-w-[50rem]
        border-4 border-gray-100/60
      ">
        <form onSubmit={handleSubmit}>
          <h2 className="text-2xl font-bold text-center mb-4">
            {isEditMode ? 'Edit Game' : 'New Game'}
          </h2>

          {/* Título + Imagen */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label
                className={`block font-semibold mb-1 ${
                  categories.length === 0 ? 'text-gray-400' : 'text-gray-100'
                }`}
              >
                Game Title
              </label>
              <input
                type="text"
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-neutral-800 border rounded-lg p-2"
                disabled={isEditMode}
              />
            </div>

            <div className="flex-1">
              <label className="block font-semibold mb-1">Image</label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {image ? 'Change Image' : 'Upload Image'}
                </label>
                <span className="text-sm text-gray-300 max-w-[200px]">
                  {image ? image.name : 'No image selected'}
                </span>
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Año + Categoría */}
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className={getLabelStyles(years.length === 0)}>Year</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className={getSelectStyles(years.length === 0)}
                disabled={years.length === 0}
              >
                <option value="" disabled hidden></option>
                {years.length === 0 ? (
                  <option className="bg-neutral-800 text-gray-400" disabled>
                    No hay años disponibles
                  </option>
                ) : (
                  years.map((y) => (
                    <option key={y.year} value={y.year} className="bg-neutral-800 text-white">
                      {y.year}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex-1">
              <label className={getLabelStyles(categories.length === 0)}>Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setSubcategory('');
                }}
                className={getSelectStyles(categories.length === 0)}
                disabled={categories.length === 0}
              >
                <option value="" disabled hidden></option>
                {categories.length === 0 ? (
                  <option className="bg-neutral-800 text-gray-400" disabled>
                    No hay categorías disponibles
                  </option>
                ) : (
                  categories.map((c) => (
                    <option key={c.name} value={c.name} className="bg-neutral-800 text-white">
                      {c.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Origen + Subcategoría */}
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label className={getLabelStyles(origins.length === 0)}>Origin</label>
              <select
                value={origin}
                onChange={(e) => setOrigin(e.target.value)}
                className={getSelectStyles(origins.length === 0)}
                disabled={origins.length === 0}
              >
                <option value="" disabled hidden></option>
                {origins.length === 0 ? (
                  <option className="bg-neutral-800 text-gray-400" disabled>
                    No hay orígenes disponibles
                  </option>
                ) : (
                  origins.map((o) => (
                    <option key={o.name} value={o.name} className="bg-neutral-800 text-white">
                      {o.name}
                    </option>
                  ))
                )}
              </select>
            </div>

            <div className="flex-1">
              <label className={getLabelStyles(filteredSubcategories.length === 0)}>Subcategory</label>
              <select
                value={subcategory}
                onChange={(e) => setSubcategory(e.target.value)}
                className={getSelectStyles(filteredSubcategories.length === 0)}
                disabled={filteredSubcategories.length === 0}
              >
                <option value="" disabled hidden></option>
                {filteredSubcategories.length === 0 ? (
                  <option className="bg-neutral-800 text-gray-400" disabled>
                    No hay subcategorías disponibles
                  </option>
                ) : (
                  filteredSubcategories.map((sub) => (
                    <option key={sub.name} value={sub.name} className="bg-neutral-800 text-white">
                      {sub.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          </div>

          {/* Extension Switch */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-gray-100 font-semibold">
              Is part of another game?
            </span>

            {/* Switch */}
            <div className="relative w-12 h-6">
              <input
                type="checkbox"
                checked={isExtension}
                onChange={(e) => {
                  setIsExtension(e.target.checked);
                  if (!e.target.checked) setExtensionOf('');
                }}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                aria-label="Toggle extension"
              />
              <div
                className={`w-full h-full flex items-center rounded-full p-1 transition-colors duration-300 ${
                  isExtension ? 'bg-blue-600' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${
                    isExtension ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
          </div>


          {/* Juego base */}
          {isExtension && (
            <div className="mt-4">
              <label className={getLabelStyles(allGames.length === 0)}>Base Game</label>
              <select
                value={extensionOf}
                onChange={(e) => setExtensionOf(e.target.value)}
                className={getSelectStyles(allGames.length === 0)}
                disabled={allGames.length === 0}
              >
                {allGames.length === 0 ? (
                  <option className="bg-neutral-800 text-gray-400" disabled></option>
                ) : (
                  allGames.map((g) => (
                    <option key={g.name} value={g.name} className="bg-neutral-800 text-white">
                      {g.name}
                    </option>
                  ))
                )}
              </select>
            </div>
          )}

          {/* Géneros */}
          <div className="mt-4">
            <label className="block font-semibold mb-2 text-gray-100">Genres</label>
            <div className="bg-gray-800 rounded-xl p-4 border border-gray-600 inset-shadow-sm inset-shadow-gray-900">
              <div className="flex flex-wrap gap-2">
                {genres.map((genre) => (
                  <button
                    key={genre.name}
                    type="button"
                    onClick={() => toggleGenre(genre.name)}
                    className={`px-3 py-1 rounded-full border transition
                      ${selectedGenres.includes(genre.name)
                        ? 'text-white'
                        : 'text-gray-300 border-gray-400'}
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
          </div>

          {/* Submit */}
          <div className="mt-6 flex gap-4">
            <button
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              {isEditMode ? 'Save Changes' : 'Add Game'}
            </button>

            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
              >
                Delete Game
              </button>
            )}
          </div>

        </form>
      </div>

      {/* GameCard */}
      <div className="flex items-center justify-center">
        <GameCard game={gamePreview} />
      </div>
    </div>
  );

}

export default AddGame;
