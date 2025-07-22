import { useCallback, useState } from 'react';
import { ColorButtonKey } from '../../ui.types';
import ObservationModal from '../components/ObservationModal';

interface UseObservationModalConfig {
  onConfirm: (observation: string) => void;
  title?: string;
  buttonColor?: ColorButtonKey;
}

const useObservationModal = () => {
  // Estado para guardar la configuración del modal. Si es null, el modal está cerrado.
  const [config, setConfig] = useState<UseObservationModalConfig | null>(null);

  // Abre el modal estableciendo su configuración
  const openModal = useCallback((cfg: UseObservationModalConfig) => {
    setConfig(cfg);
  }, []);

  // Cierra el modal limpiando la configuración
  const closeModal = useCallback(() => {
    setConfig(null);
  }, []);

  // Componente que renderiza el modal solo cuando la configuración esté definida
  const Modal = () => {
    if (!config) return null;

    // Al confirmar, se ejecuta la función de confirmación y se cierra el modal
    const handleConfirm = (observation: string) => {
      config.onConfirm(observation);
      closeModal();
    };

    return (
      <ObservationModal
        isActive={true}
        onConfirm={handleConfirm}
        onCancel={closeModal}
        title={config.title}
        buttonColor={config.buttonColor}
      />
    );
  };

  return { openModal, closeModal, Modal };
};

export default useObservationModal;
