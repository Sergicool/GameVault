import { useEffect, useState } from "react";
import { getGames } from "../api/games";
import { getGenres } from "../api/genres";
import { getYears } from "../api/years";
import { getOrigins } from "../api/origins";
import { getPlatforms } from "../api/platforms";
import { getCategories } from "../api/categories";
import { getSubcategories } from "../api/subcategories";
import { getTiers } from "../api/tiers";
import GameCard from "../components/GameCard";
import { ChevronDown, ChevronRight } from 'lucide-react';

function Stats() {
  const [games, setGames] = useState([]);
  const [genres, setGenres] = useState([]);
  const [origins, setOrigins] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [tiers, setTiers] = useState([]);
  const [years, setYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({}); // Para desplegables

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const [
        gamesData,
        genresData,
        originsData,
        platformsData,
        categoriesData,
        subcategoriesData,
        tiersData,
        yearsData,
      ] = await Promise.all([
        getGames(),
        getGenres(),
        getOrigins(),
        getPlatforms(),
        getCategories(),
        getSubcategories(),
        getTiers(),
        getYears(),
      ]);

      const enriched = gamesData.map((game) => ({
        ...game,
        imagePreview: `http://localhost:3001/game-image/${encodeURIComponent(
          game.name
        )}?t=${Date.now()}`,
      }));

      enriched.sort((a, b) => a.position - b.position);

      setGames(enriched);
      setGenres(genresData);
      setOrigins(originsData);
      setPlatforms(platformsData);
      setCategories(categoriesData);
      setSubcategories(subcategoriesData);
      setTiers(tiersData);
      setYears(yearsData);
      setLoading(false);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-400">
        Loading stats...
      </div>
    );
  }

  const mainGames = games.filter((g) => !g.extension_of);
  const extensions = games.filter((g) => g.extension_of);

  // ---- FAVORITOS ----
  const getFavoriteByGroup = (items = [], getFilterFn, getLabel) => {
    return items
      .map((item) => {
        const label = getLabel(item);
        const filtered = mainGames.filter(getFilterFn(item));
        if (filtered.length === 0) return null;
        const best = [...filtered].sort((a, b) => a.position - b.position)[0];
        return { label, game: best };
      })
      .filter(Boolean);
  };


  const favByYear = getFavoriteByGroup(years, (y) => (g) => g.year === y.year, (y) => y.year);
  const favByGenre = getFavoriteByGroup(
    genres,
    (gen) => (g) => g.genres?.some((x) => x.name === gen.name),
    (gen) => gen.name
  );
  const favByOrigin = getFavoriteByGroup(origins, (o) => (g) => g.origin === o.name, (o) => o.name);
  const favByPlatform = getFavoriteByGroup(
    platforms,
    (p) => (g) => g.platform === p.name,
    (p) => p.name
  );
  const favByCategory = getFavoriteByGroup(
    categories,
    (c) => (g) => g.category === c.name,
    (c) => c.name
  );
  const favBySubcategory = getFavoriteByGroup(
    subcategories,
    (s) => (g) => g.subcategory === s.name,
    (s) => s.name
  );
  
  // ---- CONTEOS ----
  const countBy = (arr, keyFn) => {
    const counts = {};
    arr.forEach((g) => {
      const values = keyFn(g);
      if (!values) return;
      (Array.isArray(values) ? values : [values]).forEach((val) => {
        if (!counts[val]) counts[val] = 0;
        counts[val]++;
      });
    });
    return counts;
  };

  const countsYears = countBy(mainGames, (g) => g.year);
  const countsGenres = countBy(mainGames, (g) => g.genres?.map((x) => x.name));
  const countsOrigins = countBy(mainGames, (g) => g.origin);
  const countsPlatforms = countBy(mainGames, (g) => g.platform);
  const countsCategories = countBy(mainGames, (g) => g.category);
  const countsSubcategories = countBy(mainGames, (g) => g.subcategory);
  const countsTiers = countBy(mainGames, (g) => g.tier);

  const toggleSection = (key) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // ---- RENDER ----
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-gray-100 p-8 space-y-12">
      <h1 className="text-4xl font-bold text-center mb-8">📊 Stats 📊</h1>

      {/* Totales centrados */}
      <section className="flex justify-center gap-12 mb-8">
        <div className="bg-slate-800 p-4 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold">Total Games</h3>
          <p className="text-3xl font-bold text-cyan-300">{mainGames.length}</p>
        </div>
        <div className="bg-slate-800 p-4 rounded-xl shadow text-center">
          <h3 className="text-lg font-semibold">Extensions</h3>
          <p className="text-3xl font-bold text-pink-300">{extensions.length}</p>
        </div>
      </section>

      {/* Contadores en grid responsive */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">📊 Counts</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 auto-rows-fr">
          {/* Genres primero, más alto */}
          {Object.keys(countsGenres).length > 0 && (
            <div className="bg-slate-700 p-4 rounded-xl row-span-2 flex flex-col">
              <h3 className="text-lg font-semibold mb-2">🎭 Genres</h3>
              <ul className="space-y-1 max-h-120 overflow-y-auto bg-slate-800/60 rounded-xl p-2
                            [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-sm flex-1">
                {Object.entries(countsGenres)
                  .sort((a, b) => b[1] - a[1])
                  .map(([label, count]) => (
                    <li
                      key={label}
                      className="flex justify-between bg-slate-900/60 px-2 py-1 rounded"
                    >
                      <span>{label}</span>
                      <span className="font-bold">{count}</span>
                    </li>
                  ))}
              </ul>
            </div>
          )}

          {/* Resto de los contadores */}
          {[
            { title: "📅 Years", data: countsYears },
            { title: "🌍 Origins", data: countsOrigins },
            { title: "💻 Platforms", data: countsPlatforms },
            { title: "📂 Categories", data: countsCategories },
            { title: "📑 Subcategories", data: countsSubcategories },
            { title: "📑 Tiers", data: countsTiers },
          ]
            .filter(section => Object.keys(section.data).length > 0)
            .map((section) => (
              <div key={section.title} className="bg-slate-700 p-4 rounded-xl">
                <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                <ul className="space-y-1 max-h-48 overflow-y-auto bg-slate-800/60 rounded-xl p-2
                              [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden text-sm">
                  {Object.entries(section.data)
                    .sort((a, b) => b[1] - a[1])
                    .map(([label, count]) => (
                      <li
                        key={label}
                        className="flex justify-between bg-slate-900/60 px-2 py-1 rounded"
                      >
                        <span>{label}</span>
                        <span className="font-bold">{count}</span>
                      </li>
                    ))}
                </ul>
              </div>
            ))}
        </div>
      </section>


      {/* Favoritos con secciones desplegables */}
      {[
        { title: "⭐ Favorites by Year ⭐", data: favByYear },
        { title: "⭐ Favorites by Genre ⭐", data: favByGenre },
        { title: "⭐ Favorites by Origin ⭐", data: favByOrigin },
        { title: "⭐ Favorites by Platform ⭐", data: favByPlatform },
        { title: "⭐ Favorites by Category ⭐", data: favByCategory },
        { title: "⭐ Favorites by Subcategory ⭐", data: favBySubcategory },
      ].map(
        (section) =>
          section.data.length > 0 && (
            <section key={section.title}>
              <button
                className="w-full flex items-center justify-center bg-slate-800 p-3 rounded-xl shadow mb-2 font-semibold text-lg text-gray-100 hover:bg-slate-700 transition-colors relative"
                onClick={() => toggleSection(section.title)}
              >
                {/* Icono a la izquierda */}
                <span className="absolute left-3">
                  {openSections[section.title] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                </span>
                <span>{section.title}</span>
              </button>
              {openSections[section.title] && (
                <div className="flex flex-wrap gap-6 justify-around">
                  {section.data.map(({ label, game }) => (
                    <div key={label}>
                      <h3 className="text-center text-lg font-bold mb-2">{label}</h3>
                      <GameCard game={game} expandible />
                    </div>
                  ))}
                </div>
              )}
            </section>
          )
      )}
    </div>
  );
}

export default Stats;
