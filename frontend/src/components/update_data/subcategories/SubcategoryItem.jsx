import { Pencil, Trash2 } from 'lucide-react';

export default function SubcategoryItem({ subcategory, onEdit, onDelete }) {
  return (
    <li className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between shadow transition hover:shadow-md">
      <span className="flex-1 font-semibold text-gray-800">
        {subcategory.name} <span className="text-xs text-gray-500">({subcategory.category})</span>
      </span>
      <div className="flex gap-2">
        {/* Edit */}
        <button
          onClick={onEdit}
          className="p-1 rounded transition hover:bg-blue-100 active:bg-blue-200"
          title="Edit subcategory"
        >
          <Pencil className="w-4 h-4 text-blue-600" />
        </button>

        {/* Delete */}
        <button
          disabled={subcategory.inUse}
          onClick={onDelete}
          className={`
            p-1 rounded transition
            ${subcategory.inUse
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-red-100 active:bg-red-200'}
          `}
          title={subcategory.inUse ? 'Subcategory in use' : 'Delete subcategory'}
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </li>
  );
}
