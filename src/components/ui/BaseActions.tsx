import React, { Children, ReactElement, ReactNode, cloneElement } from 'react';

type PropsBaseActions = {
  children: ReactNode;
  className?: string;
  justify?: 'justify-center' | 'justify-end';
};

type ChildProps = {
  className?: string;
  label?: string;
};

export default function BaseActions(props: PropsBaseActions) {
  const { children, className, justify = 'justify-center' } = props;
  const showText = true;
  const justifyClass =
    justify === 'justify-center' ? 'justify-center' : justify;

  const handleLabel = (label?: string): string | undefined => {
    if (label) {
      return showText ? label : undefined;
    }
    return undefined;
  };

  return (
    <div className={`flex ${justifyClass} -mb-3 ${className}`}>
      {Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          const childProps = child.props as ChildProps;
          return cloneElement(child as ReactElement<ChildProps>, {
            className: `mr-3 last:mr-0 mb-3 ${childProps.className || ''}`,
            label: handleLabel(childProps.label),
          });
        }
        return child;
      })}
    </div>
  );
}
