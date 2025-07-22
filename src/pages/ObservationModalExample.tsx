import { useObservationModal } from '@/components/ui/modals';

export default function Dashboard() {
  const { openModal, Modal } = useObservationModal();

  const handleObservationConfirm = (observation: string) => {
    console.log('Observación ingresada:', observation);
    // Aquí puedes ejecutar la lógica correspondiente al cambio de estado
  };

  const handleOpenModal = () => {
    openModal({
      onConfirm: handleObservationConfirm,
      title: 'Cambio de Estado',
      buttonColor: 'success', // Asegúrate de que 'primary' sea un valor válido para ColorButtonKey
    });
  };

  return (
    <>
      <button onClick={handleOpenModal}>Abrir Modal de Observación</button>
      {/* Se renderiza el modal únicamente si está activo */}
      <Modal />
    </>
  );
}
