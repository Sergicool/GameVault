import { useEffect, useState } from 'react';
import { Trash2 } from 'lucide-react';
import { addYear, getYears, deleteYear } from '../api/years';
import { getOrigins, addOrigin, deleteOrigin } from '../api/origins';
import { getCategories, addCategory, deleteCategory } from '../api/categories';
import { getSubcategories, addSubcategory, deleteSubcategory } from '../api/subcategories';

function UpdateData() {
  const [years, setYears] = useState([]);
  const [newYear, setNewYear] = useState('');

  const [origins, setOrigins] = useState([]);
  const [newOrigin, setNewOrigin] = useState('');

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');

  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Load all on mount
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [yearsData, originsData, categoriesData, subcategoriesData] = await Promise.all([
        getYears(),
        getOrigins(),
        getCategories(),
        getSubcategories()
      ]);
      setYears(yearsData);
      setOrigins(originsData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  // Add handlers
  const handleAddYear = async () => {
    if (!newYear.trim()) return;
    try {
      await addYear(newYear.trim());
      setNewYear('');
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddOrigin = async () => {
    if (!newOrigin.trim()) return;
    try {
      await addOrigin(newOrigin.trim());
      setNewOrigin('');
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return;
    try {
      await addCategory(newCategory.trim());
      setNewCategory('');
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim() || !selectedCategory) return;
    try {
      await addSubcategory(newSubcategory.trim(), selectedCategory);
      setNewSubcategory('');
      setSelectedCategory('');
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  // Delete handlers
  const handleDeleteYear = async (year) => {
    try {
      await deleteYear(year);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteOrigin = async (id) => {
    try {
      await deleteOrigin(id);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      await deleteCategory(id);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSubcategory = async (id) => {
    try {
      await deleteSubcategory(id);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
    {/* Years */}
    <div className="bg-gradient-to-br from-pink-500 to-red-500 rounded-xl shadow p-4 flex flex-col justify-between h-[24rem]">
      <h2 className="text-2xl font-semibold text-center mb-4">Years</h2>
      <div className="overflow-y-auto bg-pink-900/60 rounded-xl shadow-inner p-2 backdrop-blur-sm grow 
                      [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul className="space-y-2">
          {years.map(({ year, inUse }) => (
            <li key={year} className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between shadow">
              <span className="text-gray-800 font-medium">{year}</span>
              <button
                onClick={() => handleDeleteYear(year)}
                className={`transition ${
                  inUse ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'
                }`}
                disabled={inUse}
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-center mt-4 gap-2">
        <input
          type="text"
          placeholder="New year"
          value={newYear}
          onChange={(e) => setNewYear(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <button
          onClick={handleAddYear}
          className="whitespace-nowrap bg-white text-pink-600 font-semibold px-5 py-2 rounded-lg shadow-md transition hover:bg-pink-200 active:bg-pink-300 focus:outline-none"
        >
          Add
        </button>
      </div>
    </div>

    {/* Origins */}
    <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl shadow p-4 flex flex-col justify-between h-[24rem]">
      <h2 className="text-2xl font-semibold text-center mb-4">Origins</h2>
      <div className="overflow-y-auto bg-orange-900/60 rounded-xl shadow-inner p-2 backdrop-blur-sm grow 
                      [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul className="space-y-2">
          {origins.map((origin) => (
            <li key={origin.id} className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between shadow">
              <span className="text-gray-800 font-medium">{origin.name}</span>
              <button
                onClick={() => handleDeleteOrigin(origin.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-center mt-4 gap-2">
        <input
          type="text"
          placeholder="New origin"
          value={newOrigin}
          onChange={(e) => setNewOrigin(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-orange-300"
        />
        <button
          onClick={handleAddOrigin}
          className="whitespace-nowrap bg-white text-orange-600 font-semibold px-5 py-2 rounded-lg shadow-md transition hover:bg-orange-200 active:bg-orange-300 focus:outline-none"
        >
          Add
        </button>
      </div>
    </div>

    {/* Categories */}
    <div className="bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl shadow p-4 flex flex-col justify-between h-[24rem]">
      <h2 className="text-2xl font-semibold text-center mb-4">Categories</h2>
      <div className="overflow-y-auto bg-green-900/60 rounded-xl shadow-inner p-2 backdrop-blur-sm grow 
                      [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul className="space-y-2">
          {categories.map((cat) => (
            <li key={cat.id} className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between shadow">
              <span className="text-gray-800 font-medium">{cat.name}</span>
              <button
                onClick={() => handleDeleteCategory(cat.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-center mt-4 gap-2">
        <input
          type="text"
          placeholder="New category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-green-300"
        />
        <button
          onClick={handleAddCategory}
          className="whitespace-nowrap bg-white text-green-600 font-semibold px-5 py-2 rounded-lg shadow-md transition hover:bg-green-200 active:bg-green-300 focus:outline-none"
        >
          Add
        </button>
      </div>
    </div>

    {/* Subcategories */}
    <div className="bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl shadow p-4 flex flex-col justify-between h-[24rem]">
      <h2 className="text-2xl font-semibold text-center mb-4">Subcategories</h2>
      <div className="overflow-y-auto bg-indigo-900/60 rounded-xl shadow-inner p-2 backdrop-blur-sm grow 
                      [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul className="space-y-2">
          {subcategories.map((sub) => (
            <li key={sub.id} className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between shadow">
              <span className="text-gray-800 font-medium">
                {sub.name} <span className="text-xs text-gray-500">({sub.category})</span>
              </span>
              <button
                onClick={() => handleDeleteSubcategory(sub.id)}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      </div>
      <div className="flex flex-wrap items-center mt-4 gap-2">
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          <option value="">Select category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.name}>{cat.name}</option>
          ))}
        </select>
        <input
          type="text"
          placeholder="New subcategory"
          value={newSubcategory}
          onChange={(e) => setNewSubcategory(e.target.value)}
          className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300"
        />
        <button
          onClick={handleAddSubcategory}
          className="whitespace-nowrap bg-white text-indigo-600 font-semibold px-5 py-2 rounded-lg shadow-md transition hover:bg-indigo-200 active:bg-indigo-300 focus:outline-none"
        >
          Add
        </button>
      </div>
    </div>
  </div>

  );
}

export default UpdateData;
