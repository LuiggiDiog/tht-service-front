import { useCallback, useState } from 'react';
import { ColorButtonKey } from '../../ui.types';
import ConfirmationModal from '../components/ConfirmationModal';

interface UseConfirmationModalConfig {
  onConfirm: () => void;
  message: string;
  title?: string;
  buttonColor?: ColorButtonKey;
  buttonLabel?: string;
  buttonCancelLabel?: string;
}

const useConfirmationModal = () => {
  // Si config es null, el modal está cerrado.
  const [config, setConfig] = useState<UseConfirmationModalConfig | null>(null);

  // Abre el modal estableciendo su configuración.
  const openModal = useCallback((cfg: UseConfirmationModalConfig) => {
    setConfig(cfg);
  }, []);

  // Cierra el modal limpiando la configuración.
  const closeModal = useCallback(() => {
    setConfig(null);
  }, []);

  // Componente que renderiza el ConfirmationModal cuando la configuración está activa.
  const Modal = () => {
    if (!config) return null;

    return (
      <ConfirmationModal
        isActive={true}
        onConfirm={() => {
          config.onConfirm();
          closeModal();
        }}
        onCancel={closeModal}
        message={config.message}
        title={config.title}
        buttonColor={config.buttonColor}
        buttonLabel={config.buttonLabel}
        buttonCancelLabel={config.buttonCancelLabel}
      />
    );
  };

  return { openModal, closeModal, Modal };
};

export default useConfirmationModal;
