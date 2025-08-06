import { useEffect, useState } from 'react';
import { getGames } from '../api/games';
import { getTiers } from '../api/tiers';
import TierList from '../components/TierList';

function TierListView() {
  const [tiers, setTiers] = useState([]);
  const [gamesByTier, setGamesByTier] = useState({});

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

    enrichedGames.forEach((game) => {
      if (game.tier && grouped[game.tier]) {
        grouped[game.tier].push(game);
      }
    });

    Object.keys(grouped).forEach((tier) => {
      grouped[tier].sort((a, b) => a.position - b.position);
    });

    setTiers(tiersData);
    setGamesByTier(grouped);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (tiers.length === 0) {
    return <div className="text-white p-6">Cargando tier list...</div>;
  }

  return <TierList tiers={tiers} gamesByTier={gamesByTier} editable={false} />;
}

export default TierListView;
