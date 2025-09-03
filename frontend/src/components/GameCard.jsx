import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getGameByName } from '../api/games';
import { Monitor, Smartphone, Gamepad, Laptop } from "lucide-react";

const platformIcons = {
  PC: <Monitor className="w-4 h-4 inline-block mr-1" />,
  Mobile: <Smartphone className="w-4 h-4 inline-block mr-1" />,
  Console: <Gamepad className="w-4 h-4 inline-block mr-1" />,
};

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
        <h4 className="text-lg font-semibold mb-1">{parentGame.name}</h4>
        <p className="text-sm text-gray-400">
          {parentGame.year} · {parentGame.origin} · {parentGame.platform} · {parentGame.category} - {parentGame.subcategory}
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

function GameModal({ game, onClose }) {
  const navigate = useNavigate();

  if (!game) return null;

  // Excluir imagen por tamaño
  const handleEdit = () => {
    navigate("/AddGame", { 
      state: { 
        editingGame: {
          name: game.name,
          year: game.year,
          origin: game.origin,
          platform: game.platform,
          category: game.category,
          subcategory: game.subcategory,
          tier: game.tier,
          extension_of: game.extension_of,
          genres: game.genres?.map(g => ({ name: g.name, color: g.color })) || [],
          imagePreview: game.imagePreview // solo la URL
        }
      } 
    });
  };

  return (
    <div
      className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[50rem] h-[46rem] 
                  bg-gradient-to-bl from-slate-950 via-indigo-950 to-slate-950 text-white rounded-2xl 
                  shadow-[0_8px_15px_-3px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden border border-white/15"
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
              onClick={onClose}
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
            <h2 className="text-4xl font-bold text-center mb-6 text-gray-100 tracking-wide drop-shadow-md">
              {game.name}
            </h2>

            {/* Subtítulo */}
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <span className="bg-zinc-700 border-2 border-zinc-600 text-gray-200 text-sm font-semibold px-3 py-1 rounded-md">
                🗓 Played in {game.year}
              </span>
              <span className="bg-zinc-700 border-2 border-zinc-600 text-gray-200 text-sm font-semibold px-3 py-1 rounded-md">
                🌍 {game.origin} game
              </span>
              <span className="bg-zinc-700 border-2 border-zinc-600 text-gray-200 text-sm font-semibold px-3 py-1 rounded-md">
                {platformIcons[game.platform] || <Laptop className="w-4 h-4 inline-block mr-1" />}
                {game.platform}
              </span>
              <span className="bg-zinc-700 border-2 border-zinc-600 text-gray-200 text-sm font-semibold px-3 py-1 rounded-md">
                🏷 {game.category}
                {game.subcategory && ` - ${game.subcategory}`}
              </span>
            </div>

            {/* Géneros */}
            {game.genres?.length > 0 && (
              <div className="mt-2 w-full max-w-3xl">
                <p className="mb-2 text-lg text-center font-semibold text-gray-400 uppercase tracking-wide px-2">
                  Genres
                </p>
                <div className="bg-zinc-800 border-2 border-zinc-600 rounded-lg p-3">
                  <div className="flex flex-wrap justify-center gap-2">
                    {game.genres.map((g, i) => {
                      const textColor = isColorDark(g.color) ? "white" : "black";
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
              <div className="w-full max-w-3xl mt-4 bg-zinc-800 border-2 border-zinc-600 p-4 rounded-xl">
                <p className="text-md text-gray-400 italic mb-2">
                  This game is an extension of:
                </p>
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
  );
}

function GameCard({ game, expandible = false, inTierList = false, inLeaderboard = false })  {
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

  const closeModal = () => setIsExpanded(false);

  const handleEdit = () => {
    navigate('/AddGame', { state: { editingGame: game } });
  };

  if (inLeaderboard) {
    let bgClass =
    "bg-gradient-to-r from-gray-800 via-slate-700 to-gray-800 shadow-md"; // default oscuro

    if (game.position === 0) {
      bgClass =
        "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-700 " +
        "border-2 border-yellow-400/70 " +
        "shadow-[0_0_15px_rgba(202,138,4,0.7),0_0_30px_rgba(234,179,8,0.6),0_0_45px_rgba(250,204,21,0.4)] " +
        "hover:border-yellow-300 hover:shadow-[0_0_20px_rgba(202,138,4,0.9),0_0_40px_rgba(234,179,8,0.8),0_0_60px_rgba(250,204,21,0.6)]";
    } else if (game.position === 1) {
      bgClass =
        "bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 " +
        "border-2 border-gray-300/60 " +
        "shadow-[0_0_15px_rgba(156,163,175,0.6),0_0_30px_rgba(209,213,219,0.4)] " +
        "hover:border-gray-200 hover:shadow-[0_0_20px_rgba(156,163,175,0.8),0_0_40px_rgba(209,213,219,0.6)]";
    } else if (game.position === 2) {
      bgClass =
        "bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 " +
        "border-2 border-[#b86a2f] " +
        "shadow-[0_0_15px_rgba(180,83,9,0.7),0_0_30px_rgba(245,158,11,0.5)] " +
        "hover:border-amber-400 hover:shadow-[0_0_20px_rgba(180,83,9,0.9),0_0_40px_rgba(245,158,11,0.7)]";
    } else if (game.position < 10) {
      bgClass =
        "bg-gradient-to-r from-indigo-600 via-purple-500 to-purple-700 " +
        "border-2 border-purple-400/60 " +
        "shadow-[0_0_12px_rgba(139,92,246,0.6),0_0_25px_rgba(236,72,153,0.4)] " +
        "hover:border-pink-400 hover:shadow-[0_0_18px_rgba(139,92,246,0.8),0_0_35px_rgba(236,72,153,0.6)]";
    } else {
      bgClass =
        "bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 " +
        "border border-slate-600 " +
        "shadow-[0_0_6px_rgba(0,0,0,0.4)] hover:border-slate-400/70 hover:shadow-[0_0_12px_rgba(100,116,139,0.4)]";
    }

    return (
      <>
        <div
          className={`flex items-center justify-between ${bgClass} 
                    text-white rounded-xl px-4 py-3 mb-3 
                    hover:scale-[1.02] transition cursor-pointer`}
          onClick={openModal}
        >
          {/* Posición */}
          <div className="text-2xl font-bold text-gray-100 w-12 text-center mr-4">
            #{game.position + 1}
          </div>

          {/* Imagen */}
          <div className="w-30 h-14 rounded-md overflow-hidden flex-shrink-0">
            {game.imagePreview ? (
              <img
                src={game.imagePreview}
                alt={game.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-700 text-sm text-gray-400">
                No Img
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 ml-4">
            <h3 className="text-lg font-semibold truncate">{game.name}</h3>
            <p className="text-sm text-gray-200">
              {game.year} · {game.origin} · {game.platform} · {game.category}{" "}
              {game.subcategory && `- ${game.subcategory}`}
            </p>
          </div>
        </div>

        {isExpanded && <GameModal game={game} onClose={closeModal} />}
      </>
    );
  }

  return (
    <>
      {inTierList && (
        <div className={`w-[10rem] rounded overflow-hidden shadow-lg bg-gradient-to-br from-gray-700 via-gray-500 to-gray-700 ${
            expandible ? 'transition-transform duration-200 cursor-pointer hover:scale-[1.05]' : ''
          }`}
          onClick={openModal}
        >
          <img className="w-[10rem] h-16 object-cover" src={game.imagePreview} alt={game.name} />
          <div className="px-2 py-1 text-white text-sm text-center truncate">{game.name}</div>
        </div>
      )}

      {!inTierList && (
        <div
          className={`flex flex-col transition-transform duration-200 
            bg-gradient-to-b from-slate-900 via-indigo-900 to-slate-950 w-[400px] rounded-lg overflow-hidden 
            ${expandible ? 'cursor-pointer hover:scale-[1.1]' : ''} 
            shadow-[0_8px_15px_-3px_rgba(0,0,0,0.6)] border border-slate-100/15`}
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

      {expandible && isExpanded && <GameModal game={game} onClose={closeModal} />}
    </>
  );
}

export default GameCard;
