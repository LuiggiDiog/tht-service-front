import { useCardModal } from '@/components/ui/modals';

export default function Dashboard() {
  const { openModal, Modal } = useCardModal();

  // Función para abrir el modal con la configuración deseada
  const handleOpenModal = () => {
    openModal({
      title: 'Título del Modal',
      buttonColor: 'success', // Asegúrate de que 'primary' sea un valor válido para ColorButtonKey
      buttonLabel: 'Confirmar',
      buttonCancelLabel: 'Cancelar',
      // Aquí defines el contenido que se mostrará dentro del modal
      children: <p>Este es el contenido del modal</p>,
      onConfirm: () => {
        console.log('Acción confirmada');
      },
      onCancel: () => {
        console.log('Acción cancelada');
      },
    });
  };

  return (
    <div>
      <button onClick={handleOpenModal}>Abrir Modal</button>
      <Modal />
    </div>
  );
}
