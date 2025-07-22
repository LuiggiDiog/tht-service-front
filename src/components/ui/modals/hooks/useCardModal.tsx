import { ReactNode, useCallback, useState } from 'react';
import { ColorButtonKey } from '../../ui.types';
import CardBoxModal from '../components/CardBoxModal';

// Definición de la configuración mínima para el modal
export interface ModalConfig {
  title: string;
  buttonColor: ColorButtonKey;
  buttonLabel: string;
  buttonCancelLabel?: string;
  type?: string;
  children: ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
}

const useCardModal = () => {
  const [config, setConfig] = useState<ModalConfig | null>(null);

  // Abre el modal estableciendo su configuración
  const openModal = useCallback((config: ModalConfig) => {
    setConfig(config);
  }, []);

  // Cierra el modal limpiando la configuración
  const closeModal = useCallback(() => {
    setConfig(null);
  }, []);

  // Componente memoizado que renderiza el modal cuando la configuración esté definida
  const Modal = useCallback(() => {
    if (!config) return null;

    // Al confirmar o cancelar, se ejecuta la acción y se cierra el modal
    const handleConfirm = () => {
      config.onConfirm();
      closeModal();
    };

    const handleCancel = () => {
      if (config.onCancel) {
        config.onCancel();
      }
      closeModal();
    };

    return (
      <CardBoxModal
        title={config.title}
        buttonColor={config.buttonColor}
        buttonLabel={config.buttonLabel}
        buttonCancelLabel={config.buttonCancelLabel}
        type={config.type}
        isActive={true}
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      >
        {config.children}
      </CardBoxModal>
    );
  }, [config, closeModal]);

  return { openModal, closeModal, Modal };
};

export default useCardModal;
