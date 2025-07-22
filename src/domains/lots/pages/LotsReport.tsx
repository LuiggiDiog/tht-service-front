import { mdiEye } from '@mdi/js';
import { useMemo, useState } from 'react';
import * as Yup from 'yup';
import { useGetLotsBasicByProduct } from '../lots.query';
import Form, {
  Field,
  FormField,
  OptionFormT,
  SelectField,
  SetFieldValueT,
  ValuesFormT,
} from '@/components/form';
import TableCustom, { Columns } from '@/components/tableCustom';
import BaseActions from '@/components/ui/BaseActions';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { ItemsBadgeStatus, getItemsByStatus } from '@/domains/items';
import { ItemT } from '@/domains/items';
import { useProductOptions } from '@/domains/products';
import { ZERO } from '@/utils/constants';

type Props = {
  isGuestBasic?: boolean;
};

export default function LotsReport(props: Props) {
  const { isGuestBasic } = props;

  const { productOptions } = useProductOptions();

  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const { data: lotsBasic } = useGetLotsBasicByProduct(selectedProduct);

  const [data, setData] = useState<ItemT[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const numberOptions: OptionFormT[] = useMemo(() => {
    return (
      lotsBasic?.map((lot) => ({
        label: 'Lote: ' + lot.number.toString(),
        value: lot.id,
      })) || []
    );
  }, [lotsBasic]);

  const schema = Yup.object().shape({
    product_id: Yup.number().required('Requerido'),
    number: Yup.number().required('Requerido'),
  });

  const columns: Columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Número',
      accessorKey: 'number',
      cell: ({ row }) => {
        const info = row.original as ItemT;
        return 'Articulo: ' + info.number;
      },
    },
    {
      header: 'Observaciones',
      accessorKey: 'observations',
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }) => {
        const info = row.original as ItemT;
        return <ItemsBadgeStatus status={info.status} />;
      },
    },
    {
      header: 'Acciones',
      cell: ({ row }) => {
        const info = row.original as ItemT;
        return (
          <BaseActions>
            <BaseButton
              color="info"
              href={`/register/by-item/${info.id}`}
              icon={mdiEye}
              label="Ver registros"
              roundedFull
              small
            />
          </BaseActions>
        );
      },
    },
  ];

  const submit = async (values: ValuesFormT) => {
    setIsLoading(true);
    try {
      const resp = await getItemsByStatus({
        lot_id: parseInt(values.number as string),
      });
      setData(resp);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SectionCustom isGuestBasic={isGuestBasic}>
      <Form onSubmit={submit} schema={schema}>
        <SectionTitleLineWithButton main title="Rastreo de Lotes en transito">
          <BaseButton color="info" label="Buscar" type="submit" />
        </SectionTitleLineWithButton>

        <FormField label="Producto">
          <Field
            name="product_id"
            component={SelectField}
            options={productOptions}
            onChangeValue={(value: string, setFieldValue: SetFieldValueT) => {
              setSelectedProduct(parseInt(value));
              setFieldValue('number', ZERO);
            }}
          />
        </FormField>
        <FormField label="Número de Lote">
          <Field
            name="number"
            component={SelectField}
            options={numberOptions}
            placeholder="Número de Lote"
          />
        </FormField>
      </Form>

      {isLoading && <LoadingSection />}
      {!isLoading && <TableCustom columns={columns} data={data} />}
    </SectionCustom>
  );
}
