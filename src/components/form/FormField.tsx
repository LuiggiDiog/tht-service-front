/* eslint-disable @typescript-eslint/no-explicit-any */
import { Children, ReactElement, ReactNode, cloneElement } from 'react';
import BaseIcon from '../ui/BaseIcon';

type Props = {
  label?: string;
  labelFor?: string;
  subLabel?: string[] | null[];
  help?: string;
  icons?: string[] | null[];
  isBorderless?: boolean;
  isTransparent?: boolean;
  hasTextareaHeight?: boolean;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
};

const FormField = ({ icons = [], subLabel = [], ...props }: Props) => {
  const childrenCount = Children.count(props.children);

  let elementWrapperClass = '';

  switch (childrenCount) {
    case 2:
      elementWrapperClass = 'grid grid-cols-1 gap-3 md:grid-cols-2';
      break;
    case 3:
      elementWrapperClass = 'grid grid-cols-1 gap-3 md:grid-cols-3';
      break;
    case 4:
      elementWrapperClass = 'grid grid-cols-1 gap-3 md:grid-cols-4';
  }

  const controlClassName = [
    'px-3 py-2 max-w-full border-gray-700 rounded w-full dark:placeholder-gray-400',
    'focus:ring focus:ring-blue-600 focus:border-blue-600 focus:outline-none',
    props.hasTextareaHeight ? 'h-24' : 'h-12',
    props.isBorderless ? 'border-0' : 'border',
    props.isTransparent ? 'bg-transparent' : 'bg-white dark:bg-slate-800',
  ].join(' ');

  return (
    <div className="mb-6 last:mb-0">
      {props.label && (
        <label
          className={`block font-bold mb-2 ${
            props.labelFor ? 'cursor-pointer' : ''
          }`}
          htmlFor={props.labelFor}
        >
          {props.label}
        </label>
      )}
      <div className={`${elementWrapperClass}`}>
        {Children.map(props.children, (child, index) => (
          <div className="relative">
            <label className="font-bold">{subLabel[index]}</label>
            {cloneElement(child as ReactElement<any>, {
              className: `${controlClassName} ${icons[index] ? 'pl-10' : ''}`,
            })}
            {icons[index] && (
              <BaseIcon
                className="absolute top-0 left-0 z-10 pointer-events-none text-gray-500 dark:text-slate-400"
                h={props.hasTextareaHeight ? 'h-full' : 'h-12'}
                path={icons[index] || ''}
                w="w-10"
              />
            )}
          </div>
        ))}
      </div>
      {props.help && (
        <div className="text-xs text-gray-500 dark:text-slate-400 mt-1">
          {props.help}
        </div>
      )}
    </div>
  );
};

export default FormField;
