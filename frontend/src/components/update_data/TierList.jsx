import TierItem from './TierItem';

export default function TierList({
  tiers,
  onEdit,
  onDelete,
  onMoveUp,
  onMoveDown
}) {
  return (
    <ul className="space-y-2">
      {tiers.map((tier, index) => (
        <TierItem
          key={tier.name}
          tier={tier}
          index={index}
          total={tiers.length}
          onEdit={() => onEdit(tier)}
          onDelete={() => onDelete(tier.name)}
          onMoveUp={() => onMoveUp(index)}
          onMoveDown={() => onMoveDown(index)}
        />
      ))}
    </ul>
  );
}
