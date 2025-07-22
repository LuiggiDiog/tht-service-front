import { Form as FormFormik } from 'formik';
import { KeyboardEvent, useEffect, useRef } from 'react';
import { ValuesFormT } from '../form.types';
import FormValidate from './FormValidate';

type InnerFormProps = {
  submitCount: number;
  values: ValuesFormT;
  submitValidation?: (values: ValuesFormT) => void;
  children: React.ReactNode;
  onKeyDown?: (e: KeyboardEvent<HTMLFormElement>) => void;
};

export default function InnerForm({
  submitCount,
  values,
  submitValidation,
  children,
  onKeyDown,
}: InnerFormProps) {
  const prevSubmitCountRef = useRef<number>(0);

  useEffect(() => {
    if (submitCount !== prevSubmitCountRef.current) {
      prevSubmitCountRef.current = submitCount;
    }
  }, [submitCount]);

  useEffect(() => {
    if (prevSubmitCountRef.current > 0 && submitValidation) {
      submitValidation(values);
    }
  }, [submitCount, values, submitValidation]);

  return (
    <FormValidate>
      <FormFormik onKeyDown={onKeyDown}>{children}</FormFormik>
    </FormValidate>
  );
}
