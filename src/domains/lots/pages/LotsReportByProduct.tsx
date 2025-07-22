import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router';
import * as Yup from 'yup';
import BadgeStatus from '../components/BadgeStatus';
import {
  GetLotsByProductReportPropsT,
  getLotsByProductReport,
} from '../lots.service';
import { LotT } from '../lots.type';
import { optionsStatus } from '../lots.utils';
import Form, {
  Field,
  FormField,
  SelectField,
  ValuesFormT,
} from '@/components/form';
import TableCustom, { Columns } from '@/components/tableCustom';
import FormFieldResult from '@/components/ui/FormFieldResult';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import CardBox from '@/components/ui/cardBox';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useProductOptions } from '@/domains/products';
import { formatDate, nowDate } from '@/utils/dateUtil';

export default function LotsReportByProduct() {
  const { productOptions } = useProductOptions();

  const [data, setData] = useState<LotT[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [countItems, setCountItems] = useState({
    total: 0,
    finalized: 0,
    transit: 0,
  });

  const schema = Yup.object().shape({
    product_id: Yup.number().required('Requerido'),
    status: Yup.string().required('Requerido'),
    start_date: Yup.string().required('Requerido').default(nowDate()),
    end_date: Yup.string().required('Requerido').default(nowDate()),
  });

  const columns: Columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Nombre',
      accessorKey: 'name',
      cell: ({ row }) => {
        const info = row.original as LotT;
        return info.product.name + ' - (Lote: ' + info.number + ')';
      },
    },
    {
      header: 'Producto',
      accessorKey: 'product.name',
    },
    {
      header: 'Ruta',
      accessorKey: 'route.name',
    },
    {
      header: 'Usuario',
      accessorKey: 'user.name',
    },
    {
      header: 'Tamaño',
      accessorKey: 'size',
    },
    {
      header: 'En tránsito',
      accessorKey: 'count_transit',
      cell: ({ row }) => {
        const info = row.original as LotT;
        const size = info.size - info.count_finalized;

        if (size === 0) {
          return size;
        }

        return (
          <Link
            className="text-green-800 dark:text-green-400"
            to={{
              pathname: `/items/by-lot/${info.id}`,
            }}
          >
            {size}
          </Link>
        );
      },
    },
    {
      header: 'Entregados',
      accessorKey: 'count_finalized',
      cell: ({ row }) => {
        const info = row.original as LotT;
        const countFinalized = info.count_finalized;

        if (countFinalized === 0) {
          return countFinalized;
        }

        return (
          <Link
            className="text-blue-800 dark:text-blue-400"
            to={{
              pathname: `/items/by-lot/${info.id}`,
              search: '?status=finalized',
            }}
          >
            {countFinalized}
          </Link>
        );
      },
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }) => {
        const info = row.original as LotT;
        return <BadgeStatus status={info.status} />;
      },
    },
    {
      header: 'Fecha',
      accessorKey: 'date_time',
      cell: ({ row }) => {
        const info = row.original as LotT;
        return formatDate(info.date_time);
      },
    },
  ];

  const submit = async (values: ValuesFormT) => {
    setIsLoading(true);
    try {
      const json = values as GetLotsByProductReportPropsT;
      const resp = await getLotsByProductReport(json);
      setData(resp);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCountItems = useCallback((resp: LotT[]) => {
    const newCountTotal = resp.reduce((acc, item) => acc + item.size, 0);
    const newCountFinalized = resp.reduce(
      (acc, item) => acc + item.count_finalized,
      0
    );
    const newCountTransit = newCountTotal - newCountFinalized;
    setCountItems({
      total: newCountTotal,
      finalized: newCountFinalized,
      transit: newCountTransit,
    });
  }, []);

  useEffect(() => {
    if (data.length > 0) {
      handleCountItems(data);
    }
  }, [data, handleCountItems]);

  return (
    <SectionCustom>
      <Form onSubmit={submit} schema={schema}>
        <SectionTitleLineWithButton main title="Reporte de Lotes por Producto">
          <BaseButton color="info" label="Buscar" type="submit" />
        </SectionTitleLineWithButton>

        <FormField label="Producto">
          <Field
            name="product_id"
            component={SelectField}
            options={productOptions}
          />
        </FormField>

        <FormField label="Estado">
          <Field
            name="status"
            component={SelectField}
            options={optionsStatus}
          />
        </FormField>

        <FormField label="Fecha inicio">
          <Field name="start_date" type="date" />
        </FormField>

        <FormField label="Fecha fin">
          <Field name="end_date" type="date" />
        </FormField>
      </Form>

      {isLoading && <LoadingSection />}
      {!isLoading && <TableCustom columns={columns} data={data} />}

      <CardBox className="mt-4">
        <FormFieldResult
          label="Total"
          values={[
            { label: 'Articulos', value: countItems.total },
            { label: 'En tránsito', value: countItems.transit },
            { label: 'Entregados', value: countItems.finalized },
          ]}
        />
      </CardBox>
    </SectionCustom>
  );
}
