import { useGetWarehouses } from './warehouses.query';
import TableCustom, { Columns } from '@/components/tableCustom';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';

export default function WarehousesList() {
  const { data, isLoading } = useGetWarehouses();

  const columns: Columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Nombre',
      accessorKey: 'name',
    },
    {
      header: 'Ubicación',
      accessorKey: 'location.name',
    },
  ];

  return (
    <SectionCustom isLoading={isLoading}>
      <SectionTitleLineWithButton main title="Listado de bodegas" />
      <TableCustom columns={columns} data={data} />
    </SectionCustom>
  );
}
