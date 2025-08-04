import React, { useEffect, useRef, useState } from 'react';

function isColorDark(hexColor) {
  const hex = hexColor.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
}

function GameCard({ game }) {
  const containerRef = useRef(null);
  const [visibleCount, setVisibleCount] = useState(game.genres.length);

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

    // Si hay más géneros que caben en la primera línea, restamos 1 para el "+n more"
    const shouldReserveMore = game.genres.length > count;
    const adjusted = shouldReserveMore ? Math.max(0, count - 1) : count;

    setVisibleCount(adjusted);
  }, [game.genres]);


  const visibleGenres = game.genres.slice(0, visibleCount);
  const hiddenCount = game.genres.length - visibleCount;

  return (
    <div className="
      flex flex-col
      bg-gradient-to-br from-gray-800 to-gray-900
      w-100 rounded-lg overflow-hidden shadow-lg
    ">
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
  );
}

export default GameCard;
