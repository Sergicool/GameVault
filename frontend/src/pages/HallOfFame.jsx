import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { getGames } from '../api/games';
import { getGenres } from '../api/genres';
import { getYears } from '../api/years';
import { getOrigins } from '../api/origins';
import { getPlatforms } from '../api/platforms';
import { getCategories } from '../api/categories';
import { getSubcategories } from '../api/subcategories';
import { getTiers } from '../api/tiers';
import GameCard from '../components/GameCard';
import SidebarFilters from "../components/SidebarFilters";

function HallOfFame() {
  const [games, setGames] = useState([]);
  const [years, setYears] = useState([]);
  const [genres, setGenres] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [filters, setFilters] = useState({
    years: [],
    genres: [],
    origins: [],
    platforms: [],
    categories: [],
    subcategories: [],
    tiers: [],
  });
  const [loading, setLoading] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [
          gamesData,
          yearsData,
          genresData,
          originsData,
          platformsData,
          categoriesData,
          subcategoriesData,
          tiersData,
        ] = await Promise.all([
          getGames(),
          getYears(),
          getGenres(),
          getOrigins(),
          getPlatforms(),
          getCategories(),
          getSubcategories(),
          getTiers(),
        ]);

        // Añadir imagen con timestamp cache-busting
        const enrichedGames = gamesData.map((game) => ({
          ...game,
          imagePreview: `http://localhost:3001/game-image/${encodeURIComponent(
            game.name
          )}?t=${Date.now()}`,
        }));

        // Ordenar por posición
        enrichedGames.sort((a, b) => a.position - b.position);

        setGames(enrichedGames);
        setYears(yearsData);
        setGenres(genresData);
        setOrigins(originsData);
        setPlatforms(platformsData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setTiers(tiersData);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredGames = useMemo(() => {
    let juegos = [...games];

    if (filters.ignoreExtensions) {
      juegos = juegos.filter((g) => !g.extension_of);
    }

    return juegos.filter((game) => {
      if (!game.tier) return false;

      if (filters.years.length > 0 && !filters.years.includes(game.year))
        return false;

      if (
        filters.genres.length > 0 &&
        !game.genres?.some((g) => filters.genres.includes(g.name))
      )
        return false;

      if (filters.origins.length > 0 && !filters.origins.includes(game.origin))
        return false;

      if (filters.platforms.length > 0 && !filters.platforms.includes(game.platform))
        return false;

      if (
        filters.categories.length > 0 &&
        !filters.categories.includes(game.category)
      )
        return false;

      if (
        filters.subcategories.length > 0 &&
        !filters.subcategories.includes(game.subcategory)
      )
        return false;

      if (filters.tiers.length > 0 && !filters.tiers.includes(game.tier))
        return false;

      return true;
    });
  }, [games, filters]);

  return (
    <div className="flex">
      <SidebarFilters
        years={years}
        genres={genres}
        origins={origins}
        platforms={platforms}
        categories={categories}
        subcategories={subcategories}
        tiers={tiers}
        filters={filters}
        setFilters={setFilters}
        onOpenChange={setSidebarOpen}
      />

      <motion.div
        animate={{ marginLeft: sidebarOpen ? 400 : 50 }}
        transition={{ type: "spring", stiffness: 200, damping: 20 }}
        className="flex-1 min-h-screen p-6"
      >
        {loading ? (
          <p className="text-md text-gray-400 italic text-center mt-20">
            Loading leaderboard...
          </p>
        ) : filteredGames.length > 0 ? (
          <>
            <h1 className="text-4xl text-center font-mono font-bold tracking-tight text-gray-100 mb-8 drop-shadow-md">
              🎖️ Hall of Fame 🎖️
            </h1>

            <div className="flex flex-col gap-3 max-w-3xl mx-auto">
              {filteredGames.map((game, index) => (
                <GameCard key={game.name} game={game} displayIndex={index + 1} inLeaderboard expandible/>
              ))}
            </div>
          </>
        ) : (
          <p className="text-md text-gray-400 italic text-center mt-20">
            No games match the current filters
          </p>
        )}
      </motion.div>
    </div>
  );
}

export default HallOfFame;
