import { Pencil, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export default function TierItem({
  tier,
  index,
  total,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown
}) {
  return (
    <li className="bg-gray-50 rounded-lg px-3 py-2 flex justify-between items-center shadow
                   transition hover:shadow-md">
      <div className="flex items-center gap-3">
        <div
          className="w-5 h-5 rounded-full border border-gray-300"
          style={{ backgroundColor: tier.color }}
        />
        <span className="font-semibold text-gray-800">
          {tier.name}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {/* Move up */}
        <button
          disabled={index === 0}
          onClick={onMoveUp}
          className={`
            p-1 rounded transition
            ${index === 0
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-gray-200 active:bg-gray-300'}
          `}
          title="Move up"
        >
          <ArrowUp className="w-4 h-4 text-gray-700" />
        </button>

        {/* Move down */}
        <button
          disabled={index === total - 1}
          onClick={onMoveDown}
          className={`
            p-1 rounded transition
            ${index === total - 1
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-gray-200 active:bg-gray-300'}
          `}
          title="Move down"
        >
          <ArrowDown className="w-4 h-4 text-gray-700" />
        </button>

        {/* Edit */}
        <button
          onClick={onEdit}
          className="p-1 rounded transition hover:bg-blue-100 active:bg-blue-200"
          title="Edit tier"
        >
          <Pencil className="w-4 h-4 text-blue-600" />
        </button>

        {/* Delete */}
        <button
          disabled={tier.inUse}
          onClick={onDelete}
          className={`
            p-1 rounded transition
            ${tier.inUse
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-red-100 active:bg-red-200'}
          `}
          title={tier.inUse ? 'Tier in use' : 'Delete tier'}
        >
          <Trash2 className="w-4 h-4 text-red-600" />
        </button>
      </div>
    </li>
  );
}
