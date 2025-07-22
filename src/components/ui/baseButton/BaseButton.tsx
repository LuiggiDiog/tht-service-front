import { createElement } from 'react';
import { Link } from 'react-router';
import BaseIcon from '../BaseIcon';
import { ColorButtonKey } from '../ui.types';
import { getButtonColor } from './baseButton.util';

export type BaseButtonProps = {
  label?: string;
  icon?: string;
  iconSize?: string | number;
  href?: string;
  target?: string;
  type?: string;
  color?: ColorButtonKey;
  className?: string;
  asAnchor?: boolean;
  small?: boolean;
  outline?: boolean;
  active?: boolean;
  disabled?: boolean;
  roundedFull?: boolean;
  onClick?: (e: React.MouseEvent) => void;
  notButton?: boolean;
};

export default function BaseButton(props: BaseButtonProps) {
  const {
    label,
    icon,
    iconSize,
    href,
    target,
    type,
    color = 'contrast',
    className = '',
    asAnchor = false,
    small = false,
    outline = false,
    active = false,
    disabled = false,
    roundedFull = false,
    onClick,
    notButton,
  } = props;

  const componentClass = [
    'inline-flex',
    'justify-center',
    'items-center',
    'whitespace-nowrap',
    'focus:outline-none',
    'transition-colors',
    'focus:ring',
    'duration-150',
    'border',
    disabled ? 'cursor-not-allowed' : 'cursor-pointer',
    roundedFull ? 'rounded-full' : 'rounded',
    getButtonColor(color, outline, !disabled, active),
    className,
  ];

  if (!label && icon) {
    componentClass.push('p-1');
  } else if (small) {
    componentClass.push('text-sm', roundedFull ? 'px-3 py-1' : 'p-1');
  } else {
    componentClass.push('py-2', roundedFull ? 'px-6' : 'px-3');
  }

  if (disabled) {
    componentClass.push(outline ? 'opacity-50' : 'opacity-70');
  }

  const componentClassString = componentClass.join(' ');

  const componentChildren = (
    <>
      {icon && <BaseIcon path={icon} size={iconSize} />}
      {label && (
        <span className={small && icon ? 'px-1' : 'px-2'}>{label}</span>
      )}
    </>
  );

  if (notButton) {
    return (
      <div className={componentClassString} onClick={onClick}>
        {componentChildren}
      </div>
    );
  }

  if (href && !disabled) {
    return (
      <Link className={componentClassString} target={target} to={href}>
        {componentChildren}
      </Link>
    );
  }

  return createElement(
    asAnchor ? 'a' : 'button',
    {
      className: componentClassString,
      type: type ?? 'button',
      target,
      disabled,
      onClick,
    },
    componentChildren
  );
}
