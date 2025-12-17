import CategoryItem from './CategoryItem';

export default function CategoryList({ categories, onEdit, onDelete }) {
  return (
    <ul className="space-y-2">
      {categories.map((category) => (
        <CategoryItem
          key={category.name}
          category={category}
          onEdit={() => onEdit(category)}
          onDelete={() => onDelete(category.name)}
        />
      ))}
    </ul>
  );
}
