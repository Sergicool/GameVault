import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameByName } from '../api/games';

function ExtensionContent({ gameName }) {
  const [parentGame, setParentGame] = useState(null);

  useEffect(() => {
    const fetchParentGame = async () => {
      try {
        const data = await getGameByName(gameName);
        setParentGame(data);
      } catch (err) {
        console.error('Error al obtener juego base:', err);
      }
    };

    fetchParentGame();
  }, [gameName]);

  if (!parentGame) return <p className="text-gray-500">Loading base game...</p>;

  return (
    <div className="flex items-center gap-4">
      <div className="w-40 h-20 bg-gray-700 rounded overflow-hidden flex-shrink-0">
        <img
          src={`http://localhost:3001/game-image/${encodeURIComponent(parentGame.name)}`}
          alt={parentGame.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold">{parentGame.name}</h4>
        <p className="text-xs text-gray-400">
          {parentGame.year} · {parentGame.origin} · {parentGame.category} - {parentGame.subcategory}
        </p>
      </div>
    </div>
  );
}

function isColorDark(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
}

function GameCard({ game, expandible = false, inTierList = false }) {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(game.genres.length);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const children = Array.from(container.children);
    if (!children.length) return;

    const firstTop = children[0].offsetTop;
    let count = 0;

    for (const child of children) {
      if (child.offsetTop > firstTop) break;
      count++;
    }

    const shouldReserveMore = game.genres.length > count;
    const adjusted = shouldReserveMore ? Math.max(0, count - 1) : count;
    setVisibleCount(adjusted);
  }, [game.genres, inTierList]);

  const visibleGenres = game.genres.slice(0, visibleCount);
  const hiddenCount = game.genres.length - visibleCount;

  const openModal = () => {
    if (expandible) setIsExpanded(true);
  };

  const closeModal = () => {
    setIsExpanded(false);
  };

  const handleEdit = () => {
    navigate('/AddGame', { state: { editingGame: game } });
  };

  return (
    <>
      {inTierList && (
        <div className={`w-[10rem] rounded overflow-hidden shadow-lg bg-gradient-to-br from-gray-700 via-gray-500 to-gray-700 ${
            expandible ? 'transition-transform duration-200 cursor-pointer hover:scale-[1.05]' : ''
          }`}
          onClick={openModal}
        >
          <img className="w-[10rem] h-16 object-cover" src={game.imagePreview} alt={game.name} />
          <div className="px-2 py-1 text-white text-sm text-center">{game.name}</div>
        </div>
      )}

      {!inTierList && (
        <div
          className={`flex flex-col transition-transform duration-200 bg-gradient-to-br from-gray-800 to-gray-900 w-[400px] rounded-lg overflow-hidden shadow-lg ${
            expandible ? 'cursor-pointer hover:scale-[1.1]' : ''
          }`}
          onClick={openModal}
        >
          <div className="h-48 bg-gray-200 flex items-center justify-center">
            {game.imagePreview ? (
              <img src={game.imagePreview} alt={game.name} className="object-cover h-full w-full" />
            ) : (
              <span className="text-gray-400">No Image</span>
            )}
          </div>
          <div className="p-4">
            <h3 className="text-xl font-bold mb-2">{game.name}</h3>

            {game.genres && game.genres.length > 0 && (
              <div className="mt-3">
                <div
                  className="flex flex-wrap font-semibold gap-2 max-w-full overflow-hidden"
                  ref={containerRef}
                >
                  {visibleGenres.map((g, i) => {
                    const textColor = isColorDark(g.color) ? 'white' : 'black';
                    return (
                      <span
                        key={i}
                        className="text-xs rounded-full px-2 py-0.5"
                        style={{
                          backgroundColor: g.color,
                          color: textColor,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {g.name}
                      </span>
                    );
                  })}

                  {hiddenCount > 0 && (
                    <span className="text-xs italic bg-gray-600 text-white rounded-full px-2 py-0.5">
                      +{hiddenCount} more
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {expandible && isExpanded && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
          onClick={closeModal}
        >
          <div
            className="relative w-full max-w-[50rem] h-[46rem] bg-zinc-900 text-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Imagen */}
            {game.imagePreview ? (
              <div className="relative w-full aspect-[16/7] bg-gray-700 overflow-hidden flex-shrink-0">
                <img
                  src={game.imagePreview}
                  alt={game.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Botón cerrar */}
                <button
                  onClick={closeModal}
                  className="absolute top-2 right-4 text-white z-10 text-2xl hover:text-red-500"
                >
                  ✕
                </button>
              </div>
            ) : (
              <div className="w-full aspect-[16/9] bg-gray-700 flex items-center justify-center text-gray-300">
                No Image
              </div>
            )}

            {/* Contenido que hace scroll */}
            <div className="flex-1 overflow-y-auto p-6 flex flex-col items-center justify-between space-y-6">
              <div className="w-full flex flex-col items-center">
                {/* Título */}
                <h2 className="text-4xl font-bold text-center mb-4">{game.name}</h2>

                {/* Subtítulo con año, origen y categoría como etiquetas */}
                <div className="flex flex-wrap justify-center gap-2 mb-4">
                  <span className="bg-zinc-800 text-gray-200 text-sm font-semibold px-3 py-1 rounded-md">
                    Played in {game.year}
                  </span>
                  <span className="bg-zinc-800 text-gray-200 text-sm font-semibold px-3 py-1 rounded-md">
                    {game.origin} game
                  </span>
                  <span className="bg-zinc-800 text-gray-200 text-sm font-semibold px-3 py-1 rounded-md">
                    {game.category}
                    {game.subcategory && ` - ${game.subcategory}`}
                  </span>
                </div>

                {/* Géneros */}
                {game.genres?.length > 0 && (
                  <div className="w-full max-w-3xl">
                    <p className="mb-2 font-semibold text-gray-300 text-center text-xl">Genres</p>
                    <div className="bg-zinc-800 border border-zinc-700 rounded-lg p-3">
                      <div className="flex flex-wrap justify-center gap-2">
                        {game.genres.map((g, i) => {
                          const textColor = isColorDark(g.color) ? 'white' : 'black';
                          return (
                            <span
                              key={i}
                              className="text-md font-semibold rounded-full px-2 py-0.5"
                              style={{
                                backgroundColor: g.color,
                                color: textColor,
                              }}
                            >
                              {g.name}
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}

                {/* Juego del que es extensión */}
                {game.extension_of && (
                  <div className="w-full max-w-3xl mt-4 bg-zinc-800 border border-zinc-700 p-4 rounded-xl">
                    <p className="text-sm text-gray-400 italic mb-2">This game is an extension of:</p>
                    <ExtensionContent gameName={game.extension_of} />
                  </div>
                )}
              </div>

              {/* Botón Editar */}
              <div className="w-full flex justify-center">
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Edit game
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GameCard;
