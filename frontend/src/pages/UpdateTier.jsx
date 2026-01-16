import { useEffect, useState } from 'react';
import { getGames, updateGamesTierList } from '../api/games';
import { getTiers } from '../api/tiers';
import TierList from '../components/TierList';

import { useNavigate } from 'react-router-dom';

function UpdateTier() {

  const navigate = useNavigate();

  const [tiers, setTiers] = useState([]);
  const [gamesByTier, setGamesByTier] = useState({});
  const [unassignedGames, setUnassignedGames] = useState([]);

  const loadData = async () => {
    const [gamesData, tiersData] = await Promise.all([getGames(), getTiers()]);

    const enrichedGames = gamesData.map((game) => ({
      ...game,
      imagePreview: `http://localhost:3001/game-image/${encodeURIComponent(game.name)}?t=${Date.now()}`,
    }));

    const grouped = {};
    tiersData.forEach((tier) => {
      grouped[tier.name] = [];
    });

    const unassigned = [];

    enrichedGames.forEach((game) => {
      if (game.tier && grouped[game.tier]) {
        grouped[game.tier].push(game);
      } else {
        unassigned.push(game);
      }
    });

    Object.keys(grouped).forEach((tier) => {
      grouped[tier].sort((a, b) => a.position - b.position);
    });
    unassigned.sort((a, b) => a.name.localeCompare(b.name));

    setTiers(tiersData);
    setGamesByTier(grouped);
    setUnassignedGames(unassigned);
  };

  useEffect(() => {
    loadData();
  }, []);

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceId = source.droppableId;
    const destId = destination.droppableId;

    const sourceList = sourceId === 'unassigned' ? unassignedGames : gamesByTier[sourceId];
    const destList = destId === 'unassigned' ? unassignedGames : gamesByTier[destId];

    const movedItem = sourceList[source.index];

    const newSourceList = Array.from(sourceList);
    const newDestList = sourceId === destId ? newSourceList : Array.from(destList);

    newSourceList.splice(source.index, 1);
    movedItem.tier = destId === 'unassigned' ? null : destId;
    newDestList.splice(destination.index, 0, movedItem);

    if (sourceId === destId) {
      if (sourceId === 'unassigned') {
        setUnassignedGames(newSourceList);
      } else {
        setGamesByTier(prev => ({ ...prev, [sourceId]: newSourceList }));
      }
    } else {
      if (sourceId === 'unassigned') {
        setUnassignedGames(newSourceList);
      } else {
        setGamesByTier(prev => ({ ...prev, [sourceId]: newSourceList }));
      }

      if (destId === 'unassigned') {
        setUnassignedGames(newDestList);
      } else {
        setGamesByTier(prev => ({ ...prev, [destId]: newDestList }));
      }
    }
  };

  const handleSave = async () => {
    const allGames = [];
    let globalPosition = 0;

    tiers.forEach((tier) => {
      (gamesByTier[tier.name] || []).forEach((game) => {
        allGames.push({
          name: game.name,
          tier: tier.name,
          position: globalPosition++,
        });
      });
    });

    unassignedGames.forEach((game) => {
      allGames.push({
        name: game.name,
        tier: null,
        position: globalPosition++,
      });
    });

    try {
      await updateGamesTierList(allGames);
      alert('Tier list actualizada correctamente');
      navigate('/TierList');
    } catch (e) {
      alert('Error al actualizar tier list');
      console.error('❌ Error in handleSave:', e);
    }
  };

  if (tiers.length === 0) {
    return (
      <p className="text-md mt-20 text-center text-gray-400 italic">
        Theres have to be tiers and games registered.
      </p>
    );
  }

  return (
    <div>
      <TierList
        tiers={tiers}
        gamesByTier={gamesByTier}
        unassignedGames={unassignedGames}
        editable={true}
        onDragEnd={onDragEnd}
      />

      <div className="pl-6 pr-6 pb-6">
        <button
          onClick={handleSave}
          className="
                rounded-lg bg-theme-updateTierlist-button px-6 py-2 text-sm font-bold text-white transition
                hover:bg-theme-updateTierlist-button-hover active:bg-theme-updateTierlist-button-active
        ">
          Save Changes
        </button>
      </div>
    </div>
  );
}

export default UpdateTier;
