import { useState } from 'react';

export function useTierModal(defaultColor = null) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState({
    name: '',
    color: defaultColor,
    originalName: null
  });

  const openCreate = () => {
    setValue({
      name: '',
      color: defaultColor,
      originalName: null
    });
    setOpen(true);
  };

  const openEdit = (item) => {
    setValue({
      name: item.name,
      color: item.color ?? defaultColor,
      originalName: item.name
    });
    setOpen(true);
  };

  return {
    open,
    setOpen,
    value,
    setValue,
    openCreate,
    openEdit
  };
}
