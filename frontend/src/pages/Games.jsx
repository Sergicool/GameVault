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

  useEffect(() => {
    const loadData = async () => {
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
    };

    loadData();
  }, []);

  const filteredGames = useMemo(() => {
    return games.filter((game) => {
      if (filters.years.length > 0 && !filters.years.includes(game.year))
        return false;

      if (
        filters.genres.length > 0 &&
        !game.genres?.some((g) => filters.genres.includes(g.name))
      )
        return false;

      if (
        filters.origins.length > 0 &&
        !filters.origins.includes(game.origin)
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
  }, [games, filters]);


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

      <div className="ml-[50px] flex-1 p-6">
        <h1 className="text-3xl text-white font-bold mb-6">Todos los Juegos</h1>
        <div className="flex flex-wrap gap-6 justify-around">
          {filteredGames.map((game) => (
            <GameCard key={game.name} game={game} expandible />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Games;