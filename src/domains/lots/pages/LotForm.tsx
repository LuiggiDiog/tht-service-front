import { mdiTableBorder } from '@mdi/js';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import { useGetLot, usePostLot } from '../lots.query';
import { LotT } from '../lots.type';
import Form, {
  Field,
  FormField,
  OptionFormT,
  SelectField,
  ValuesFormT,
} from '@/components/form';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useAuthStore } from '@/domains/auth';
import { useProductOptions } from '@/domains/products';
import { useGetRoutes } from '@/domains/routes';
import { useAddToast } from '@/domains/toast';
import { ZERO } from '@/utils/constants';

export default function LotForm() {
  const navigate = useNavigate();
  const userAuth = useAuthStore((state) => state.user);
  const { warning } = useAddToast();
  const postLot = usePostLot();

  const { id } = useParams();
  const { data, isLoading } = useGetLot(id);
  const { productOptions } = useProductOptions();
  const { data: routes } = useGetRoutes();
  const [routeOptions, setRouteOptions] = useState<OptionFormT[]>([]);

  const schema = Yup.object().shape({
    product_id: Yup.number().required('Requerido'),
    route_id: Yup.number().required('Requerido'),
    size: Yup.number().required('Requerido').default(ZERO).min(1, 'Mínimo 1'),
  });

  const submit = async (values: ValuesFormT) => {
    try {
      const json = values as LotT;
      json.user_id = userAuth?.id;
      const resp = await postLot.mutateAsync(json);

      if (!resp.success) {
        throw resp;
      }
      navigate('/lots');
    } catch (error) {
      console.error(error);
      warning('Error al guardar el lote');
    }
  };

  useEffect(() => {
    if (routes) {
      const options = routes.map((route) => ({
        label: route.name,
        value: route.id,
      }));
      setRouteOptions(options);
    }
  }, [routes]);

  if (isLoading) return <LoadingSection />;

  return (
    <Form data={data} onSubmit={submit} schema={schema}>
      <SectionTitleLineWithButton
        backBtn
        main
        title="Nuevo lote"
        icon={mdiTableBorder}
      >
        <BaseButton color="info" label="Guardar" type="submit" />
      </SectionTitleLineWithButton>

      <FormField label="Producto">
        <Field
          name="product_id"
          component={SelectField}
          options={productOptions}
        />
      </FormField>

      <FormField label="Ruta">
        <Field name="route_id" component={SelectField} options={routeOptions} />
      </FormField>

      <FormField label="Tamaño">
        <Field name="size" label="Tamaño" />
      </FormField>
    </Form>
  );
}
