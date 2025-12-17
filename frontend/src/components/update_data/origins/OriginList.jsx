import OriginItem from './OriginItem';

export default function OriginList({ origins, onEdit, onDelete }) {
  return (
    <ul className="space-y-2">
      {origins.map((origin) => (
        <OriginItem
          key={origin.name}
          origin={origin}
          onEdit={() => onEdit(origin)}
          onDelete={() => onDelete(origin.name)}
        />
      ))}
    </ul>
  );
}
