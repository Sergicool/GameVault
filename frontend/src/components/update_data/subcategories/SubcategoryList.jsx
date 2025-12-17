import SubcategoryItem from './SubcategoryItem';

export default function SubcategoryList({ subcategories, onEdit, onDelete }) {
  return (
    <ul className="space-y-2">
      {subcategories.map((subcategory) => (
        <SubcategoryItem
          key={subcategory.name}
          subcategory={subcategory}
          onEdit={() => onEdit(subcategory)}
          onDelete={() => onDelete(subcategory.name)}
        />
      ))}
    </ul>
  );
}
