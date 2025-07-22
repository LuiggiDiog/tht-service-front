import { useCallback, useState } from 'react';
import { ColorButtonKey } from '../../ui.types';
import ConfirmationModal from '../components/ConfirmationModal';

interface UseConfirmationDeleteModalConfig {
  onConfirm: () => void;
  message?: string;
  title?: string;
  buttonColor?: ColorButtonKey;
  buttonLabel?: string;
  buttonCancelLabel?: string;
}

const useConfirmationDeleteModal = () => {
  // Si config es null, el modal se considera cerrado.
  const [config, setConfig] = useState<UseConfirmationDeleteModalConfig | null>(
    null
  );

  // Abre el modal estableciendo la configuración.
  const openModal = useCallback((cfg: UseConfirmationDeleteModalConfig) => {
    setConfig(cfg);
  }, []);

  // Cierra el modal limpiando la configuración.
  const closeModal = useCallback(() => {
    setConfig(null);
  }, []);

  // Componente que renderiza el ConfirmationModal si hay configuración activa.
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
        message={config.message || '¿Estás seguro de eliminar este registro?'}
        title={config.title || 'Eliminar Registro'}
        buttonColor={config.buttonColor || 'danger'}
        buttonLabel={config.buttonLabel || 'Eliminar'}
        buttonCancelLabel={config.buttonCancelLabel || 'Cancelar'}
      />
    );
  };

  return { openModal, closeModal, Modal };
};

export default useConfirmationDeleteModal;
