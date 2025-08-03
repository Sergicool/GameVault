import { useState } from 'react';

function GameCard({ game }) {
  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-gray-500 flex flex-col">
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
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold mb-2">{game.name || 'Nombre del juego'}</h3>
        <p className="text-gray-600 mb-1">Año: {game.year || '—'}</p>
        <p className="text-gray-600 mb-1">Origen: {game.origin || '—'}</p>
        <p className="text-gray-600 mb-1">Categoría: {game.category || '—'}</p>
        <p className="text-gray-600 mb-1">Subcategoría: {game.subcategory || '—'}</p>
        {game.extension_of && (
          <p className="text-gray-600 mb-1 italic text-sm">
            Extensión de: {game.extension_of}
          </p>
        )}
        {game.genres && game.genres.length > 0 && (
          <div className="mt-auto">
            <h4 className="font-semibold text-gray-700 mb-1">Géneros:</h4>
            <ul className="flex flex-wrap gap-2">
              {game.genres.map((g) => (
                <li
                  key={g}
                  className="bg-purple-500 text-white text-xs rounded-full px-2 py-0.5"
                >
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default GameCard;