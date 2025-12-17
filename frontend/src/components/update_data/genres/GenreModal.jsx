import { HexColorPicker } from 'react-colorful';

export default function GenreModal({
  isOpen,
  form,
  setForm,
  onClose,
  onSave
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          {form.originalName ? 'Edit genre' : 'New genre'}
        </h3>

        <div className="flex flex-col gap-4">
          <input
            value={form.name}
            onChange={(e) =>
              setForm({ ...form, name: e.target.value })
            }
            placeholder="Genre name"
            className="px-3 py-2 rounded-lg border border-gray-300
                       font-medium text-gray-800
                       focus:outline-none focus:ring-2 focus:ring-cyan-400"
            autoFocus
          />

          <div className="flex justify-center">
            <HexColorPicker
              color={form.color}
              onChange={(color) =>
                setForm({ ...form, color })
              }
            />
          </div>

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
                         bg-cyan-600 text-white
                         hover:bg-cyan-700 active:bg-cyan-800 transition"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
