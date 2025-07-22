import BaseIcon from './BaseIcon';
import { ColorKey } from './ui.types';
import { colorsBgLight, colorsText } from './ui.utils';

type Props = {
  icon: string;
  color: ColorKey;
  w?: string;
  h?: string;
  bg?: boolean;
  className?: string;
};

export default function IconRounded({
  icon,
  color,
  w = 'w-12',
  h = 'h-12',
  bg = false,
  className = '',
}: Props) {
  const classAddon = bg
    ? colorsBgLight[color]
    : `${colorsText[color]} bg-gray-50 dark:bg-slate-800`;

  return (
    <BaseIcon
      className={`rounded-full ${classAddon} ${className}`}
      h={h}
      path={icon}
      size="24"
      w={w}
    />
  );
}
