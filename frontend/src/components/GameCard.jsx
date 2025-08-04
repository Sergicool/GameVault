import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function isColorDark(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
}

function GameCard({ game, expandible = false }) {
  
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
  }, [game.genres]);

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
      <div
        className="flex flex-col cursor-pointer hover:scale-[1.02] transition-transform duration-200 bg-gradient-to-br from-gray-800 to-gray-900 w-100 rounded-lg overflow-hidden shadow-lg"
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

      {/* Modal expandido */}
      {expandible && isExpanded && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 text-white max-w-3xl w-full rounded-2xl shadow-lg p-6 relative overflow-y-auto max-h-[90vh]">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white text-xl hover:text-red-400"
            >
              ✕
            </button>

            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0 w-full md:w-1/2">
                {game.imagePreview ? (
                  <img
                    src={game.imagePreview}
                    alt={game.name}
                    className="w-full h-auto rounded-xl"
                  />
                ) : (
                  <div className="bg-gray-700 text-gray-300 p-6 rounded-xl">No Image</div>
                )}
              </div>

              <div className="flex-1">
                <h2 className="text-3xl font-bold mb-2">{game.name}</h2>
                <p className="text-sm text-gray-400 mb-4">{game.year} · {game.origin}</p>
                <p className="mb-2">
                  <strong>Categoría:</strong> {game.category}
                </p>
                <p className="mb-2">
                  <strong>Subcategoría:</strong> {game.subcategory}
                </p>
                {game.extension_of && (
                  <p className="mb-2 italic text-sm text-gray-400">
                    Extensión de: {game.extension_of}
                  </p>
                )}

                {game.genres?.length > 0 && (
                  <div className="mt-4 flex flex-wrap gap-2">
                    {game.genres.map((g, i) => {
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
                  </div>
                )}

                <div className="mt-6">
                  <button
                    onClick={handleEdit}
                    className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg"
                  >
                    Edit Game
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default GameCard;
