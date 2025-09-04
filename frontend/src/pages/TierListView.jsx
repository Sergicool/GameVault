import { useEffect, useState, useMemo } from "react";
import { getGames } from '../api/games';
import { getTiers } from '../api/tiers';
import { getGenres } from '../api/genres';
import { getYears } from '../api/years';
import { getOrigins } from '../api/origins';
import { getPlatforms } from '../api/platforms';
import { getCategories } from '../api/categories';
import { getSubcategories } from '../api/subcategories';
import SidebarFilters from "../components/SidebarFilters";
import TierList from "../components/TierList";

function TierListView() {
  const [tiers, setTiers] = useState([]);
  const [games, setGames] = useState([]);

  const [years, setYears] = useState([]);
  const [genres, setGenres] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  const [filters, setFilters] = useState({
    years: [],
    genres: [],
    origins: [],
    platforms: [],
    categories: [],
    subcategories: [],
    tiers: [],
  });

  useEffect(() => {
    const loadData = async () => {
      const [
        gamesData,
        tiersData,
        yearsData,
        genresData,
        originsData,
        platformsData,
        categoriesData,
        subcategoriesData,
      ] = await Promise.all([
        getGames(),
        getTiers(),
        getYears(),
        getGenres(),
        getOrigins(),
        getPlatforms(),
        getCategories(),
        getSubcategories(),
      ]);

      const enrichedGames = gamesData.map((game) => ({
        ...game,
        imagePreview: `http://localhost:3001/game-image/${encodeURIComponent(
          game.name
        )}?t=${Date.now()}`,
      }));

      setGames(enrichedGames);
      setTiers(tiersData);
      setYears(yearsData);
      setGenres(genresData);
      setOrigins(originsData);
      setPlatforms(platformsData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
    };

    loadData();
  }, []);

  const filteredGames = useMemo(() => {
    let juegos = [...games];

    if (filters.ignoreExtensions) {
      juegos = juegos.filter((g) => !g.extension_of);
    }

    return juegos.filter((game) => {
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


  const gamesByTier = useMemo(() => {
    const grouped = {};
    tiers.forEach((tier) => {
      grouped[tier.name] = [];
    });

    filteredGames.forEach((game) => {
      if (game.tier && grouped[game.tier]) {
        grouped[game.tier].push(game);
      }
    });

    Object.keys(grouped).forEach((tier) => {
      grouped[tier].sort((a, b) => a.position - b.position);
    });

    return grouped;
  }, [filteredGames, tiers]);

  if (tiers.length === 0) {
    return <p className="text-md text-gray-400 italic text-center mt-20"> Loading games... </p>;
  }

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
      />

      <div className="ml-[50px] flex-1 p-6">
        <TierList tiers={tiers} gamesByTier={gamesByTier} editable={false} />
      </div>
    </div>
  );
}

export default TierListView;