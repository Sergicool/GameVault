import GenreItem from './GenreItem';

export default function GenreList({ genres, onEdit, onDelete }) {
  return (
    <ul className="space-y-2">
      {genres.map((genre) => (
        <GenreItem
          key={genre.name}
          genre={genre}
          onEdit={() => onEdit(genre)}
          onDelete={() => onDelete(genre.name)}
        />
      ))}
    </ul>
  );
}
