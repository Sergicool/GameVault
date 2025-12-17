import { Pencil, Trash2 } from 'lucide-react';

export default function SubcategoryItem({ subcategory, onEdit, onDelete }) {
  return (
    <li className="bg-gray-50 rounded-lg px-3 py-2 flex items-center justify-between shadow transition hover:shadow-md">
      <span className="flex-1 font-medium text-gray-800">
        {subcategory.name} <span className="text-xs text-gray-500">({subcategory.category})</span>
      </span>
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="text-blue-500 hover:text-blue-700 p-1 rounded transition"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={onDelete}
          disabled={subcategory.inUse}
          className={`p-1 rounded transition ${subcategory.inUse ? 'text-gray-300 cursor-not-allowed' : 'text-red-500 hover:text-red-700'}`}
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}
