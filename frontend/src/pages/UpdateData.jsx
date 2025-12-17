import { useEffect, useState } from 'react';
import { getGenres, addGenre, updateGenre, deleteGenre } from '../api/genres';
import { getTiers, addTier, updateTier, deleteTier, moveTierUp, moveTierDown } from '../api/tiers';
import { getYears, addYear, deleteYear } from '../api/years';

import { useGenreModal } from '../components/update_data/genres/useGenreModal';
import GenreList from '../components/update_data/genres/GenreList';
import GenreModal from '../components/update_data/genres/GenreModal';

import { useTierModal } from '../components/update_data/tiers/useTierModal';
import TierList from '../components/update_data/tiers/TierList';
import TierModal from '../components/update_data/tiers/TierModal';

import { useYearModal } from '../components/update_data/years/useYearModal';
import YearList from '../components/update_data/years/YearList';
import YearModal from '../components/update_data/years/YearModal';

export default function UpdateData() {
  const [genres, setGenres] = useState([]);
  const genreModal = useGenreModal('#0ea5e9');

  const [tiers, setTiers] = useState([]);
  const tierModal = useTierModal('#a855f7');

  const [years, setYears] = useState([]);
  const yearModal = useYearModal();

  useEffect(() => {
    loadGenres();
    loadTiers();
    loadYears();
  }, []);

  // Loaders
  const loadGenres = async () => setGenres(await getGenres());
  const loadTiers = async () => setTiers(await getTiers());
  const loadYears = async () => setYears(await getYears());

  // Saves
  const saveGenre = async () => {
    const { name, color, originalName } = genreModal.form;
    if (!name.trim()) return;
    if (originalName) await updateGenre(originalName, name, color);
    else await addGenre(name, color);
    genreModal.close();
    loadGenres();
  };

  const saveTier = async () => {
    const { name, color, originalName } = tierModal.value;
    if (!name.trim()) return;
    if (originalName) await updateTier(originalName, name, color);
    else await addTier(name, color, tiers.length);
    tierModal.setOpen(false);
    loadTiers();
  };

  const saveYear = async () => {
    const { year, originalName } = yearModal.value;
    if (!year.trim()) return;
    if (!originalName) await addYear(year);
    // Para editar, habría que implementar updateYear en API
    yearModal.close();
    loadYears();
  };

  const handleDeleteYear = async (year) => {
    await deleteYear(year);
    loadYears();
  };

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

        {/* Cards 3–6 – placeholders */}
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-slate-400 to-slate-700 rounded-xl shadow-lg p-4 flex items-center justify-center text-white font-bold"
          >
            Section {i+1}
          </div>
        ))}
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
    </div>
  );

}
