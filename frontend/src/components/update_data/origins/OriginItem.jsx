import { Pencil, Trash2 } from 'lucide-react';

export default function OriginItem({ origin, onEdit, onDelete }) {
  return (
    <li className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between shadow transition hover:shadow-md">
      <span className="font-semibold text-gray-800 flex-1">{origin.name}</span>
      <div className="flex gap-2">
        {/* Edit */}
        <button
          onClick={onEdit}
          className="p-1 rounded transition hover:bg-blue-100 active:bg-blue-200"
          title="Edit origin"
        >
          <Pencil className="w-4 h-4 text-blue-600" />
        </button>

        {/* Delete */}
        <button
          disabled={origin.inUse}
          onClick={onDelete}
          className={`
            p-1 rounded transition
            ${origin.inUse
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-red-100 active:bg-red-200'}
          `}
          title={origin.inUse ? 'Origin in use' : 'Delete origin'}
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </li>
  );
}
