import EditItemModal from './EditItemModal';

export default function TierModal({ modal, onSave }) {
  return (
    <EditItemModal
      isOpen={modal.open}
      title={modal.value.originalName ? 'Edit tier' : 'New tier'}
      value={modal.value}
      setValue={modal.setValue}
      hasColor
      onClose={() => modal.setOpen(false)}
      onSave={onSave}
    />
  );
}
