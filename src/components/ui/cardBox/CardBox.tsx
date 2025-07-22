import React, { ReactNode } from 'react';
import CardBoxComponentBody from './components/CardBoxComponentBody';
import CardBoxComponentFooter from './components/CardBoxComponentFooter';

type Props = {
  rounded?: string;
  flex?: string;
  className?: string;
  hasComponentLayout?: boolean;
  hasTable?: boolean;
  isHoverable?: boolean;
  isModal?: boolean;
  children: ReactNode;
  footer?: ReactNode;
  onClick?: (e: React.MouseEvent) => void;
  isForm?: boolean;
  onKeyDown?: (e: React.KeyboardEvent) => void;
};

export default function CardBox({
  rounded = 'rounded-2xl',
  flex = 'flex-col',
  className = '',
  hasComponentLayout = false,
  hasTable = false,
  isHoverable = false,
  isModal = false,
  children,
  footer,
  onClick,
  isForm = false,
}: Props) {
  const componentClass = [
    'bg-white flex',
    className,
    rounded,
    flex,
    isModal ? 'dark:bg-slate-900' : 'dark:bg-slate-900/70',
    hasTable ? 'my-2 pt-4' : '',
  ];

  if (isHoverable) {
    componentClass.push('hover:shadow-lg transition-shadow duration-500');
  }

  if (isForm) {
    componentClass.push('w-full max-w-3xl');
  }

  return React.createElement(
    'div',
    { className: componentClass.join(' '), onClick },
    hasComponentLayout ? (
      children
    ) : (
      <>
        <CardBoxComponentBody noPadding={hasTable}>
          {children}
        </CardBoxComponentBody>
        {footer && <CardBoxComponentFooter>{footer}</CardBoxComponentFooter>}
      </>
    )
  );
}
