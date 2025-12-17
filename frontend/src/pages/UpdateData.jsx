import { useEffect, useState } from 'react';
import { getTiers, addTier, updateTier, deleteTier, moveTierUp, moveTierDown } from '../api/tiers';
import { useCrudModal } from '../components/update_data/useCrudModal';

import TierList from '../components/update_data/TierList';
import TierModal from '../components/update_data/TierModal';

export default function UpdateData() {
  const [tiers, setTiers] = useState([]);
  const tierModal = useCrudModal('#a855f7');

  useEffect(() => {
    loadTiers();
  }, []);

  const loadTiers = async () => {
    const data = await getTiers();
    setTiers(data);
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
    <div className="p-6 max-w-lg">
      <div className="bg-gradient-to-br from-fuchsia-400 to-purple-700 rounded-xl shadow-lg p-4">
        <h2 className="text-2xl font-extrabold text-white text-center mb-4">
          Tiers
        </h2>

        <div className="bg-purple-900/60 rounded-xl p-2 shadow-inner mb-4">
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
          className="w-full bg-white text-purple-700 font-bold py-2 rounded-lg
                    hover:bg-purple-100 active:bg-purple-200 transition"
        >
          Add tier
        </button>
      </div>

      <TierModal modal={tierModal} onSave={saveTier} />
    </div>
  );
}
