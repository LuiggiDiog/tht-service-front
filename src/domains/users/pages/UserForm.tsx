import { mdiTableBorder } from '@mdi/js';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import { UserT } from '../user.type';
import { useGetUser, usePostUser, usePutUser } from '../users.query';
import Form, {
  Field,
  FormField,
  SelectField,
  ValuesFormT,
} from '@/components/form';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useLocationOptions } from '@/domains/locations';
import { useRoleOptions } from '@/domains/roles/hooks/useRoleOptions';
import { EMPTY_STRING } from '@/utils/constants';

export default function UserForm() {
  const navigate = useNavigate();
  const postUser = usePostUser();
  const putUser = usePutUser();

  const { id } = useParams();
  const { data, isLoading } = useGetUser(id);
  const { locationOptions } = useLocationOptions();
  const { roleOptions } = useRoleOptions();

  const current = useMemo(() => {
    if (!data) return null;
    return {
      ...data,
      role_id: data.roles[0]?.id,
    };
  }, [data]);

  const schema = Yup.object().shape({
    name: Yup.string().required('Requerido').default(EMPTY_STRING),
    last_name: Yup.string().required('Requerido').default(EMPTY_STRING),
    email: Yup.string()
      .email('Email inválido')
      .required('Requerido')
      .default(EMPTY_STRING),
    location_id: Yup.number().required('Requerido'),
    password: Yup.string().default(EMPTY_STRING),
    role_id: Yup.number().required('Requerido'),
  });

  const submit = async (values: ValuesFormT) => {
    const json = values as UserT;
    json.id = parseInt(id as string);
    const resp = id
      ? await putUser.mutateAsync(json)
      : await postUser.mutateAsync(json);

    if (resp.id) {
      navigate('/users');
    }
  };

  if (isLoading) return <LoadingSection />;

  const getTitle = () => {
    if (id) {
      return `Editar usuario ${data?.id}`;
    }
    return 'Nuevo usuario';
  };

  return (
    <Form data={current} onSubmit={submit} schema={schema}>
      <SectionTitleLineWithButton
        backBtn
        main
        title={getTitle()}
        icon={mdiTableBorder}
      >
        <BaseButton color="info" label="Guardar" type="submit" />
      </SectionTitleLineWithButton>

      <FormField label="Nombre">
        <Field name="name" label="Nombre" placeholder="Nombre del usuario" />
      </FormField>

      <FormField label="Apellido">
        <Field
          name="last_name"
          label="Apellido"
          placeholder="Apellido del usuario"
        />
      </FormField>

      <FormField label="Email">
        <Field
          name="email"
          label="Email"
          placeholder="Email del usuario"
          type="email"
        />
      </FormField>

      <FormField label="Ubicación">
        <Field
          name="location_id"
          component={SelectField}
          options={locationOptions}
        />
      </FormField>

      <FormField label="Contraseña">
        <Field
          name="password"
          label="Contraseña"
          placeholder="Contraseña del usuario"
          /* type="password" */
        />
      </FormField>

      <FormField label="Rol">
        <Field name="role_id" component={SelectField} options={roleOptions} />
      </FormField>
    </Form>
  );
}
