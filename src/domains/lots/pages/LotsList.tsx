import { mdiCheck, mdiDelete, mdiFilePlusOutline, mdiQrcode } from '@mdi/js';
import { Link, useSearchParams } from 'react-router';
import BadgeStatus from '../components/BadgeStatus';
import {
  useDeleteLot,
  useGetLotsByStatus,
  useUpdateLotStatus,
} from '../lots.query';
import { LotT } from '../lots.type';
import TableCustom, { Columns } from '@/components/tableCustom';
import BaseActions from '@/components/ui/BaseActions';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import {
  useConfirmationDeleteModal,
  useConfirmationModal,
} from '@/components/ui/modals';
import { formatDate } from '@/utils/dateUtil';

export default function LotsList() {
  const [searchParams] = useSearchParams();
  const status = searchParams.get('status') || 'active';

  const { data, isLoading } = useGetLotsByStatus(status);
  const deleteLot = useDeleteLot();
  const updateLotStatus = useUpdateLotStatus();

  const { openModal, Modal } = useConfirmationModal();
  const { openModal: confirmationOpenModal, Modal: ConfirmationModal } =
    useConfirmationDeleteModal();

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
    {
      header: 'Acciones',
      cell: ({ row }) => {
        const info = row.original as LotT;
        return (
          <BaseActions>
            <BaseButton
              color="warning"
              href={`/lots/qr/${info.id}`}
              icon={mdiQrcode}
              label="Impresión"
              roundedFull
              small
            />

            {info.status === 'active' && (
              <BaseButton
                color="success"
                icon={mdiCheck}
                label="Finalizar"
                roundedFull
                small
                onClick={() =>
                  openModal({
                    onConfirm: () => {
                      const json = {
                        ...info,
                        status: 'finalized',
                      };
                      updateLotStatus.mutate(json);
                    },
                    message: `Marcar como finalizado el lote ID:${info.id}`,
                  })
                }
              />
            )}

            <BaseButton
              color="danger"
              icon={mdiDelete}
              label="Eliminar"
              onClick={() =>
                confirmationOpenModal({
                  onConfirm: () => {
                    deleteLot.mutate(info.id);
                  },
                })
              }
              roundedFull
              small
            />
          </BaseActions>
        );
      },
    },
  ];

  const title = status === 'active' ? 'Lotes activos' : 'Lotes finalizados';

  return (
    <SectionCustom isLoading={isLoading}>
      <SectionTitleLineWithButton main title={title}>
        {status === 'active' && (
          <BaseButton
            href="/lots/new"
            roundedFull
            label="Nuevo lote"
            icon={mdiFilePlusOutline}
          />
        )}
      </SectionTitleLineWithButton>
      <TableCustom columns={columns} data={data} />
      <Modal />
      <ConfirmationModal />
    </SectionCustom>
  );
}
