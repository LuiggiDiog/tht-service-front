import { mdiClose } from '@mdi/js';
import { ReactNode, useCallback, useEffect, useState } from 'react';
import BaseIcon from '../../components/ui/BaseIcon';
import Spinner from '../../components/ui/Spinner';
import BaseButton from '../../components/ui/baseButton';
import { ColorKeyT, colorsBgLight, colorsOutline } from './toast.colors';

export type ToastT = {
  id?: string;
  title?: string;
  description: string;
  color: ColorKeyT;
  icon?: string;
  outline?: boolean;
  duration?: number;
  autoDismiss?: boolean;
  spinner?: boolean;
};

export type ToastProps = {
  color: ColorKeyT;
  icon?: string;
  outline?: boolean;
  children: ReactNode;
  button?: ReactNode;
  duration?: number;
  onDismiss?: () => void;
  autoDismiss?: boolean;
  spinner?: boolean;
};

export default function Toast(props: ToastProps) {
  const {
    color,
    icon,
    outline = false,
    children,
    button,
    duration = 7000,
    onDismiss,
    autoDismiss = true,
    spinner = false,
  } = props;

  const componentColorClass = outline
    ? colorsOutline[color]
    : colorsBgLight[color];

  const [isDismissed, setIsDismissed] = useState(false);

  // Función para descartar el Toast
  const dismiss = useCallback(
    (e?: React.MouseEvent) => {
      if (e) e.preventDefault();
      setIsDismissed(true);
      onDismiss?.();
    },
    [onDismiss]
  );

  useEffect(() => {
    if (autoDismiss) {
      const timeoutId = setTimeout(dismiss, duration);
      return () => clearTimeout(timeoutId);
    }
  }, [autoDismiss, duration, dismiss]);

  if (isDismissed) return null;

  const renderButtonContent = () => {
    if (spinner) return <Spinner />;
    if (button) return button;
    return (
      <BaseButton
        color="white"
        icon={mdiClose}
        onClick={dismiss}
        roundedFull
        small
      />
    );
  };

  return (
    <div
      className={`px-4 py-2 mb-3 last:mb-0 border rounded-lg transition-colors duration-150 ${componentColorClass}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          {icon && (
            <BaseIcon
              className="md:mr-2"
              h="h-10 md:h-5"
              path={icon}
              size="20"
              w="w-10 md:w-5"
            />
          )}
          <span className="mr-4 text-left py-2">{children}</span>
        </div>
        {renderButtonContent()}
      </div>
    </div>
  );
}
