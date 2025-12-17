export default function SubcategoryModal({ isOpen, value, setValue, categories, onClose, onSave }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
          {value.originalName ? 'Edit Subcategory' : 'New Subcategory'}
        </h3>

        <select
          value={value.category}
          onChange={(e) => setValue({ ...value, category: e.target.value })}
          className="w-full mb-3 px-3 py-2 rounded-lg border border-gray-300 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {categories.length === 0 ? (
            <option disabled>No category</option>
          ) : (
            categories.map((cat) => <option key={cat.name} value={cat.name}>{cat.name}</option>)
          )}
        </select>

        <input
          type="text"
          placeholder="Subcategory name"
          value={value.name}
          onChange={(e) => setValue({ ...value, name: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-300"
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
            className="px-4 py-2 rounded-lg font-semibold bg-indigo-600 text-white hover:bg-indigo-700 active:bg-indigo-800 transition"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
