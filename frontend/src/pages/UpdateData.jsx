import { useEffect, useState } from 'react';
import { getGenres, addGenre, updateGenre, deleteGenre } from '../api/genres';
import { getTiers, addTier, updateTier, deleteTier, moveTierUp, moveTierDown } from '../api/tiers';
import { getYears, addYear, deleteYear } from '../api/years';
import { getOrigins, addOrigin, updateOrigin, deleteOrigin } from '../api/origins';
import { getCategories, addCategory, updateCategory, deleteCategory } from '../api/categories';
import { getSubcategories, addSubcategory, updateSubcategory, deleteSubcategory } from '../api/subcategories';
import { getPlatforms, addPlatform, updatePlatform, deletePlatform } from '../api/platforms';

import { useGenreModal } from '../components/update_data/genres/useGenreModal';
import GenreList from '../components/update_data/genres/GenreList';
import GenreModal from '../components/update_data/genres/GenreModal';

import { useTierModal } from '../components/update_data/tiers/useTierModal';
import TierList from '../components/update_data/tiers/TierList';
import TierModal from '../components/update_data/tiers/TierModal';

import { useYearModal } from '../components/update_data/years/useYearModal';
import YearList from '../components/update_data/years/YearList';
import YearModal from '../components/update_data/years/YearModal';

import { useOriginModal } from '../components/update_data/origins/useOriginModal';
import OriginList from '../components/update_data/origins/OriginList';
import OriginModal from '../components/update_data/origins/OriginModal';

import { useCategoryModal } from '../components/update_data/categories/useCategoryModal';
import CategoryList from '../components/update_data/categories/CategoryList';
import CategoryModal from '../components/update_data/categories/CategoryModal';

import { useSubcategoryModal } from '../components/update_data/subcategories/useSubcategoryModal';
import SubcategoryList from '../components/update_data/subcategories/SubcategoryList';
import SubcategoryModal from '../components/update_data/subcategories/SubcategoryModal';

import { usePlatformModal } from '../components/update_data/platforms/usePlatformModal';
import PlatformList from '../components/update_data/platforms/PlatformList';
import PlatformModal from '../components/update_data/platforms/PlatformModal';

export default function UpdateData() {
  // Modals y estados
  const [genres, setGenres] = useState([]);
  const genreModal = useGenreModal('#0ea5e9');

  const [tiers, setTiers] = useState([]);
  const tierModal = useTierModal('#a855f7');

  const [years, setYears] = useState([]);
  const yearModal = useYearModal();

  const [origins, setOrigins] = useState([]);
  const originModal = useOriginModal('#f59e0b');

  const [categories, setCategories] = useState([]);
  const categoryModal = useCategoryModal();

  const [subcategories, setSubcategories] = useState([]);
  const subcategoryModal = useSubcategoryModal();

  const [platforms, setPlatforms] = useState([]);
  const platformModal = usePlatformModal();

  useEffect(() => {
    loadAll();
  }, []);

  const loadAll = async () => {
    setGenres(await getGenres());
    setTiers(await getTiers());
    setYears(await getYears());
    setOrigins(await getOrigins());
    setCategories(await getCategories());
    setSubcategories(await getSubcategories());
    setPlatforms(await getPlatforms());
  };

  // Save functions
  const saveGenre = async () => {
    const { name, color, originalName } = genreModal.form;
    if (!name.trim()) return;
    if (originalName) await updateGenre(originalName, name, color);
    else await addGenre(name, color);
    genreModal.close();
    loadAll();
  };

  const saveTier = async () => {
    const { name, color, originalName } = tierModal.value;
    if (!name.trim()) return;
    if (originalName) await updateTier(originalName, name, color);
    else await addTier(name, color, tiers.length);
    tierModal.setOpen(false);
    loadAll();
  };

  const saveYear = async () => {
    const { year, originalName } = yearModal.value;
    if (!year.trim()) return;
    if (!originalName) await addYear(year);
    yearModal.close();
    loadAll();
  };

  const saveOrigin = async () => {
    const { name, originalName } = originModal.value;
    if (!name.trim()) return;
    if (originalName) await updateOrigin(originalName, name);
    else await addOrigin(name);
    originModal.close();
    loadAll();
  };

  const saveCategory = async () => {
    const { name, originalName } = categoryModal.value;
    if (!name.trim()) return;
    if (originalName) await updateCategory(originalName, name);
    else await addCategory(name);
    categoryModal.close();
    loadAll();
  };

  const saveSubcategory = async () => {
    const { name, category, originalName } = subcategoryModal.value;
    if (!name.trim() || !category) return;
    if (originalName) await updateSubcategory(originalName, name, category);
    else await addSubcategory(name, category);
    subcategoryModal.close();
    loadAll();
  };

  const savePlatform = async () => {
    const { name, originalName } = platformModal.value;
    if (!name.trim()) return;
    if (originalName) await updatePlatform(originalName, name);
    else await addPlatform(name);
    platformModal.close();
    loadAll();
  };

  // Delete handlers
  const handleDeleteYear = async (year) => { await deleteYear(year); loadAll(); };
  const handleDeleteOrigin = async (name) => { await deleteOrigin(name); loadAll(); };
  const handleDeleteCategory = async (name) => { await deleteCategory(name); loadAll(); };
  const handleDeleteSubcategory = async (name) => { await deleteSubcategory(name); loadAll(); };
  const handleDeletePlatform = async (name) => { await deletePlatform(name); loadAll(); };
  const handleDeleteGenre = async (name) => { await deleteGenre(name); loadAll(); };
  const handleDeleteTier = async (name) => { await deleteTier(name); loadAll(); };

  return (
    <div className="h-[calc(100vh-4rem)] grid grid-cols-4 grid-rows-2 gap-6 p-6">

      {/* Genres */}
      <div className="col-span-1 row-span-2 bg-gradient-to-br from-teal-400 to-cyan-700 rounded-xl shadow-lg p-4 flex flex-col">
        <h2 className="text-2xl font-bold text-white text-center mb-4">Genres</h2>
        <div className="flex-1 bg-cyan-900/60 rounded-xl p-2 shadow-inner overflow-y-auto
                        [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <GenreList
            genres={genres}
            onEdit={genreModal.openEdit}
            onDelete={async (name) => { await deleteGenre(name); loadGenres(); }}
          />
        </div>
        <button
          onClick={genreModal.openCreate}
          className="mt-2 sm:mt-4 bg-white text-cyan-700 font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg
                    text-sm sm:text-base shadow transition hover:bg-cyan-100 active:bg-cyan-200"
        >
          Add genre
        </button>
      </div>

      {/* 3x2 */}
      <div className="col-span-3 grid grid-cols-3 grid-rows-2 gap-6 h-[calc(100vh-7rem)]">

        {/* Tiers */}
        <div className="bg-gradient-to-br from-fuchsia-400 to-purple-700 rounded-xl shadow-lg p-4 flex flex-col min-h-0">
          <h2 className="text-2xl font-bold text-white text-center mb-4">Tiers</h2>
          <div className="flex-1 bg-purple-900/60 rounded-xl p-2 shadow-inner overflow-y-auto min-h-0
                          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <TierList
              tiers={tiers}
              onEdit={tierModal.openEdit}
              onDelete={async (name) => { await deleteTier(name); loadTiers(); }}
              onMoveUp={async (index) => { if(index===0) return; await moveTierUp(tiers[index].name); loadTiers(); }}
              onMoveDown={async (index) => { if(index===tiers.length-1) return; await moveTierDown(tiers[index].name); loadTiers(); }}
            />
          </div>
          <button
            onClick={tierModal.openCreate}
            className="mt-2 sm:mt-4 bg-white text-purple-700 font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg
                      text-sm sm:text-base shadow transition hover:bg-purple-100 active:bg-purple-200"
          >
            Add tier
          </button>
        </div>

        {/* Years */}
        <div className="bg-gradient-to-br from-pink-400 to-red-700 rounded-xl shadow-lg p-4 flex flex-col min-h-0">
          <h2 className="text-2xl font-bold text-white text-center mb-4">Years</h2>
          <div className="flex-1 bg-pink-900/60 rounded-xl p-2 shadow-inner overflow-y-auto min-h-0
                          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <YearList
              years={years}
              onEdit={yearModal.openEdit}
              onDelete={handleDeleteYear}
            />
          </div>
          <button
            onClick={yearModal.openCreate}
            className="mt-2 sm:mt-4 bg-white text-pink-700 font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg
                      text-sm sm:text-base shadow transition hover:bg-pink-100 active:bg-pink-200"
          >
            Add year
          </button>
        </div>

        {/* Origins */}
        <div className="bg-gradient-to-br from-amber-400 to-orange-700 rounded-xl shadow-lg p-4 flex flex-col">
          <h2 className="text-2xl font-bold text-center mb-4">Origins</h2>
          <div className="flex-1 bg-orange-900/60 rounded-xl p-2 shadow-inner overflow-y-auto min-h-0
                          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <OriginList
              origins={origins}
              onEdit={originModal.openEdit}
              onDelete={handleDeleteOrigin}
            />
          </div>
          <button
            onClick={originModal.openCreate}
            className="mt-2 sm:mt-4 bg-white text-orange-600 font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg shadow transition hover:bg-orange-200 active:bg-orange-300"
          >
            Add origin
          </button>
        </div>

        {/* Categories */}
        <div className="bg-gradient-to-br from-emerald-400 to-green-700 rounded-xl shadow-lg p-4 flex flex-col">
          <h2 className="text-2xl font-bold text-center mb-4">Categories</h2>
          <div className="flex-1 bg-green-900/60 rounded-xl p-2 shadow-inner overflow-y-auto min-h-0
                          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <CategoryList
              categories={categories}
              onEdit={categoryModal.openEdit}
              onDelete={handleDeleteCategory}
            />
          </div>
          <button
            onClick={categoryModal.openCreate}
            className="mt-2 sm:mt-4 bg-white text-green-600 font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg shadow transition hover:bg-green-200 active:bg-green-300"
          >
            Add category
          </button>
        </div>

        {/* Subcategories */}
        <div className="bg-gradient-to-br from-blue-400 to-indigo-700 rounded-xl shadow-lg p-4 flex flex-col">
          <h2 className="text-2xl font-bold text-center mb-4">Subcategories</h2>
          <div className="flex-1 bg-indigo-900/60 rounded-xl p-2 shadow-inner overflow-y-auto min-h-0
                          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <SubcategoryList
              subcategories={subcategories}
              onEdit={subcategoryModal.openEdit}
              onDelete={handleDeleteSubcategory}
            />
          </div>
          <button
            onClick={subcategoryModal.openCreate}
            className="mt-2 sm:mt-4 bg-white text-indigo-600 font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg shadow transition hover:bg-indigo-200 active:bg-indigo-300"
          >
            Add subcategory
          </button>
        </div>

        {/* Platforms */}
        <div className="bg-gradient-to-br from-gray-400 to-slate-700 rounded-xl shadow-lg p-4 flex flex-col">
          <h2 className="text-2xl font-bold text-center mb-4">Platforms</h2>
          <div className="flex-1 bg-slate-900/60 rounded-xl p-2 shadow-inner overflow-y-auto min-h-0
                          [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
            <PlatformList
              platforms={platforms}
              onEdit={platformModal.openEdit}
              onDelete={handleDeletePlatform}
            />
          </div>
          <button
            onClick={platformModal.openCreate}
            className="mt-2 sm:mt-4 bg-white text-slate-600 font-bold px-3 sm:px-5 py-1.5 sm:py-2 rounded-lg shadow transition hover:bg-slate-200 active:bg-slate-300"
          >
            Add platform
          </button>
        </div>

      </div>

      {/* MODALS */}
      <TierModal modal={tierModal} onSave={saveTier} />
      <GenreModal
        isOpen={genreModal.isOpen}
        form={genreModal.form}
        setForm={genreModal.setForm}
        onClose={genreModal.close}
        onSave={saveGenre}
      />
      <YearModal
        isOpen={yearModal.isOpen}
        value={yearModal.value}
        setValue={yearModal.setValue}
        onClose={yearModal.close}
        onSave={saveYear}
      />
      <OriginModal
        isOpen={originModal.isOpen}
        value={originModal.value}
        setValue={originModal.setValue}
        onClose={originModal.close}
        onSave={saveOrigin}
      />
      <CategoryModal
        isOpen={categoryModal.isOpen}
        value={categoryModal.value}
        setValue={categoryModal.setValue}
        onClose={categoryModal.close}
        onSave={saveCategory}
      />
      <SubcategoryModal
        isOpen={subcategoryModal.isOpen}
        value={subcategoryModal.value}
        setValue={subcategoryModal.setValue}
        categories={categories}
        onClose={subcategoryModal.close}
        onSave={saveSubcategory}
      />
      <PlatformModal
        isOpen={platformModal.isOpen}
        value={platformModal.value}
        setValue={platformModal.setValue}
        onClose={platformModal.close}
        onSave={savePlatform}
      />
    </div>
  );

}
