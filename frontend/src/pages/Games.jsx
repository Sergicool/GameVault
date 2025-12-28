import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { getGames } from "../api/games";
import { getGenres } from "../api/genres";
import { getYears } from "../api/years";
import { getOrigins } from "../api/origins";
import { getPlatforms } from "../api/platforms";
import { getCategories } from "../api/categories";
import { getSubcategories } from "../api/subcategories";
import { getTiers } from "../api/tiers";
import GameCard from "../components/GameCard";
import SidebarFilters from "../components/SidebarFilters";
import { Search } from "lucide-react";

function Games() {
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
    showGames: true,
    showExtensions: true,
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const hasGames = games.length > 0;

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

        const enrichedGames = gamesData.map((game) => ({
          ...game,
          imagePreview: `http://localhost:3001/game-image/${encodeURIComponent(
            game.name,
          )}?t=${Date.now()}`,
        }));

        enrichedGames.sort((a, b) => a.name.localeCompare(b.name));

        setGames(enrichedGames);
        setYears(yearsData);
        setGenres(genresData);
        setOrigins(originsData);
        setPlatforms(platformsData);
        setCategories(categoriesData);
        setSubcategories(subcategoriesData);
        setTiers(tiersData);
      } finally {
        setLoading(false); // termina la carga
      }
    };

    loadData();
  }, []);

  const filteredGames = useMemo(() => {
    let juegos = [...games];

    juegos = juegos.filter((g) => {
      const isExtension = !!g.extension_of;

      if (!filters.showGames && !isExtension) return false;
      if (!filters.showExtensions && isExtension) return false;

      return true;
    });

    return juegos.filter((game) => {
      if (
        searchQuery.trim() !== "" &&
        !game.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
        return false;

      if (filters.years.length > 0 && !filters.years.includes(game.year))
        return false;

      if (
        filters.genres.length > 0 &&
        !game.genres?.some((g) => filters.genres.includes(g.name))
      )
        return false;

      if (filters.origins.length > 0 && !filters.origins.includes(game.origin))
        return false;

      if (
        filters.platforms.length > 0 &&
        !filters.platforms.includes(game.platform)
      )
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
  }, [games, filters, searchQuery]);

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
          <p className="text-md mt-20 text-center text-gray-400 italic">
            Loading games...
          </p>
        ) : (
          <>
            {/* Barra de búsqueda siempre visible */}
            <div className="relative mx-auto mb-8 max-w-sm">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="
                  w-full
                  rounded-2xl border border-indigo-500
                  bg-indigo-900/40
                  py-2 pr-4 pl-10
                  text-indigo-100 placeholder-indigo-300
                  shadow-md
                  focus:ring-2 focus:ring-indigo-300 focus:outline-none
                "
              />
              <Search className="absolute top-2.5 left-3 h-5 w-5 text-indigo-300" />
            </div>

            {/* Resultados */}
            {!hasGames ? (
              <p className="text-md mt-20 text-center text-gray-400 italic">
                No games added yet
              </p>
            ) : filteredGames.length > 0 ? (
              <div className="flex flex-wrap justify-around gap-6">
                {filteredGames.map((game) => (
                  <GameCard key={game.name} game={game} expandible />
                ))}
              </div>
            ) : (
              <p className="text-md mt-20 text-center text-gray-400 italic">
                No games found matching the filters
              </p>
            )}

          </>
        )}
      </motion.div>
    </div>
  );
}

export default Games;
