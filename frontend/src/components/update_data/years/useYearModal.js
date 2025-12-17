import { useState } from 'react';

export function useYearModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState({ year: '', originalName: null });

  const openCreate = () => {
    setValue({ year: '', originalName: null });
    setIsOpen(true);
  };

  const openEdit = (year) => {
    setValue({ year: year.year, originalName: year.year });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, value, setValue, openCreate, openEdit, close };
}
