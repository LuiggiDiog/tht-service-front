import { mdiFilePlusOutline } from '@mdi/js';
import { BadgeStatus, TicketActionsDropdown } from '../components';
import { useDeviceLocationNameResolver } from '../hooks/useDeviceLocationName';
import {
  useChangeTicketStatus,
  useDeleteTicket,
  useGetTickets,
} from '../tickets.query';
import { TicketDetailT, TicketT } from '../tickets.type';
import { getStatusLabel } from '../tickets.utils';
import TableCustom, { Columns } from '@/components/tableCustom';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import { useConfirmationDeleteModal } from '@/components/ui/modals';
import useConfirmationModal from '@/components/ui/modals/hooks/useConfirmationModal';
import { CustomerNameDisplay } from '@/domains/customers';
import { getCustomerName } from '@/domains/customers/customers.utils';
import { useValidatePermissionCurrentRole } from '@/domains/permissions/permissions';
import { UserNameDisplay } from '@/domains/users';

export default function TicketList() {
  const { data, isLoading } = useGetTickets();
  const deleteTicket = useDeleteTicket();
  const changeTicketStatus = useChangeTicketStatus();
  const { getName: getLocationName } = useDeviceLocationNameResolver();
  const { openModal: confirmationOpenModal, Modal: ConfirmationModal } =
    useConfirmationDeleteModal();
  const { openModal: openConfirmStateModal, Modal: ConfirmStateModal } =
    useConfirmationModal();

  const evidenceTicketPermission =
    useValidatePermissionCurrentRole('tickets/evidence');
  const changeStatusTicketPermission = useValidatePermissionCurrentRole(
    'tickets/change-status'
  );

  const columns: Columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Cliente',
      accessorKey: 'customer_id',
      accessorFn: (row) => {
        const info = row as TicketDetailT;
        return getCustomerName(info.customer);
      },
      cell: ({ row }) => {
        const info = row.original as TicketDetailT;
        return <CustomerNameDisplay customer={info.customer} />;
      },
    },
    {
      header: 'Descripción',
      accessorKey: 'description',
      cell: ({ row }) => {
        const info = row.original as TicketDetailT;
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
      header: 'Ubicación',
      accessorKey: 'device_location',
      accessorFn: (row) => {
        const info = row as TicketDetailT;
        return getLocationName(info.device_location);
      },
      cell: ({ row }) => {
        const info = row.original as TicketDetailT;
        return getLocationName(info.device_location);
      },
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      accessorFn: (row) => {
        const info = row as TicketDetailT;
        return getStatusLabel(info.status);
      },
      cell: ({ row }) => {
        const info = row.original as TicketDetailT;
        return <BadgeStatus status={info.status} />;
      },
    },
    {
      header: 'Ingresado por',
      accessorKey: 'created_by',
      accessorFn: (row) => {
        const info = row as TicketDetailT;
        return info.created_by_user.name;
      },
      cell: ({ row }) => {
        const info = row.original as TicketDetailT;
        return <UserNameDisplay user={info.created_by_user} />;
      },
    },
    {
      header: 'Fecha Creación',
      accessorKey: 'created_at',
      cell: ({ row }) => {
        const info = row.original as TicketDetailT;
        return new Date(info.created_at).toLocaleDateString('es-ES');
      },
    },
    {
      header: 'Última Actualización',
      accessorKey: 'updated_at',
      cell: ({ row }) => {
        const info = row.original as TicketDetailT;
        return new Date(info.updated_at).toLocaleDateString('es-ES');
      },
    },
    {
      header: 'Acciones',
      cell: ({ row }) => {
        const info = row.original as TicketDetailT;
        return (
          <TicketActionsDropdown
            ticket={info}
            evidenceTicketPermission={evidenceTicketPermission}
            changeStatusTicketPermission={changeStatusTicketPermission}
            onDeleteClick={() =>
              confirmationOpenModal({
                onConfirm: () => {
                  deleteTicket.mutate(parseInt(info.id));
                },
              })
            }
            onStatusChange={() =>
              openConfirmStateModal({
                onConfirm: () => {
                  const json = {
                    id: parseInt(info.id),
                    status: 'in_progress',
                  } as TicketT;
                  changeTicketStatus.mutate(json);
                },
                message:
                  '¿Estás seguro que deseas poner este ticket EN PROGRESO?',
                title: 'Confirmar cambio de estado',
                buttonColor: 'success',
                buttonLabel: 'Sí, poner en progreso',
                buttonCancelLabel: 'Cancelar',
              })
            }
          />
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
