import YearItem from './YearItem';

export default function YearList({ years, onDelete }) {
  return (
    <ul className="space-y-2">
      {years.map((year) => (
        <YearItem
          key={year.year}
          year={year}
          onDelete={() => onDelete(year.year)}
        />
      ))}
    </ul>
  );
}
