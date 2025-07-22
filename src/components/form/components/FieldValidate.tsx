import { Field, useField } from 'formik';
import React from 'react';
import { ZERO_STRING } from '@/utils/constants';

type propsFieldValidate = {
  name: string;
  placeholder?: string;
  error?: string;
  touched?: boolean;
  onChange?: (value: unknown) => void;
  type?: string;
};

export default function FieldValidate(props: propsFieldValidate) {
  const { name, placeholder, error, touched, onChange, type, ...rest } = props;
  const [, , helpers] = useField(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    helpers.setValue(e.target.value);
    if (onChange) onChange(e.target.value);
  };

  const handleBlurCurrency = (e: React.FocusEvent<HTMLInputElement>) => {
    helpers.setTouched(true);
    const value = parseFloat(e.target.value);

    if (type === 'currency-extense') {
      helpers.setValue(value.toFixed(4));
      if (onChange) onChange(value.toFixed(4));
      return;
    }

    helpers.setValue(value.toFixed(2));
    if (onChange) onChange(value.toFixed(2));
  };

  const handleBlurWeight = (e: React.FocusEvent<HTMLInputElement>) => {
    helpers.setTouched(true);
    const value = parseFloat(e.target.value);
    helpers.setValue(value.toFixed(4));
    if (onChange) onChange(value.toFixed(4));
  };

  const handleBlurDate = (e: React.FocusEvent<HTMLInputElement>) => {
    helpers.setTouched(true);
    const value = e.target.value.toString();
    helpers.setValue(value);
    if (onChange) onChange(value);
  };

  if (type === 'weight') {
    return (
      <>
        <Field
          min={ZERO_STRING}
          name={name}
          onBlur={handleBlurWeight}
          onChange={handleChange}
          placeholder={placeholder}
          step="0.0001"
          type="number"
          {...rest}
        />
        {error && touched && (
          <div className="text-xs pl-1 pt-1 text-red-500">{error}</div>
        )}
      </>
    );
  }

  if (type === 'currency' || type === 'currency-extense') {
    return (
      <>
        <Field
          /* min={ZERO_STRING} */
          name={name}
          onBlur={handleBlurCurrency}
          onChange={handleChange}
          placeholder={placeholder}
          step={type === 'currency' ? '0.01' : '0.0001'}
          type="number"
          {...rest}
        />
        {error && touched && (
          <div className="text-xs pl-1 pt-1 text-red-500">{error}</div>
        )}
      </>
    );
  }

  if (type === 'date') {
    return (
      <>
        <Field
          name={name}
          onBlur={handleBlurDate}
          onChange={handleChange}
          placeholder={placeholder}
          type="date"
          {...rest}
        />
        {error && touched && (
          <div className="text-xs pl-1 pt-1 text-red-500">{error}</div>
        )}
      </>
    );
  }

  return (
    <>
      <Field
        name={name}
        onChange={handleChange}
        placeholder={placeholder}
        type={type}
        {...rest}
      />
      {error && touched && (
        <div className="text-xs pl-1 pt-1 text-red-500">{error}</div>
      )}
    </>
  );
}
