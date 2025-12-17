import { Pencil, Trash2 } from 'lucide-react';

export default function PlatformItem({ platform, onEdit, onDelete }) {
  return (
    <li className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between shadow transition hover:shadow-md">
      <span className="font-semibold text-gray-800 flex-1">{platform.name}</span>
      <div className="flex gap-2">
         {/* Edit */}
        <button
          onClick={onEdit}
          className="p-1 rounded transition hover:bg-blue-100 active:bg-blue-200"
          title="Edit genre"
        >
          <Pencil className="w-4 h-4 text-blue-600" />
        </button>

        {/* Delete */}
        <button
          disabled={platform.inUse}
          onClick={onDelete}
          className={`
            p-1 rounded transition
            ${platform.inUse
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-red-100 active:bg-red-200'}
          `}
          title={platform.inUse ? 'Platform in use' : 'Delete platform'}
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </li>
  );
}
