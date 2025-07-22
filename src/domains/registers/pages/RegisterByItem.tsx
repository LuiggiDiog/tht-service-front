import { useParams } from 'react-router';
import { useGetRegistersByItem } from '../registers.query';
import { RegisterT } from '../registers.type';
import TableCustom, { Columns } from '@/components/tableCustom';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import { formatDate } from '@/utils/dateUtil';

type Props = {
  isGuestBasic?: boolean;
};

export default function RegisterByItem(props: Props) {
  const { isGuestBasic } = props;
  const { id } = useParams();
  const { data, isLoading } = useGetRegistersByItem(id);

  const columns: Columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Estado',
      accessorKey: 'state.name',
    },
    {
      header: 'Ubicación',
      accessorKey: 'location.name',
    },
    {
      header: 'Usuario',
      accessorKey: 'user.name',
    },
    {
      header: 'Fecha',
      accessorKey: 'date_time',
      cell: ({ row }) => {
        const info = row.original as RegisterT;
        return formatDate(info.date_time);
      },
    },
  ];

  return (
    <SectionCustom isLoading={isLoading} isGuestBasic={isGuestBasic}>
      <SectionTitleLineWithButton
        main
        title={`Registros de Articulo ID: ${id}`}
      />
      <TableCustom columns={columns} data={data} />
    </SectionCustom>
  );
}
