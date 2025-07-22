import React from 'react';
import { ColorButtonKey } from '../../ui.types';
import CardBoxModal from './CardBoxModal';

export interface ConfirmationModalProps {
  isActive: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  message: string;
  title?: string;
  buttonColor?: ColorButtonKey;
  buttonLabel?: string;
  buttonCancelLabel?: string;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isActive,
  onConfirm,
  onCancel,
  message,
  title = 'Confirmación',
  buttonColor = 'success',
  buttonLabel = 'Confirmar',
  buttonCancelLabel = 'Cancelar',
}) => {
  return (
    <CardBoxModal
      title={title}
      buttonColor={buttonColor}
      buttonLabel={buttonLabel}
      buttonCancelLabel={buttonCancelLabel}
      isActive={isActive}
      onConfirm={onConfirm}
      onCancel={onCancel}
    >
      <p>{message}</p>
    </CardBoxModal>
  );
};

export default ConfirmationModal;
