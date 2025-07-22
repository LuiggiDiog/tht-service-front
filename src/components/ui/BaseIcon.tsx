import { ReactNode } from 'react';

export type BaseIconProps = {
  path: string;
  w?: string;
  h?: string;
  size?: string | number | null;
  className?: string;
  children?: ReactNode;
};

export default function BaseIcon(props: BaseIconProps) {
  const {
    path,
    w = 'w-6',
    h = 'h-6',
    size = null,
    className = '',
    children,
  } = props;

  const iconSize = size ?? 16;

  return (
    <span
      className={`inline-flex justify-center items-center ${w} ${h} ${className}`}
    >
      <svg
        className="inline-block"
        height={iconSize}
        viewBox="0 0 24 24"
        width={iconSize}
      >
        <path d={path} fill="currentColor" />
      </svg>
      {children}
    </span>
  );
}
