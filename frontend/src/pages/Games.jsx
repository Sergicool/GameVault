import { useEffect, useState } from 'react';
import { getGames } from '../api/games';
import { getGenres } from '../api/genres';
import GameCard from '../components/GameCard';

function Games() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    const loadGames = async () => {
      try {
        const [gamesData, genresData] = await Promise.all([getGames(), getGenres()]);
        console.log('gamesData:', gamesData);

        const enrichedGames = gamesData.map((game) => ({
          ...game,
          imagePreview: `http://localhost:3001/game-image/${game.name}`,
        }));

        // Ordenar por nombre
        enrichedGames.sort((a, b) => a.name.localeCompare(b.name));

        setGames(enrichedGames);
        setGenres(genresData);
      } catch (error) {
        console.error('Error al cargar juegos:', error);
      }
    };

    loadGames();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-3xl text-white font-bold mb-6">Todos los Juegos</h1>
      <div className="flex flex-wrap gap-6 justify-around ">
        {games.map((game) => (
          <GameCard key={game.name} game={game} expandible/>
        ))}
      </div>
    </div>
  );
}

export default Games;
