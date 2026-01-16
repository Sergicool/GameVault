import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

import { getYears } from '../api/years';
import { getOrigins } from '../api/origins';
import { getPlatforms } from '../api/platforms';
import { getCategories } from '../api/categories';
import { getSubcategories } from '../api/subcategories';
import { getGenres } from '../api/genres';
import { getGames, addGame, updateGame, deleteGame } from '../api/games';

import GameCard from '../components/GameCard';

/**
 * Determina si un color HEX es oscuro
 */
function isColorDark(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
}

function CustomSelect({ label, value, onChange, options, disabled = false, placeholder = "Choose an option" }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Cerrar al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative w-full">
      {/* LABEL */}
      <label className={`block font-semibold mb-1 ${disabled ? 'text-gray-400' : 'text-indigo-100'}`}>
        {label}
      </label>

      {/* BOTÓN SELECT */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen(!open)}
        className={`
          w-full rounded-lg border border-indigo-500
          bg-indigo-950 py-2 px-4 text-left
          text-indigo-100 shadow-md
          transition-all
          hover:border-indigo-300
          focus:ring-2 focus:ring-indigo-300 focus:outline-none
          ${disabled ? 'opacity-50 cursor-not-allowed text-gray-400' : ''}
        `}
      >
        {value || placeholder}
      </button>

      {/* DROPDOWN */}
      {open && !disabled && (
        <div className="
          absolute z-50 mt-2 w-full
          bg-indigo-950 border-2 border-indigo-300
          rounded-lg shadow-xl
          max-h-60 overflow-y-auto
        ">
          {options.length === 0 ? (
            <div className="px-4 py-2 text-gray-400">
              No options available
            </div>
          ) : (
            [...options]
              .sort((a, b) => {
                // Si ambos son números, comparar numéricamente
                if (!isNaN(a.label) && !isNaN(b.label)) {
                  return Number(b.label) - Number(a.label);
                }
                // Si no, comparar alfabéticamente
                return a.label.toString().localeCompare(b.label.toString());
              })
              .map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className="
                    w-full text-left px-4 py-2
                    text-indigo-100
                    hover:bg-indigo-600
                    active:bg-indigo-700
                    transition
                  "
                >
                  {opt.label}
                </button>
              ))
          )}
        </div>
      )}
    </div>
  );
}

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
  
  const [platforms, setPlatforms] = useState([]);
  const [platform, setPlatform] = useState('');

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
      const [yearsData, originsData, platformsData, categoriesData, subcategoriesData, genresData, gamesData] = await Promise.all([
        getYears(),
        getOrigins(),
        getPlatforms(),
        getCategories(),
        getSubcategories(),
        getGenres(),
        getGames(),
      ]);
      setYears(yearsData);
      setOrigins(originsData);
      setPlatforms(platformsData);
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
      setPlatform(editingGame.platform || '');
      setCategory(editingGame.category || '');
      setSubcategory(editingGame.subcategory || '');
      setIsExtension(Boolean(editingGame.extension_of));
      setExtensionOf(editingGame.extension_of || '');
      setSelectedGenres(editingGame.genres?.map(g => g.name) || []);
      setImagePreview(editingGame.imagePreview || `http://localhost:3001/game-image/${encodeURIComponent(editingGame.name)}`);
    }
  }, [editingGame]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || (!image && !isEditMode) || !year || !origin || !platform || !category || !subcategory ) {
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
      platform,
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
        setPlatform('');
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
    platform,
    category,
    subcategory,
    extension_of: isExtension ? extensionOf : '',
    genres: selectedGenres.map((name) =>
      genres.find((g) => g.name === name)
    ).filter(Boolean), // Se pasa el objeto completo
  };

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold text-center text-indigo-100 mb-4">
        {isEditMode ? 'Edit Game' : 'Add New Game'}
      </h1>

      <div className="
        bg-indigo-900/80
        rounded-xl shadow-lg p-6
        border-2 border-indigo-400
        rounded-b-lg
        grid grid-cols-1 lg:grid-cols-2 gap-8
      ">
        {/* FORMULARIO */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* TÍTULO + IMAGEN INPUT */}
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <label
                className={`block font-semibold mb-1 ${
                  isEditMode ? 'text-gray-400' : 'text-indigo-100'
                }`}
              >
                Game Title
              </label>

              <div className="relative">
                <input
                  type="text"
                  maxLength={80}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isEditMode}
                  className={`
                    w-full
                    rounded-lg border border-indigo-500
                    bg-indigo-950
                    py-2 px-4
                    text-indigo-100 placeholder-indigo-300
                    shadow-md
                    focus:ring-2 focus:ring-indigo-300 focus:outline-none
                    ${isEditMode ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                  placeholder="Title"
                />
              </div>
            </div>

            <div className="flex-1">
              <label className="block font-semibold mb-1 text-indigo-100">Image</label>
              <div className="flex items-center gap-4">
                <label
                  htmlFor="image-upload"
                  className="cursor-pointer bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition"
                >
                  {image ? 'Change Image' : 'Upload Image'}
                </label>
                <span className="text-sm text-indigo-300 max-w-[200px]">
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

          {/* AÑO + ORIGEN + PLATAFORMA*/}
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <CustomSelect
                label="Year"
                value={year}
                onChange={setYear}
                disabled={years.length === 0}
                options={years.map(y => ({
                  value: y.year,
                  label: y.year,
                }))}
              />
            </div>
            
            <div className="flex-1">
              <CustomSelect
                label="Origin"
                value={origin}
                onChange={setOrigin}
                disabled={origins.length === 0}
                options={origins.map(o => ({
                  value: o.name,
                  label: o.name,
                }))}
              />
            </div>

            <div className="flex-1">
              <CustomSelect
                label="Platform"
                value={platform}
                onChange={setPlatform}
                disabled={platforms.length === 0}
                options={platforms.map(p => ({
                  value: p.name,
                  label: p.name,
                }))}
              />
            </div>
          </div>

          {/* CATEGORÍA + SUBCATEGORÍA */}
          <div className="mt-4 flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <CustomSelect
                label="Category"
                value={category}
                onChange={(val) => {
                  setCategory(val);
                  setSubcategory('');
                }}
                disabled={categories.length === 0}
                options={categories.map(c => ({
                  value: c.name,
                  label: c.name,
                }))}
              />
            </div>

            <div className="flex-1">
              <CustomSelect
                label="Subcategory"
                value={subcategory}
                onChange={setSubcategory}
                disabled={filteredSubcategories.length === 0}
                options={filteredSubcategories.map(sub => ({
                  value: sub.name,
                  label: sub.name,
                }))}
              />
            </div>
          </div>

          {/* SWITCH EXTENSION */}
          <div className="mt-6 flex items-center gap-3">
            <span className="text-indigo-100 font-semibold">
              Is part of another game?
            </span>

            <div className="relative w-12 h-6">
              <input
                type="checkbox"
                checked={isExtension}
                onChange={(e) => {
                  setIsExtension(e.target.checked);
                  if (!e.target.checked) setExtensionOf('');
                }}
                className="absolute w-full h-full opacity-0 cursor-pointer z-10"
              />

              <div
                className={`
                  w-full h-full flex items-center rounded-full p-1
                  border border-indigo-500
                  transition-colors duration-300
                  ${isExtension ? 'bg-indigo-600 ring-2 ring-indigo-300' : 'bg-indigo-950'}
                `}
              >
                <div
                  className={`
                    bg-white w-4 h-4 rounded-full shadow-md
                    transform transition-transform duration-300
                    ${isExtension ? 'translate-x-6' : 'translate-x-0'}
                  `}
                />
              </div>
            </div>
          </div>


          {/* JUEGO BASE */}
          {isExtension && (
            <CustomSelect
              label="Base Game"
              value={extensionOf}
              onChange={setExtensionOf}
              disabled={allGames.length === 0}
              options={allGames
                .filter((g) => !isEditMode || g.name !== editingGame.name)
                .map(g => ({
                  value: g.name,
                  label: g.name,
                }))
              }
            />
          )}
        </form>

        {/* IMAGEN PREVIEW DERECHA */}
        <div className="flex items-center justify-center">
          <GameCard game={gamePreview} />
        </div>

        {/* GENEROS */}
        <div className="lg:col-span-2">
          <label className="block font-semibold mb-2 text-gray-100">Genres</label>
          <div className="bg-slate-950/50 rounded-xl p-4 border-2 border-indigo-500 inset-shadow-sm inset-shadow-gray-900">
            <div className="flex flex-wrap gap-2 justify-center">
              {genres.map((genre) => {
                const isSelected = selectedGenres.includes(genre.name);
                return (
                  <button
                    key={genre.name}
                    type="button"
                    onClick={() => toggleGenre(genre.name)}
                    className={`px-3 py-1 rounded-full border transition
                      ${isSelected
                        ? '' // texto se definirá en style
                        : 'text-gray-300 border-gray-400'
                      }
                    `}
                    style={{
                      backgroundColor: isSelected ? genre.color : 'transparent',
                      borderColor: genre.color,
                      color: isSelected
                        ? isColorDark(genre.color)
                          ? 'white' // fondo oscuro → texto blanco
                          : 'black' // fondo claro → texto negro
                        : undefined, // no seleccionado → mantiene clase de Tailwind
                    }}
                  >
                    {genre.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* BOTONES */}
        <div className="lg:col-span-2 flex justify-center gap-6">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 active:bg-blue-800 transition"
          >
            {isEditMode ? 'Save Changes' : 'Add Game'}
          </button>

          {isEditMode && (
            <button
              type="button"
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 active:bg-red-800 transition"
            >
              Delete Game
            </button>
          )}
        </div>

      </div>
    </div>
  );


}

export default AddGame;
