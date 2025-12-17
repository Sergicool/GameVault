import { Pencil, Trash2 } from 'lucide-react';

export default function YearItem({ year, onDelete }) {
  return (
    <li className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between shadow transition hover:shadow-md">
      <span className="font-semibold text-gray-800">{year.year}</span>
      <div className="flex gap-2">
        {/* Delete */}
        <button
          disabled={year.inUse}
          onClick={onDelete}
          className={`
            p-1 rounded transition
            ${year.inUse
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-red-100 active:bg-red-200'}
          `}
          title={year.inUse ? 'Year in use' : 'Delete year'}
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </li>
  );
}
