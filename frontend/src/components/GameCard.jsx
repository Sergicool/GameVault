import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGameByName } from "../api/games";
import {
  Monitor,
  Smartphone,
  Gamepad,
  Calendar,
  Globe,
  Laptop,
  Tag,
  Trophy,
} from "lucide-react";

/* Iconos Constantes */
const platformIcons = {
  PC: <Monitor className="mr-1 inline-block h-4 w-4" />,
  Mobile: <Smartphone className="mr-1 inline-block h-4 w-4" />,
  Console: <Gamepad className="mr-1 inline-block h-4 w-4" />,
};

/**
 * Determina si un color HEX es oscuro
 */
function isColorDark(hexColor) {
  const hex = hexColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
  return luminance < 128;
}

// ------------------ Estilos de posición tipo Leaderboard ------------------
function getLeaderboardBg(displayIndex, isModal = false) {
  if (displayIndex === 1) {
    return isModal
      ? "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-700 border-2 border-yellow-400/70 shadow-[0_0_15px_rgba(202,138,4,0.7),0_0_30px_rgba(234,179,8,0.6),0_0_45px_rgba(250,204,21,0.4)]"
      : "bg-gradient-to-r from-yellow-600 via-yellow-500 to-yellow-700 border-2 border-yellow-400/70 shadow-[0_0_15px_rgba(202,138,4,0.7),0_0_30px_rgba(234,179,8,0.6),0_0_45px_rgba(250,204,21,0.4)] hover:border-yellow-300 hover:shadow-[0_0_20px_rgba(202,138,4,0.9),0_0_40px_rgba(234,179,8,0.8),0_0_60px_rgba(250,204,21,0.6)]";
  } else if (displayIndex === 2) {
    return isModal
      ? "bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 border-2 border-gray-300/60 shadow-[0_0_15px_rgba(156,163,175,0.6),0_0_30px_rgba(209,213,219,0.4)]"
      : "bg-gradient-to-r from-gray-500 via-gray-400 to-gray-600 border-2 border-gray-300/60 shadow-[0_0_15px_rgba(156,163,175,0.6),0_0_30px_rgba(209,213,219,0.4)] hover:border-gray-200 hover:shadow-[0_0_20px_rgba(156,163,175,0.8),0_0_40px_rgba(209,213,219,0.6)]";
  } else if (displayIndex === 3) {
    return isModal
      ? "bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 border-2 border-[#b86a2f] shadow-[0_0_15px_rgba(180,83,9,0.7),0_0_30px_rgba(245,158,11,0.5)]"
      : "bg-gradient-to-r from-amber-700 via-amber-600 to-amber-800 border-2 border-[#b86a2f] shadow-[0_0_15px_rgba(180,83,9,0.7),0_0_30px_rgba(245,158,11,0.5)] hover:border-amber-400 hover:shadow-[0_0_20px_rgba(180,83,9,0.9),0_0_40px_rgba(245,158,11,0.7)]";
  } else if (displayIndex <= 20) {
    return isModal
      ? "bg-gradient-to-r from-indigo-600 via-purple-500 to-purple-700 border-2 border-purple-400/60 shadow-[0_0_12px_rgba(139,92,246,0.6),0_0_25px_rgba(236,72,153,0.4)]"
      : "bg-gradient-to-r from-indigo-600 via-purple-500 to-purple-700 border-2 border-purple-400/60 shadow-[0_0_12px_rgba(139,92,246,0.6),0_0_25px_rgba(236,72,153,0.4)] hover:border-pink-400 hover:shadow-[0_0_18px_rgba(139,92,246,0.8),0_0_35px_rgba(236,72,153,0.6)]";
  } else {
    return isModal
      ? "bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 border border-slate-600 shadow-[0_0_6px_rgba(0,0,0,0.4)]"
      : "bg-gradient-to-r from-gray-900 via-slate-800 to-gray-900 border border-slate-600 shadow-[0_0_6px_rgba(0,0,0,0.4)] hover:border-slate-400/70 hover:shadow-[0_0_12px_rgba(100,116,139,0.4)]";
  }
}

/* -------------------- Componentes Secundarios -------------------- */

/**
 * Muestra información del juego base si el juego es una extensión
 */
function ExtensionContent({ gameName }) {
  const [parentGame, setParentGame] = useState(null);

  useEffect(() => {
    const fetchParentGame = async () => {
      try {
        const data = await getGameByName(gameName);
        setParentGame(data);
      } catch (err) {
        console.error("Error al obtener juego base:", err);
      }
    };

    fetchParentGame();
  }, [gameName]);

  if (!parentGame) return <p className="text-gray-500">Loading base game...</p>;

  return (
    <div className="flex items-center gap-4">
      <div className="h-20 w-40 flex-shrink-0 overflow-hidden rounded bg-gray-700">
        <img
          src={`http://localhost:3001/game-image/${encodeURIComponent(parentGame.name)}`}
          alt={parentGame.name}
          className="h-full w-full object-cover"
        />
      </div>
      <div>
        <h4 className="mb-1 text-lg font-semibold">{parentGame.name}</h4>
        <p className="text-sm text-gray-400">
          {parentGame.year} · {parentGame.origin} · {parentGame.platform} ·{" "}
          {parentGame.category} - {parentGame.subcategory}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- */
/*                         Modal de Juego                         */
/* -------------------------------------------------------------- */

function GameModal({ game, onClose }) {
  useEffect(() => {
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = original;
    };
  }, []);

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
          genres:
            game.genres?.map((g) => ({ name: g.name, color: g.color })) || [],
          imagePreview: game.imagePreview, // solo la URL
        },
      },
    });
  };

  const positionBgClass = getLeaderboardBg(game.position + 1, true);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      onClick={onClose}
    >
      <div
        className="
          relative flex max-h-[90hv] w-full max-w-4xl flex-col overflow-hidden
          rounded-sm
          bg-gradient-to-b from-indigo-900 via-indigo-950 to-indigo-900 
          text-white shadow-xl
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Imagen */}
        <div className="relative aspect-[16/7] w-full flex-shrink-0 overflow-hidden">
          {game.imagePreview ? (
            <img
              src={game.imagePreview}
              alt={game.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-indigo-800 text-indigo-200">
              No Image
            </div>
          )}
        </div>

        {/* Contenido */}
        <div className="no-scrollbar flex max-h-[60%] flex-col gap-4 overflow-y-auto p-6">
          {/* Título */}
          <h2 className="text-center text-4xl font-extrabold tracking-wide text-indigo-100 drop-shadow-md">
            {game.name}
          </h2>

          {/* Tier y posición */}
          {game.tier && (
            <div className="flex flex-wrap justify-center gap-4">
              {game.position !== undefined && (
                <div className="group-hover-none">
                  <div
                    className={`flex items-center gap-1 rounded-full px-4 py-1 text-sm font-semibold ${positionBgClass}`}
                  >
                    <Trophy size={16} />
                    <span>#{game.position + 1}</span>
                  </div>
                </div>
              )}
              <div
                className="rounded-full px-4 py-1 text-sm font-semibold shadow"
                style={{
                  backgroundColor: game.tierColor || "#4f46e5",
                  color: isColorDark(game.tierColor || "#4f46e5")
                    ? "white"
                    : "black",
                }}
              >
                {game.tier}
              </div>
            </div>
          )}

          {/* Etiquetas principales */}
          <div className="flex flex-wrap justify-center gap-3 text-sm text-indigo-200">
            <div className="flex items-center gap-1 rounded-md bg-indigo-800 px-3 py-1">
              <Calendar size={16} />
              {game.year}
            </div>
            <div className="flex items-center gap-1 rounded-md bg-indigo-800 px-3 py-1">
              <Globe size={16} />
              {game.origin}
            </div>
            <div className="flex items-center gap-1 rounded-md bg-indigo-800 px-3 py-1">
              <Laptop size={16} />
              {game.platform}
            </div>
            <div className="flex items-center gap-1 rounded-md bg-indigo-800 px-3 py-1">
              <Tag size={16} />
              {game.category}
              {game.subcategory && ` - ${game.subcategory}`}
            </div>
          </div>

          {/* Géneros */}
          {game.genres?.length > 0 && (
            <div className="mt-2 w-full rounded-lg border border-indigo-700 bg-indigo-950 p-4">
              <p className="mb-2 text-center text-sm font-semibold text-indigo-300 uppercase">
                Genres
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {game.genres.map((g, i) => (
                  <span
                    key={i}
                    className="rounded-full px-3 py-1 text-sm font-semibold"
                    style={{
                      backgroundColor: g.color,
                      color: isColorDark(g.color) ? "white" : "black",
                    }}
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Extensión del juego */}
          {game.extension_of && (
            <div className="rounded-lg border border-indigo-700 bg-indigo-950 p-4">
              <p className="mb-2 text-sm text-indigo-400 italic">
                This game is an extension of:
              </p>
              <ExtensionContent gameName={game.extension_of} />
            </div>
          )}

          {/* Botón Editar discreto */}
          <div className="flex justify-end">
            <button
              onClick={handleEdit}
              className="rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
            >
              Edit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------- */
/*                      Componente Principal                      */
/* -------------------------------------------------------------- */

function GameCard({
  game,
  expandible = false,
  inTierList = false,
  inLeaderboard = false,
  displayIndex,
}) {
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
    navigate("/AddGame", { state: { editingGame: game } });
  };

  /* -------------------- Leaderboard -------------------- */
  if (inLeaderboard) {
    const bgClass = getLeaderboardBg(displayIndex, false);

    return (
      <>
        <div
          className={`flex items-center justify-between ${bgClass} mb-3 cursor-pointer rounded-xl px-4 py-3 text-white transition hover:scale-[1.02]`}
          onClick={openModal}
        >
          <div className="mr-4 w-12 text-center text-2xl font-bold text-gray-100">
            #{displayIndex}
          </div>
          <div className="h-14 w-30 flex-shrink-0 overflow-hidden rounded-md">
            {game.imagePreview ? (
              <img
                src={game.imagePreview}
                alt={game.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                No Img
              </div>
            )}
          </div>
          <div className="ml-4 flex-1">
            <h3 className="truncate text-lg font-semibold">{game.name}</h3>
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
    /* -------------------- Card View -------------------- */
    <>
      {inTierList && (
        <div
          className={`w-[10rem] overflow-hidden rounded bg-gradient-to-br from-gray-700 via-gray-500 to-gray-700 shadow-lg ${
            expandible
              ? "cursor-pointer transition-transform duration-200 hover:scale-[1.05]"
              : ""
          }`}
          onClick={openModal}
        >
          <img
            className="h-16 w-[10rem] object-cover"
            src={game.imagePreview}
            alt={game.name}
          />
          <div className="truncate px-2 py-1 text-center text-sm text-white">
            {game.name}
          </div>
        </div>
      )}

      {!inTierList && (
        <div
          className={`
            relative flex w-[400px] flex-col
            transition-all duration-300 ease-out
            shadow-[var(--shadow-theme-gamecard)]
            bg-gradient-to-tr from-theme-gamecard-bg-1 to-theme-gamecard-bg-2
            ${expandible ? "cursor-pointer" : ""}

            hover:-translate-y-1 hover:rotate-x-[6deg] hover:rotate-y-[4deg]
            transform-gpu

            before:absolute before:inset-0
            before:bg-[linear-gradient(-135deg,rgba(255,255,255,0.2)_0%,rgba(255,255,255,0.15)_20%,rgba(255,255,255,0.1)_40%,transparent_80%)]
            before:opacity-0 before:transition-all before:duration-300
            hover:before:opacity-100
          `}
          onClick={openModal}
        >
          <div className="flex h-48 items-center justify-center">
            {game.imagePreview ? (
              <img
                src={game.imagePreview}
                alt={game.name}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="text-theme-gamecard-noimage-text">No Image</span>
            )}
            {game.tier && (
              <div
                className="absolute bottom-0 left-1/2 min-w-[5rem] -translate-x-1/2 translate-y-1/2 transform rounded-sm px-1 text-center text-sm font-semibold text-white"
                style={{
                  backgroundColor: game.tierColor,
                  color: isColorDark(game.tierColor) ? "white" : "black",
                }}
              >
                {game.tier}
              </div>
            )}
          </div>
        </div>
      )}

      {expandible && isExpanded && (
        <GameModal game={game} onClose={closeModal} />
      )}
    </>
  );
}

export default GameCard;
