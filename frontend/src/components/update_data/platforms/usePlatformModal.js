import { useState } from 'react';

export function usePlatformModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [value, setValue] = useState({ name: '', originalName: null });

  const openCreate = () => {
    setValue({ name: '', originalName: null });
    setIsOpen(true);
  };

  const openEdit = (platform) => {
    setValue({ name: platform.name, originalName: platform.name });
    setIsOpen(true);
  };

  const close = () => setIsOpen(false);

  return { isOpen, value, setValue, openCreate, openEdit, close };
}
