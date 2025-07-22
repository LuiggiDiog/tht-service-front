/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormikErrors, FormikTouched, useFormikContext } from 'formik';
import React, { Children, ReactElement, ReactNode } from 'react';
import FieldValidate from './FieldValidate';

type FormikContext = {
  errors?: FormikErrors<Record<string, unknown>>;
  touched?: FormikTouched<Record<string, unknown>>;
};

type PropsFormValidate = {
  children: ReactNode;
};

export default function FormValidate(props: PropsFormValidate) {
  const { children } = props;

  const { errors, touched }: FormikContext = useFormikContext();

  const handleRemplaceFieldToFieldValidate = (child: ReactElement<any>) => {
    const nameComponent = (child.type as { name: string }).name;
    if (
      errors &&
      touched &&
      (nameComponent === 'Field' || nameComponent === 'FieldCustom')
    ) {
      const { name, placeholder, ...rest } = child.props;
      return (
        <FieldValidate
          error={errors[name]}
          name={name}
          placeholder={placeholder}
          touched={touched[name]}
          {...rest}
        />
      );
    }
    return child;
  };

  const handleMapFormChildren = (children: ReactNode): ReactNode => {
    return Children.map(children, (child) => {
      if (React.isValidElement(child)) {
        const childElement = child as ReactElement<any>;
        if ((child.type as { name: string }).name === 'FormField') {
          const { children: childrenFields, ...rest } = child.props as Record<
            string,
            any
          >;
          return (
            <child.type {...rest}>
              {Children.map(childrenFields, handleRemplaceFieldToFieldValidate)}
            </child.type>
          );
        } else if (childElement.props.children) {
          const newChildren = handleMapFormChildren(
            childElement.props.children as ReactNode
          );
          return React.cloneElement(child, {}, newChildren);
        }
      }
      return child;
    });
  };

  return <>{handleMapFormChildren(children)}</>;
}
