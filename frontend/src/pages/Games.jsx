import { useEffect, useState, useMemo } from "react";
import { getGames } from '../api/games';
import { getGenres } from '../api/genres';
import { getYears } from '../api/years';
import { getOrigins } from '../api/origins';
import { getCategories } from '../api/categories';
import { getSubcategories } from '../api/subcategories';
import { getTiers } from '../api/tiers';
import GameCard from '../components/GameCard';
import SidebarFilters from "../components/SidebarFilters";
import { Search } from "lucide-react";

function Games() {
  const [games, setGames] = useState([]);
  const [years, setYears] = useState([]);
  const [genres, setGenres] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tiers, setTiers] = useState([]);

  const [filters, setFilters] = useState({
    years: [],
    genres: [],
    origins: [],
    categories: [],
    subcategories: [],
    tiers: [],
  });

  const [searchQuery, setSearchQuery] = useState(""); 
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [
          gamesData,
          yearsData,
          genresData,
          originsData,
          categoriesData,
          subcategoriesData,
          tiersData,
        ] = await Promise.all([
          getGames(),
          getYears(),
          getGenres(),
          getOrigins(),
          getCategories(),
          getSubcategories(),
          getTiers(),
        ]);

        const enrichedGames = gamesData.map((game) => ({
          ...game,
          imagePreview: `http://localhost:3001/game-image/${encodeURIComponent(
            game.name
          )}?t=${Date.now()}`,
        }));

        enrichedGames.sort((a, b) => a.name.localeCompare(b.name));

        setGames(enrichedGames);
        setYears(yearsData);
        setGenres(genresData);
        setOrigins(originsData);
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

    if (filters.ignoreExtensions) {
      juegos = juegos.filter((g) => !g.extension_of);
    }

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
        categories={categories}
        subcategories={subcategories}
        tiers={tiers}
        filters={filters}
        setFilters={setFilters}
      />

      <div className="ml-[50px] flex-1 p-6 min-h-screen">
        {loading ? (
          <p className="text-md text-gray-400 italic text-center mt-20">
            Loading games...
          </p>
        ) : (
          <>
            {/* Título */}
            <h1 className="text-4xl text-center font-mono font-bold tracking-tight text-gray-100 mb-8 drop-shadow-md">
              All Played Games
            </h1>

            {/* Barra de búsqueda siempre visible */}
            <div className="relative max-w-md mx-auto mb-8">
              <input
                type="text"
                placeholder="Search games..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-2xl border border-gray-600 bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            {/* Resultados */}
            {filteredGames.length > 0 ? (
              <div className="flex flex-wrap gap-6 justify-around">
                {filteredGames.map((game) => (
                  <GameCard key={game.name} game={game} expandible />
                ))}
              </div>
            ) : (
              <p className="text-md text-gray-400 italic text-center mt-20">
                No games found matching the filters
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );

}

export default Games;
