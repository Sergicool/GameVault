import { HexColorPicker } from 'react-colorful';

export default function EditItemModal({
  isOpen,
  title,
  value,
  setValue,
  hasColor = false,
  onClose,
  onSave
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="border-2 border-purple-600 bg-white rounded-2xl p-6 w-80 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          {title}
        </h3>

        <div className="flex flex-col gap-4">
          <input
            value={value.name}
            onChange={(e) => setValue({ ...value, name: e.target.value })}
            placeholder="Name"
            className="px-3 py-2 rounded-lg border border-gray-300
                       text-gray-800 font-medium
                       focus:outline-none focus:ring-2 focus:ring-purple-400"
            autoFocus
          />

          {hasColor && (
            <div className="flex justify-center">
              <HexColorPicker
                color={value.color}
                onChange={(color) =>
                  setValue({ ...value, color })
                }
              />
            </div>
          )}

          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg font-semibold
                         bg-gray-200 text-gray-700
                         hover:bg-gray-300 active:bg-gray-400 transition"
            >
              Cancel
            </button>

            <button
              onClick={onSave}
              className="px-4 py-2 rounded-lg font-semibold
                         bg-purple-600 text-white
                         hover:bg-purple-700 active:bg-purple-800 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
