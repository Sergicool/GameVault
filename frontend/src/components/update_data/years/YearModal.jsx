export default function YearModal({ isOpen, value, setValue, onClose, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="border-2 border-pink-600 bg-white rounded-2xl p-6 w-72 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          {value.originalName ? 'Edit Year' : 'New Year'}
        </h3>

        <input
          type="text"
          placeholder="Year"
          value={value.year}
          onChange={(e) => setValue({ ...value, year: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-300"
          autoFocus
        />

        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg font-semibold bg-gray-200 text-gray-700 hover:bg-gray-300 active:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className="px-4 py-2 rounded-lg font-semibold bg-pink-600 text-white hover:bg-pink-700 active:bg-pink-800 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
