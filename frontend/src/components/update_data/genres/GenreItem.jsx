import { Pencil, Trash2 } from 'lucide-react';

export default function GenreItem({ genre, onEdit, onDelete }) {
  return (
    <li
      className="bg-gray-50 rounded-lg px-3 py-2 flex justify-between items-center
                 shadow transition hover:shadow-md"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-5 h-5 rounded-full border border-gray-300"
          style={{ backgroundColor: genre.color }}
        />
        <span className="font-semibold text-gray-800">
          {genre.name}
        </span>
      </div>

      <div className="flex gap-1">
        <button
          onClick={onEdit}
          className="p-1 rounded transition hover:bg-blue-100 active:bg-blue-200"
          title="Edit genre"
        >
          <Pencil className="w-4 h-4 text-blue-600" />
        </button>

        <button
          disabled={genre.inUse}
          onClick={onDelete}
          className={`
            p-1 rounded transition
            ${genre.inUse
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-red-100 active:bg-red-200'}
          `}
          title={genre.inUse ? 'Genre in use' : 'Delete genre'}
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </li>
  );
}
