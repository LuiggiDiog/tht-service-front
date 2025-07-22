import React, { useState } from 'react';
import { ColorButtonKey } from '../../ui.types';
import CardBoxModal from './CardBoxModal';

export interface ObservationModalProps {
  isActive: boolean;
  onConfirm: (observation: string) => void;
  onCancel: () => void;
  buttonColor?: ColorButtonKey;
  title?: string;
}

const ObservationModal: React.FC<ObservationModalProps> = ({
  isActive,
  onConfirm,
  onCancel,
  buttonColor = 'success',
  title = 'Cambio de Estado',
}) => {
  // Estado para la observación y para el mensaje de error
  const [observation, setObservation] = useState('');
  const [error, setError] = useState('');

  // Actualiza el estado conforme se escribe en el textarea
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setObservation(e.target.value);
    if (error && e.target.value.trim() !== '') {
      setError('');
    }
  };

  // Maneja el envío del formulario de forma nativa
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedObservation = observation.trim();
    if (trimmedObservation === '') {
      setError('La observación es obligatoria');
      return;
    }
    onConfirm(trimmedObservation);
  };

  return (
    <CardBoxModal
      title={title}
      buttonColor={buttonColor}
      buttonLabel="Confirmar"
      buttonCancelLabel="Cancelar"
      isActive={isActive}
      onConfirm={handleSubmit}
      onCancel={onCancel}
    >
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="observation" className="block mb-1 font-bold">
            Observación:
          </label>
          <textarea
            id="observation"
            name="observation"
            value={observation}
            onChange={handleChange}
            rows={4}
            className="w-full p-2 border rounded"
            placeholder="Ingresa tu observación..."
          />
          {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
        </div>
      </form>
    </CardBoxModal>
  );
};

export default ObservationModal;
