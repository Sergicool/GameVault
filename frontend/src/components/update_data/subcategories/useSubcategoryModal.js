import { useState } from 'react';

export function useSubcategoryModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState({ name: '', category: '', originalName: null });

  const openCreate = () => {
    setValue({ name: '', category: '', originalName: null });
    setIsOpen(true);
  };

  const openEdit = (subcategory) => {
    setValue({ name: subcategory.name, category: subcategory.category, originalName: subcategory.name });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, value, setValue, openCreate, openEdit, close };
}
