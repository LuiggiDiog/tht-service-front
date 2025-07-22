import { Formik, FormikHelpers } from 'formik';
import { ReactNode, useMemo } from 'react';
import * as Yup from 'yup';
import CardBox from '../ui/cardBox';
import InnerForm from './components/InnerForm';
import { ValuesFormT } from './form.types';
import { jsonData } from './form.utils';

type PropsForm = {
  children: ReactNode;
  data?: Record<string, unknown> | null;
  schema: Yup.ObjectSchema<Record<string, unknown>>;
  onSubmit?: (values: ValuesFormT) => void;
  customValidation?: (values: ValuesFormT) => Record<string, unknown>;
  submitValidation?: (values: ValuesFormT) => void;
  hasTable?: boolean;
};

export default function Form(props: PropsForm) {
  const {
    children,
    data,
    schema,
    onSubmit,
    customValidation,
    submitValidation,
    hasTable = false,
  } = props;

  const initialValues = useMemo(() => {
    // Obtener los valores por defecto definidos en el esquema
    const defaultValues = schema.getDefault() || {};
    // Combinar los defaults con los datos recibidos, priorizando lo que venga en data
    return {
      ...defaultValues,
      ...(data || {}),
    };
  }, [data, schema]);

  const handleSubmit = (
    values: Record<string, unknown>,
    { setSubmitting }: FormikHelpers<Record<string, unknown>>
  ) => {
    const json = jsonData({
      schema: schema.fields,
      values,
    });
    if (onSubmit) onSubmit(json);
    setSubmitting(false);
  };

  return (
    <CardBox className="p-0 lg:p-2" hasTable={hasTable}>
      <Formik
        enableReinitialize
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validate={customValidation}
        validationSchema={schema}
      >
        {({ submitCount, values }) => (
          <InnerForm
            submitCount={submitCount}
            values={values}
            submitValidation={submitValidation}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
              }
            }}
          >
            {children}
          </InnerForm>
        )}
      </Formik>
    </CardBox>
  );
}
