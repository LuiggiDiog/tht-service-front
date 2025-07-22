import { mdiClose } from '@mdi/js';
import { ReactNode } from 'react';
import BaseButtons from '../BaseButtons';
import OverlayLayer from '../OverlayLayer';
import BaseButton from '../baseButton';
import { ColorButtonKey } from '../ui.types';
import CardBox from './CardBox';
import CardBoxComponentTitle from './components/CardBoxComponentTitle';

type Props = {
  title: string;
  buttonColor: ColorButtonKey;
  buttonLabel: string;
  buttonCancelLabel?: string;
  type?: string;
  isActive: boolean;
  children: ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
};

const CardBoxModal = ({
  title,
  buttonColor,
  buttonLabel,
  buttonCancelLabel,
  type,
  isActive,
  children,
  onConfirm,
  onCancel,
}: Props) => {
  if (!isActive) {
    return null;
  }

  const renderFooter = () => {
    if (onCancel) {
      return (
        <BaseButtons>
          <BaseButton
            color={buttonColor}
            label={buttonLabel}
            onClick={onConfirm}
            type={type ? type : 'button'}
          />

          <BaseButton
            color={buttonColor}
            label={buttonCancelLabel ? buttonCancelLabel : 'Cancelar'}
            onClick={onCancel}
            outline
          />
        </BaseButtons>
      );
    }

    return (
      <BaseButton
        color={buttonColor}
        label={buttonLabel}
        onClick={onConfirm}
        type={type ? type : 'button'}
      />
    );
  };

  return (
    <OverlayLayer
      className={onCancel ? 'cursor-pointer' : ''}
      onClick={onCancel ? onCancel : () => ({})}
    >
      <CardBox
        className={
          'transition-transform shadow-lg max-h-modal w-11/12 md:w-3/5 lg:w-2/5 xl:w-4/12 z-50'
        }
        footer={renderFooter()}
        isModal
      >
        <CardBoxComponentTitle title={title}>
          {!!onCancel && (
            <BaseButton
              color="whiteDark"
              icon={mdiClose}
              onClick={onCancel}
              roundedFull
              small
            />
          )}
        </CardBoxComponentTitle>

        <div className="space-y-3">{children}</div>
      </CardBox>
    </OverlayLayer>
  );
};

export default CardBoxModal;
