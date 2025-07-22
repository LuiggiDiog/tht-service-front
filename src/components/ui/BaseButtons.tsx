import React, { Children, ReactElement, cloneElement } from 'react';

type Props = {
  type?: string;
  mb?: string;
  noWrap?: boolean;
  classAddon?: string;
  children:
    | ReactElement<{ className?: string }>
    | ReactElement<{ className?: string }>[];
  className?: string;
};

const BaseButtons = ({
  type = 'justify-start',
  mb = '-mb-3',
  classAddon = 'mr-3 last:mr-0 mb-3',
  noWrap = false,
  children,
  className,
}: Props) => {
  return (
    <div
      className={`flex items-center ${type} ${className} ${mb} ${
        noWrap ? 'flex-nowrap' : 'flex-wrap'
      }`}
    >
      {Children.map(
        children,
        (child) =>
          React.isValidElement(child) &&
          cloneElement(child, {
            className: `${classAddon} ${child.props.className || ''}`,
          })
      )}
    </div>
  );
};

export default BaseButtons;
