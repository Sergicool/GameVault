import PlatformItem from './PlatformItem';

export default function PlatformList({ platforms, onEdit, onDelete }) {
  return (
    <ul className="space-y-2">
      {platforms.map((platform) => (
        <PlatformItem
          key={platform.name}
          platform={platform}
          onEdit={() => onEdit(platform)}
          onDelete={() => onDelete(platform.name)}
        />
      ))}
    </ul>
  );
}
