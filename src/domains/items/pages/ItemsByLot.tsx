import { mdiCheck, mdiEye } from '@mdi/js';
import { useParams, useSearchParams } from 'react-router';
import BadgeStatus from '../components/BadgeStatus';
import { ItemT } from '../items.type';
import TableCustom, { Columns } from '@/components/tableCustom';
import BaseActions from '@/components/ui/BaseActions';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import { useObservationModal } from '@/components/ui/modals';
import {
  useGetItemsByStatus,
  useUpdateItemStatus,
} from '@/domains/items/items.query';
import { useGetLot } from '@/domains/lots/lots.query';

export default function ItemsByLot() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status');

  const { data, isLoading } = useGetItemsByStatus(id, status);
  const { data: lot, isLoading: isLoadingLot } = useGetLot(id);

  const updateItemStatus = useUpdateItemStatus();
  const { openModal, Modal } = useObservationModal();

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
        return <BadgeStatus status={info.status} />;
      },
    },
    {
      header: 'Acciones',
      cell: ({ row }) => {
        const info = row.original as ItemT;
        return (
          <BaseActions>
            {info.status === 'active' && (
              <BaseButton
                color="success"
                icon={mdiCheck}
                label="Marcar como entregado"
                roundedFull
                small
                onClick={() =>
                  openModal({
                    onConfirm: (observations?: string) => {
                      const json = {
                        ...info,
                        observations,
                        status: 'finalized',
                      };
                      updateItemStatus.mutate(json);
                    },
                    title: `Marcar como entregado el artículo ${info.number}`,
                    buttonColor: 'success',
                  })
                }
              />
            )}
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

  const title = `Listado de artículos del lote ID: ${id}`;

  return (
    <SectionCustom isLoading={isLoading || isLoadingLot}>
      <SectionTitleLineWithButton main title={title} />
      <p className="text-lg mb-2 ml-2 font-semibold">
        {lot?.product.name} - (Lote: {lot?.number})
      </p>
      <TableCustom columns={columns} data={data} />
      <Modal />
    </SectionCustom>
  );
}
