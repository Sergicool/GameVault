import { useState } from 'react';

export function useGenreModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    color: '#0ea5e9',
    originalName: null,
  });

  const openCreate = () => {
    setForm({
      name: '',
      color: '#0ea5e9',
      originalName: null,
    });
    setIsOpen(true);
  };

  const openEdit = (genre) => {
    setForm({
      name: genre.name,
      color: genre.color,
      originalName: genre.name,
    });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return {
    isOpen,
    form,
    setForm,
    openCreate,
    openEdit,
    close,
  };
}
