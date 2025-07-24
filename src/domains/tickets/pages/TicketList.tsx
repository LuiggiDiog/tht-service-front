import {
  mdiCamera,
  mdiDelete,
  mdiEye,
  mdiFilePlusOutline,
  mdiPencil,
  mdiPlay,
} from '@mdi/js';
import BadgeStatus from '../components/BadgeStatus';
import {
  useChangeTicketStatus,
  useDeleteTicket,
  useGetTickets,
} from '../tickets.query';
import { TicketT } from '../tickets.type';
import TableCustom, { Columns } from '@/components/tableCustom';
import BaseActions from '@/components/ui/BaseActions';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import { useConfirmationDeleteModal } from '@/components/ui/modals';
import useConfirmationModal from '@/components/ui/modals/hooks/useConfirmationModal';

export default function TicketList() {
  const { data, isLoading } = useGetTickets();
  const deleteTicket = useDeleteTicket();
  const changeTicketStatus = useChangeTicketStatus();
  const { openModal: confirmationOpenModal, Modal: ConfirmationModal } =
    useConfirmationDeleteModal();
  const { openModal: openConfirmStateModal, Modal: ConfirmStateModal } =
    useConfirmationModal();

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
              href={`/tickets/${info.id}/view`}
              color="info"
              icon={mdiEye}
              label="Ver"
              roundedFull
              small
            />

            {/* Botón para agregar evidencia - solo disponible en desarrollo */}
            {info.status === 'in_progress' && (
              <BaseButton
                href={`/tickets/${info.id}/evidence`}
                color="warning"
                icon={mdiCamera}
                label="Evidencia"
                roundedFull
                small
              />
            )}

            {/* Mostrar botón 'Editar' solo si el ticket NO está cerrado */}
            {/* {info.status !== 'closed' && (
              <BaseButton
                href={`/tickets/${info.id}`}
                color="warning"
                icon={mdiPencil}
                label="Editar"
                roundedFull
                small
              />
            )} */}

            {/* Mostrar botón 'En Progreso' solo si el ticket NO está en progreso ni cerrado */}
            {info.status !== 'in_progress' && info.status !== 'closed' && (
              <BaseButton
                color="success"
                icon={mdiPlay}
                label="En Progreso"
                onClick={() =>
                  openConfirmStateModal({
                    onConfirm: () => {
                      changeTicketStatus.mutate({
                        ...info,
                        status: 'in_progress',
                      });
                    },
                    message:
                      '¿Estás seguro que deseas poner este ticket EN PROGRESO?',
                    title: 'Confirmar cambio de estado',
                    buttonColor: 'success',
                    buttonLabel: 'Sí, poner en progreso',
                    buttonCancelLabel: 'Cancelar',
                  })
                }
                roundedFull
                small
              />
            )}

            {/* Mostrar botón 'Cerrar Ticket' solo si el ticket está en progreso */}
            {info.status === 'in_progress' && (
              <BaseButton
                color="info"
                icon={mdiPencil}
                label="Cerrar Ticket"
                href={`/tickets/${info.id}/close`}
                roundedFull
                small
              />
            )}

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
      <SectionTitleLineWithButton main title="Lista de Tickets">
        <BaseButton
          href="/tickets/new"
          roundedFull
          label="Nuevo Ticket"
          icon={mdiFilePlusOutline}
        />
      </SectionTitleLineWithButton>
      <TableCustom columns={columns} data={data} />
      <ConfirmationModal />
      <ConfirmStateModal />
    </SectionCustom>
  );
}
