import {
  mdiCamera,
  mdiCheckCircle,
  mdiDelete,
  mdiEye,
  mdiPencil,
  mdiPlay,
} from '@mdi/js';
import { TicketDetailT } from '../tickets.type';
import ActionsDropdown, { ActionGroup } from '@/components/ui/ActionsDropdown';
import BaseButton from '@/components/ui/baseButton';

type TicketActionsDropdownProps = {
  ticket: TicketDetailT;
  onDeleteClick: () => void;
  onStatusChange: () => void;
};

export default function TicketActionsDropdown({
  ticket,
  onDeleteClick,
  onStatusChange,
}: TicketActionsDropdownProps) {
  const groups: ActionGroup[] = [
    {
      items: [
        {
          label: 'Editar Ticket',
          icon: mdiPencil,
          href: `/tickets/${ticket.id}/edit`,
          hidden: ticket.status === 'closed',
        },
        {
          label: 'Agregar Evidencia',
          icon: mdiCamera,
          href: `/tickets/${ticket.id}/evidence`,
          hidden: ticket.status !== 'in_progress',
        },
      ],
      separator: true,
    },
    {
      items: [
        {
          label: 'Poner en Progreso',
          icon: mdiPlay,
          onClick: onStatusChange,
          hidden: ticket.status === 'in_progress' || ticket.status === 'closed',
        },
        {
          label: 'Cerrar Ticket',
          icon: mdiCheckCircle,
          href: `/tickets/${ticket.id}/close`,
          hidden: ticket.status !== 'in_progress',
        },
      ],
      separator: true,
    },
    {
      items: [
        {
          label: 'Eliminar Ticket',
          icon: mdiDelete,
          onClick: onDeleteClick,
          variant: 'danger',
        },
      ],
    },
  ];

  return (
    <div className="flex items-center gap-2">
      <BaseButton
        href={`/tickets/${ticket.id}/view`}
        color="info"
        icon={mdiEye}
        label="Ver"
        roundedFull
        small
      />
      <ActionsDropdown groups={groups} />
    </div>
  );
}
