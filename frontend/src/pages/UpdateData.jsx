import { useEffect, useState } from 'react';
import { getGenres, addGenre, updateGenre, deleteGenre } from '../api/genres';
import { getTiers, addTier, updateTier, deleteTier, moveTierUp, moveTierDown } from '../api/tiers';

import { useGenreModal } from '../components/update_data/genres/useGenreModal';
import GenreList from '../components/update_data/genres/GenreList';
import GenreModal from '../components/update_data/genres/GenreModal';

import { useCrudModal } from '../components/update_data/tiers/useCrudModal';
import TierList from '../components/update_data/tiers/TierList';
import TierModal from '../components/update_data/tiers/TierModal';

export default function UpdateData() {
  const [genres, setGenres] = useState([]);
  const genreModal = useGenreModal('#0ea5e9');

  const [tiers, setTiers] = useState([]);
  const tierModal = useCrudModal('#a855f7');

  useEffect(() => {
    loadGenres();
    loadTiers();
  }, []);

  // Loaders

  const loadGenres = async () => {
    const data = await getGenres();
    setGenres(data);
  };

  const loadTiers = async () => {
    const data = await getTiers();
    setTiers(data);
  };

  // Saves

  const saveGenre = async () => {
    const { name, color, originalName } = genreModal.form;
    if (!name.trim()) return;

    if (originalName) {
      await updateGenre(originalName, name, color);
    } else {
      await addGenre(name, color);
    }

    genreModal.close();
    loadGenres();
  };

  const saveTier = async () => {
    const { name, color, originalName } = tierModal.value;
    if (!name.trim()) return;

    if (originalName) {
      await updateTier(originalName, name, color);
    } else {
      await addTier(name, color, tiers.length);
    }

    tierModal.setOpen(false);
    loadTiers();
  };

  return (
    <div className="h-[calc(100vh-4rem)] grid grid-cols-4 gap-6 p-6">

      {/* LEFT COLUMN – GENRES (2 rows) */}
      <div className="col-span-1 row-span-2 bg-gradient-to-br from-teal-400 to-cyan-700 rounded-xl shadow-lg p-4 flex flex-col">
        <h2 className="text-2xl font-extrabold text-white text-center mb-4">
          Genres
        </h2>

        {/* Scrollable content */}
        <div className="flex-1 bg-cyan-900/60 rounded-xl p-2 shadow-inner overflow-y-auto">
          <GenreList
            genres={genres}
            onEdit={genreModal.openEdit}
            onDelete={async (name) => {
              await deleteGenre(name);
              loadGenres();
            }}
          />
        </div>

        <button
          onClick={genreModal.openCreate}
          className="mt-4 bg-white text-cyan-700 font-bold py-2 rounded-lg
                    hover:bg-cyan-100 active:bg-cyan-200 transition"
        >
          Add genre
        </button>
      </div>

      {/* RIGHT COLUMN – 3x2 GRID */}
      <div className="col-span-3 grid grid-cols-3 grid-rows-2 gap-6 h-full">

        {/* TIERS */}
        <div className="bg-gradient-to-br from-fuchsia-400 to-purple-700 rounded-xl shadow-lg p-4 flex flex-col">
          <h2 className="text-2xl font-extrabold text-white text-center mb-4">
            Tiers
          </h2>

          <div className="flex-1 bg-purple-900/60 rounded-xl p-2 shadow-inner overflow-y-auto">
            <TierList
              tiers={tiers}
              onEdit={tierModal.openEdit}
              onDelete={async (name) => {
                await deleteTier(name);
                loadTiers();
              }}
              onMoveUp={async (index) => {
                if (index === 0) return;
                await moveTierUp(tiers[index].name);
                loadTiers();
              }}
              onMoveDown={async (index) => {
                if (index === tiers.length - 1) return;
                await moveTierDown(tiers[index].name);
                loadTiers();
              }}
            />
          </div>

          <button
            onClick={tierModal.openCreate}
            className="mt-4 bg-white text-purple-700 font-bold py-2 rounded-lg
                      hover:bg-purple-100 active:bg-purple-200 transition"
          >
            Add tier
          </button>
        </div>

        {/* PLACEHOLDERS FOR OTHER 5 SECTIONS */}
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="bg-gradient-to-br from-slate-400 to-slate-700 rounded-xl shadow-lg p-4 flex items-center justify-center text-white font-bold"
          >
            Section {i + 1}
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

    </div>
  );
}
