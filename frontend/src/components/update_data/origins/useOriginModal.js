import { useState } from 'react';

export function useOriginModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState({ name: '', originalName: null });

  const openCreate = () => {
    setValue({ name: '', originalName: null });
    setIsOpen(true);
  };

  const openEdit = (origin) => {
    setValue({ name: origin.name, originalName: origin.name });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, value, setValue, openCreate, openEdit, close };
}
