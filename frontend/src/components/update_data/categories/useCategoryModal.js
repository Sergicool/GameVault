import { useState } from 'react';

export function useCategoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState({ name: '', originalName: null });

  const openCreate = () => {
    setValue({ name: '', originalName: null });
    setIsOpen(true);
  };

  const openEdit = (category) => {
    setValue({ name: category.name, originalName: category.name });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, value, setValue, openCreate, openEdit, close };
}
