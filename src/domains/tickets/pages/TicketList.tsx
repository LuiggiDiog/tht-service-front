import { mdiDelete, mdiFilePlusOutline, mdiPencil } from '@mdi/js';
import BadgeStatus from '../components/BadgeStatus';
import { useDeleteTicket, useGetTickets } from '../tickets.query';
import { TicketT } from '../tickets.type';
import TableCustom, { Columns } from '@/components/tableCustom';
import BaseActions from '@/components/ui/BaseActions';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import { useConfirmationDeleteModal } from '@/components/ui/modals';

export default function TicketList() {
  const { data, isLoading } = useGetTickets();
  const deleteTicket = useDeleteTicket();
  const { openModal: confirmationOpenModal, Modal: ConfirmationModal } =
    useConfirmationDeleteModal();

  const columns: Columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Cliente ID',
      accessorKey: 'customer_id',
    },
    {
      header: 'Técnico ID',
      accessorKey: 'technician_id',
    },
    {
      header: 'Descripción',
      accessorKey: 'description',
      cell: ({ row }) => {
        const info = row.original as TicketT;
        return (
          <div className="max-w-xs">
            <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
              {info.description}
            </p>
          </div>
        );
      },
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }) => {
        const info = row.original as TicketT;
        return <BadgeStatus status={info.status} />;
      },
    },
    {
      header: 'Fecha Creación',
      accessorKey: 'created_at',
      cell: ({ row }) => {
        const info = row.original as TicketT;
        return new Date(info.created_at).toLocaleDateString('es-ES');
      },
    },
    {
      header: 'Última Actualización',
      accessorKey: 'updated_at',
      cell: ({ row }) => {
        const info = row.original as TicketT;
        return new Date(info.updated_at).toLocaleDateString('es-ES');
      },
    },
    {
      header: 'Acciones',
      cell: ({ row }) => {
        const info = row.original as TicketT;
        return (
          <BaseActions>
            <BaseButton
              href={`/tickets/${info.id}`}
              color="warning"
              icon={mdiPencil}
              label="Editar"
              roundedFull
              small
            />

            <BaseButton
              color="danger"
              icon={mdiDelete}
              label="Eliminar"
              onClick={() =>
                confirmationOpenModal({
                  onConfirm: () => {
                    deleteTicket.mutate(info.id);
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

  return (
    <SectionCustom isLoading={isLoading}>
      <SectionTitleLineWithButton main title="Lista de tickets">
        <BaseButton
          href="/tickets/new"
          roundedFull
          label="Nuevo ticket"
          icon={mdiFilePlusOutline}
        />
      </SectionTitleLineWithButton>
      <TableCustom columns={columns} data={data} />
      <ConfirmationModal />
    </SectionCustom>
  );
}
