import * as Yup from 'yup';

type JsonDataProps = {
  schema: Record<string, unknown>;
  values: Record<string, unknown>;
};

export function jsonData({ schema, values }: JsonDataProps) {
  const dataKeys = Object.keys(values);
  const schemaKeys = Object.keys(schema);
  const newSchema = { ...schema };
  dataKeys.forEach((key) => {
    if (schemaKeys.includes(key)) {
      newSchema[key] = values[key] || '';
    }
  });
  return newSchema;
}

export const reValidateYupSchema = (
  schema: Yup.ObjectSchema<Record<string, unknown>>,
  values: Record<string, unknown>
) => {
  try {
    schema.validateSync(values, {
      abortEarly: false,
    });
    return {};
  } catch (error) {
    if (error instanceof Yup.ValidationError) {
      const errors: Record<string, unknown> = {};
      error.inner.forEach((err) => {
        if (err.path) errors[err.path] = err.message;
      });
      return errors;
    }
    return {};
  }
};
