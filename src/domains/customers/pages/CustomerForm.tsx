import { mdiAccount } from '@mdi/js';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import {
  useGetCustomer,
  usePostCustomer,
  usePutCustomer,
} from '../customers.query';
import { CustomerT } from '../customers.type';
import Form, {
  Field,
  FormField,
  SelectField,
  ValuesFormT,
} from '@/components/form';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useAddToast } from '@/domains/toast';
import { EMPTY_STRING } from '@/utils/constants';

export default function CustomerForm() {
  const navigate = useNavigate();
  const postCustomer = usePostCustomer();
  const putCustomer = usePutCustomer();
  const { success } = useAddToast();

  const { id } = useParams();
  const { data, isLoading } = useGetCustomer(id);

  const schema = Yup.object().shape({
    name: Yup.string().required('Requerido').default(EMPTY_STRING),
    last_name: Yup.string().required('Requerido').default(EMPTY_STRING),
    email: Yup.string()
      .email('Email inválido')
      .required('Requerido')
      .default(EMPTY_STRING),
    phone: Yup.string().default(EMPTY_STRING),
    address: Yup.string().default(EMPTY_STRING),
    company: Yup.string().default(EMPTY_STRING),
    rfc: Yup.string().default(EMPTY_STRING),
    status: Yup.string().required('Requerido').default('active'),
  });

  const submit = async (values: ValuesFormT) => {
    try {
      const json = values as CustomerT;
      json.id = parseInt(id as string);

      const resp = id
        ? await putCustomer.mutateAsync(json)
        : await postCustomer.mutateAsync(json);

      if (!resp.id) {
        throw resp;
      }

      success('Cliente guardado correctamente');
      navigate('/customers');
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const getTitle = () => {
    if (id) {
      return `Editar cliente ${data?.name} ${data?.last_name}`;
    }
    return 'Nuevo cliente';
  };

  if (isLoading) {
    return <LoadingSection />;
  }

  return (
    <Form data={data} onSubmit={submit} schema={schema}>
      <SectionTitleLineWithButton
        backBtn
        main
        title={getTitle()}
        icon={mdiAccount}
      >
        <BaseButton color="info" label="Guardar" type="submit" />
      </SectionTitleLineWithButton>

      <FormField label="Nombre">
        <Field name="name" label="Nombre" placeholder="Nombre del cliente" />
      </FormField>

      <FormField label="Apellido">
        <Field
          name="last_name"
          label="Apellido"
          placeholder="Apellido del cliente"
        />
      </FormField>

      <FormField label="Email">
        <Field
          name="email"
          label="Email"
          type="email"
          placeholder="correo@ejemplo.com"
        />
      </FormField>

      <FormField label="Teléfono">
        <Field name="phone" label="Teléfono" placeholder="Número de teléfono" />
      </FormField>

      <FormField label="Dirección" hasTextareaHeight>
        <Field
          name="address"
          label="Dirección"
          placeholder="Dirección completa del cliente"
        />
      </FormField>

      <FormField label="Empresa">
        <Field
          name="company"
          label="Empresa"
          placeholder="Nombre de la empresa"
        />
      </FormField>

      <FormField label="Identificación">
        <Field
          name="rfc"
          label="Identificación"
          placeholder="Identificación del cliente"
        />
      </FormField>

      <FormField label="Estado">
        <Field
          name="status"
          component={SelectField}
          options={[
            { value: 'active', label: 'Activo' },
            { value: 'inactive', label: 'Inactivo' },
          ]}
        />
      </FormField>
    </Form>
  );
}
