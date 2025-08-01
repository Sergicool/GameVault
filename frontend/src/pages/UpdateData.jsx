import { useEffect, useState } from 'react';

import { Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { HexColorPicker } from 'react-colorful';

import { addYear, getYears, deleteYear } from '../api/years';
import { getOrigins, addOrigin, updateOrigin, deleteOrigin } from '../api/origins';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../api/categories';
import { getSubcategories, addSubcategory, updateSubcategory, deleteSubcategory } from '../api/subcategories';
import { getTiers, addTier, deleteTier, moveTierUp, moveTierDown } from '../api/tiers';

function UpdateData() {
  const [years, setYears] = useState([]);
  const [newYear, setNewYear] = useState('');

  const [origins, setOrigins] = useState([]);
  const [newOrigin, setNewOrigin] = useState('');
  const [editingOrigin, setEditingOrigin] = useState(null);
  const [editedOrigin, setEditedOrigin] = useState('');

  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);
  const [editedCategory, setEditedCategory] = useState('');

  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState('');
  const [editingSubcategory, setEditingSubcategory] = useState(null);
  const [editedSubcategory, setEditedSubcategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  const [tiers, setTiers] = useState([]);
  const [newTierName, setNewTierName] = useState('');
  const [newTierColor, setNewTierColor] = useState('#a855f7');

  // Load all on mount
  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    try {
      const [yearsData, originsData, categoriesData, subcategoriesData, tiersData] = await Promise.all([
        getYears(),
        getOrigins(),
        getCategories(),
        getSubcategories(),
        getTiers()
      ]);
      setYears(yearsData);
      setOrigins(originsData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setTiers(tiersData);

      if (categoriesData.length > 0 && !selectedCategory) {
        setSelectedCategory(categoriesData[0].name);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
    }
  };

  // Add handlers
  const handleAddTier = async () => {
    if (!newTierName.trim()) return;
    try {
      const position = tiers.length;
      await addTier(newTierName.trim(), newTierColor, position);
      setNewTierName('');
      setNewTierColor('#a855f7');
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

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
      await loadAll();
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

  // Update handlers
  const handleMoveUp = async (index) => {
    if (index === 0) return;
    try {
      await moveTierUp(tiers[index].name);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleMoveDown = async (index) => {
    if (index === tiers.length - 1) return;
    try {
      await moveTierDown(tiers[index].name);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateOrigin = async (oldName, newName) => {
    if (!newName.trim() || newName === oldName) {
      setEditingOrigin(null);
      return;
    }
    try {
      await updateOrigin(oldName, newName.trim());
      setEditingOrigin(null);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateCategory = async (oldName, newName) => {
    if (!newName.trim() || newName === oldName) {
      setEditingCategory(null);
      return;
    }
    try {
      await updateCategory(oldName, newName.trim());
      setEditingCategory(null);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateSubcategory = async (oldName, newName) => {
    if (!newName.trim() || newName === oldName) {
      setEditingSubcategory(null);
      return;
    }
    try {
      // Asegurate que tengas esta función en api/subcategories.js
      await updateSubcategory(oldName, newName.trim());
      setEditingSubcategory(null);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  // Delete handlers
  const handleDeleteTier = async (tier) => {
    try {
      await deleteTier(tier.name);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteYear = async (year) => {
    try {
      await deleteYear(year);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteOrigin = async (origin) => {
    try {
      await deleteOrigin(origin);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteCategory = async (category) => {
    try {
      await deleteCategory(category);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDeleteSubcategory = async (subcategory) => {
    try {
      await deleteSubcategory(subcategory);
      loadAll();
    } catch (e) {
      console.error(e);
    }
  };

  return (
  <div className="grid md:grid-cols-10 gap-6 p-6">
    
    <div className="col-span-3">
      
      <div className="bg-gradient-to-br from-teal-400 to-cyan-700 rounded-xl shadow p-4 flex flex-col justify-between h-[49.5rem]">
        <h2 className="text-2xl font-semibold text-center mb-4">Genres</h2>
      </div>

    </div>
  
    {/* Tiers */}
    <div className="col-span-2 bg-gradient-to-br from-fuchsia-400 to-purple-700 rounded-xl shadow p-4 flex flex-col h-[49.5rem]">
      <h2 className="text-2xl font-semibold text-center mb-4">Tiers</h2>

      <div className="overflow-y-auto bg-purple-900/60 rounded-xl shadow-inner p-2 backdrop-blur-sm grow
                      [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <ul className="space-y-2">
          {tiers.map((tier, index) => (
            <li
              key={tier.name}
              className="bg-gray-50 rounded-lg text-gray-800 px-3 py-2 flex items-center justify-between shadow"
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full border border-gray-300"
                  style={{ backgroundColor: tier.color }}
                  title={tier.color}
                />
                <span className="font-medium">{tier.name}</span>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <button
                  onClick={() => handleMoveUp(index)}
                  disabled={index === 0}
                  className={`text-gray-600 transition ${
                    index === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-900'
                  }`}
                  aria-label="Move up"
                >
                  <ArrowUp size={18} />
                </button>

                <button
                  onClick={() => handleMoveDown(index)}
                  disabled={index === tiers.length - 1}
                  className={`text-gray-600 transition ${
                    index === tiers.length - 1 ? 'opacity-50 cursor-not-allowed' : 'hover:text-gray-900'
                  }`}
                  aria-label="Move down"
                >
                  <ArrowDown size={18} />
                </button>

                <button
                  onClick={() => handleDeleteTier(tier)}
                  className="text-red-500 hover:text-red-700 transition"
                  aria-label="Delete tier"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-4">
        <div className="flex justify-center">
          <HexColorPicker
            color={newTierColor}
            onChange={setNewTierColor}
            className="mb-4 rounded"
          />
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New tier name"
            value={newTierName}
            onChange={(e) => setNewTierName(e.target.value)}
            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <button
            onClick={handleAddTier}
            className="bg-white text-purple-700 font-semibold px-5 py-2 rounded-lg shadow-md transition hover:bg-purple-200 active:bg-purple-300 focus:outline-none"
          >
            Add
          </button>
        </div>
      </div>
    </div>

    <div className="col-span-5 grid md:grid-cols-6 gap-6">

      {/* Years */}
      <div className="col-span-2 bg-gradient-to-br from-pink-400 to-red-700 rounded-xl shadow p-4 flex flex-col justify-between h-[24rem]">
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
      <div className="col-span-2 bg-gradient-to-br from-amber-400 to-orange-700 rounded-xl shadow p-4 flex flex-col justify-between h-[24rem]">
        <h2 className="text-2xl font-semibold text-center mb-4">Origins</h2>
        <div className="overflow-y-auto bg-orange-900/60 rounded-xl shadow-inner p-2 backdrop-blur-sm grow 
                        [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <ul className="space-y-2">
            {origins.map((origin) => (
              <li key={origin.name} className="bg-gray-50 rounded-lg text-gray-800 px-3 py-2 flex items-center justify-between shadow">
                {editingOrigin === origin.name ? (
                  <input
                    value={editedOrigin}
                    onChange={(e) => setEditedOrigin(e.target.value)}
                    onBlur={() => handleUpdateOrigin(origin.name, editedOrigin)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateOrigin(origin.name, editedOrigin);
                      if (e.key === 'Escape') setEditingOrigin(null);
                    }}
                    autoFocus
                    className="flex-1 mr-2 px-2 py-1 rounded border border-gray-300"
                  />
                ) : (
                  <span className="text-gray-800 font-medium flex-1">{origin.name}</span>
                )}

                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => {
                      setEditingOrigin(origin.name);
                      setEditedOrigin(origin.name);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDeleteOrigin(origin.name)}
                    className={`transition ${
                      origin.inUse ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'
                    }`}
                    disabled={origin.inUse}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
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
      <div className="col-span-2 bg-gradient-to-br from-emerald-400 to-green-700 rounded-xl shadow p-4 flex flex-col justify-between h-[24rem]">
        <h2 className="text-2xl font-semibold text-center mb-4">Categories</h2>
        <div className="overflow-y-auto bg-green-900/60 rounded-xl shadow-inner p-2 backdrop-blur-sm grow 
                        [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <ul className="space-y-2">
            {categories.map((category) => (
              <li key={category.name} className="bg-gray-50 text-gray-800 rounded-lg px-3 py-2 flex items-center justify-between shadow">
                {editingCategory === category.name ? (
                  <input
                    value={editedCategory}
                    onChange={(e) => setEditedCategory(e.target.value)}
                    onBlur={() => handleUpdateCategory(category.name, editedCategory)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateCategory(category.name, editedCategory);
                      if (e.key === 'Escape') setEditingCategory(null);
                    }}
                    autoFocus
                    className="flex-1 mr-2 px-2 py-1 rounded border border-gray-300"
                  />
                ) : (
                  <span className="text-gray-800 font-medium flex-1">{category.name}</span>
                )}

                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => {
                      setEditingCategory(category.name);
                      setEditedCategory(category.name);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDeleteCategory(category.name)}
                    className={`transition ${
                      category.inUse ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'
                    }`}
                    disabled={category.inUse}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
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
      <div className="col-span-6 bg-gradient-to-br from-blue-400 to-indigo-700 rounded-xl shadow p-4 flex flex-col justify-between h-[24rem]">
        <h2 className="text-2xl font-semibold text-center mb-4">Subcategories</h2>
        <div className="overflow-y-auto bg-indigo-900/60 rounded-xl shadow-inner p-2 backdrop-blur-sm grow 
                        [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <ul className="space-y-2">
            {subcategories.map((subcategory) => (
              <li key={subcategory.name} className="bg-gray-50 text-gray-800 rounded-lg px-3 py-2 flex items-center justify-between shadow">
                {editingSubcategory === subcategory.name ? (
                  <input
                    value={editedSubcategory}
                    onChange={(e) => setEditedSubcategory(e.target.value)}
                    onBlur={() => handleUpdateSubcategory(subcategory.name, editedSubcategory)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleUpdateSubcategory(subcategory.name, editedSubcategory);
                      if (e.key === 'Escape') setEditingSubcategory(null);
                    }}
                    autoFocus
                    className="flex-1 mr-2 px-2 py-1 rounded border border-gray-300"
                  />
                ) : (
                  <span className="text-gray-800 font-medium flex-1">
                    {subcategory.name} <span className="text-xs text-gray-500">({subcategory.category})</span>
                  </span>
                )}

                <div className="flex items-center gap-2 ml-2">
                  <button
                    onClick={() => {
                      setEditingSubcategory(subcategory.name);
                      setEditedSubcategory(subcategory.name);
                    }}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <Pencil size={18} />
                  </button>

                  <button
                    onClick={() => handleDeleteSubcategory(subcategory.name)}
                    className={`transition ${
                      subcategory.inUse ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'
                    }`}
                    disabled={subcategory.inUse}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-wrap items-center mt-4 gap-2">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            disabled={categories.length === 0}
            className="flex-1 min-w-0 px-3 py-2 rounded-lg bg-white text-gray-800 shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-gray-200 disabled:text-gray-500"
          >
            {categories.length === 0 ? (
              <option>No category</option>
            ) : (
              categories.map((category) => (
                <option key={category.name} value={category.name}>
                  {category.name}
                </option>
              ))
            )}
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

  </div>
  );
}

export default UpdateData;
