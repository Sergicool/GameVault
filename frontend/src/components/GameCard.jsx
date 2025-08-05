import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameByName } from '../api/games'; // asegúrate de tener esta función

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

  if (!parentGame) return <p className="text-gray-500">Cargando juego base...</p>;

  return (
    <div className="flex items-center gap-4">
      <div className="w-20 h-20 bg-gray-700 rounded overflow-hidden flex-shrink-0">
        <img
          src={`http://localhost:3001/game-image/${encodeURIComponent(parentGame.name)}`}
          alt={parentGame.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div>
        <h4 className="text-lg font-semibold">{parentGame.name}</h4>
        <p className="text-xs text-gray-400">{parentGame.year} · {parentGame.origin}</p>
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
    if (inTierList) return;

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
    if (expandible && !inTierList) setIsExpanded(true);
  };

  const closeModal = () => {
    setIsExpanded(false);
  };

  const handleEdit = () => {
    navigate('/AddGame', { state: { editingGame: game } });
  };

  if (inTierList) {
    return (
      <div
        className="border-gray-500
          border-10 rounded-lg
          flex items-center justify-center
          overflow-hidden scale-30 cursor-pointer
      ">
        {game.imagePreview ? (
          <img
            src={game.imagePreview}
            alt={game.name}
            className="object-cover w-full h-full"
          />
        ) : (
          <span className="text-gray-400 text-xs">No Image</span>
        )}
      </div>
    );
  }

  return (
    <>
      <div
        className={`
          flex flex-col transition-transform duration-200 
          bg-gradient-to-br from-gray-800 to-gray-900 
          w-[400px] 
          rounded-lg overflow-hidden 
          shadow-lg ${
          expandible ? 'cursor-pointer hover:scale-[1.1]' : ''
        }`}
        onClick={openModal}
      >
        <div className="h-48 bg-gray-200 flex items-center justify-center">
          {game.imagePreview ? (
            <img
              src={game.imagePreview}
              alt={game.name}
              className="object-cover h-full w-full"
            />
          ) : (
            <span className="text-gray-400">No Image</span>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-xl font-bold mb-2">{game.name}</h3>

          {game.genres && game.genres.length > 0 && (
            <div className="mt-2">
              <div
                className="flex flex-wrap gap-2 max-w-full overflow-hidden"
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

      {expandible && isExpanded && (
        <div
          className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
          onClick={closeModal} // cerrar al hacer click en fondo
        >
          <div
            className="bg-zinc-900 text-white w-full max-w-5xl rounded-2xl shadow-2xl p-8 overflow-y-auto max-h-[90vh] relative"
            onClick={(e) => e.stopPropagation()} // evita que el click interior cierre
          >
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-2xl hover:text-red-500"
            >
              ✕
            </button>

            <div className="flex flex-col items-center">
              {game.imagePreview && (
                <img
                  src={game.imagePreview}
                  alt={game.name}
                  className="w-full max-w-md rounded-xl mb-6 object-cover"
                />
              )}

              <h2 className="text-4xl font-bold mb-2 text-center">{game.name}</h2>
              <p className="text-sm text-gray-400 mb-4">
                {game.year} · {game.origin}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl mb-6">
                <div>
                  <p className="mb-1"><strong>Categoría:</strong> {game.category}</p>
                  <p><strong>Subcategoría:</strong> {game.subcategory}</p>
                </div>
                {game.genres?.length > 0 && (
                  <div>
                    <p className="mb-1"><strong>Géneros:</strong></p>
                    <div className="flex flex-wrap gap-2">
                      {game.genres.map((g, i) => {
                        const textColor = isColorDark(g.color) ? 'white' : 'black';
                        return (
                          <span
                            key={i}
                            className="text-xs rounded-full px-2 py-0.5"
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
                )}
              </div>

              {/* Mostrar juego del que es extensión */}
              {game.extension_of && (
                <div className="w-full max-w-3xl mt-8 bg-zinc-800 p-4 rounded-xl">
                  <p className="text-sm text-gray-400 italic mb-2">
                    Este juego es una extensión de:
                  </p>

                  {/* Juego padre */}
                  <ExtensionContent gameName={game.extension_of} />
                </div>
              )}

              <div className="mt-6">
                <button
                  onClick={handleEdit}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg"
                >
                  Editar juego
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
