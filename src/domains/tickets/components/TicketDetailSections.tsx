import {
  mdiAccount,
  mdiCalendar,
  mdiCellphone,
  mdiContentCopy,
  mdiCreditCard,
  mdiEmail,
  mdiImageMultiple,
  mdiLink,
  mdiPhone,
} from '@mdi/js';
import {
  TicketDetailT,
  TicketEvidenceMediaT,
  TicketEvidenceT,
  TicketPartChangeT,
} from '../tickets.type';
import BadgeStatus from './BadgeStatus';
import BaseIcon from '@/components/ui/BaseIcon';
import CardBox from '@/components/ui/cardBox/CardBox';
import { CustomerNameDisplay } from '@/domains/customers';

const getEvidenceTypeLabel = (type: string) => {
  const types = {
    reception: 'Recepción',
    part_removed: 'Pieza Removida',
    part_installed: 'Pieza Instalada',
    delivery: 'Entrega',
  };
  return types[type as keyof typeof types] || type;
};

const getPaymentMethodLabel = (method: string) => {
  const methods = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
    check: 'Cheque',
  };
  return methods[method as keyof typeof methods] || method;
};

export const TicketGeneralInfo = ({
  ticket,
  onCopyPublicLink,
  showPublicLink = false,
}: {
  ticket: TicketDetailT;
  onCopyPublicLink?: () => void;
  showPublicLink?: boolean;
}) => (
  <CardBox>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Información del Ticket
      </h3>
      <BadgeStatus status={ticket.status} />
    </div>

    <div className="space-y-3">
      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Descripción:
        </span>
        <p className="text-gray-900 dark:text-gray-100 mt-1">
          {ticket.description}
        </p>
      </div>

      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <BaseIcon path={mdiCalendar} size={16} className="mr-2" />
        <span>
          Creado: {new Date(ticket.created_at).toLocaleDateString('es-ES')}
        </span>
      </div>

      <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
        <BaseIcon path={mdiCalendar} size={16} className="mr-2" />
        <span>
          Actualizado: {new Date(ticket.updated_at).toLocaleDateString('es-ES')}
        </span>
      </div>

      {/* Enlace público para el cliente */}
      {showPublicLink && ticket.public_id && onCopyPublicLink && (
        <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <BaseIcon
                path={mdiLink}
                size={16}
                className="mr-2 text-gray-500"
              />
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                Enlace público:
              </span>
            </div>
            <button
              onClick={onCopyPublicLink}
              className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <BaseIcon path={mdiContentCopy} size={16} className="mr-2" />
              Copiar
            </button>
          </div>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Comparte este enlace con el cliente para que pueda ver el progreso
          </p>
        </div>
      )}
    </div>
  </CardBox>
);

export const TicketCustomerInfo = ({ ticket }: { ticket: TicketDetailT }) => (
  <CardBox>
    <div className="flex items-center mb-4">
      <BaseIcon path={mdiAccount} size={20} className="mr-2" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Cliente
      </h3>
    </div>

    <div className="space-y-3">
      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Nombre:
        </span>
        <p className="text-gray-900 dark:text-gray-100">
          <CustomerNameDisplay customer={ticket.customer} />
        </p>
      </div>

      <div className="flex items-center">
        <BaseIcon path={mdiEmail} size={16} className="mr-2 text-gray-500" />
        <span className="text-gray-900 dark:text-gray-100">
          {ticket.customer.email}
        </span>
      </div>

      <div className="flex items-center">
        <BaseIcon path={mdiPhone} size={16} className="mr-2 text-gray-500" />
        <span className="text-gray-900 dark:text-gray-100">
          {ticket.customer.phone}
        </span>
      </div>
    </div>
  </CardBox>
);

export const TicketUserInfo = ({
  ticket,
  isGuest = false,
}: {
  ticket: TicketDetailT;
  isGuest?: boolean;
}) => (
  <CardBox className="mb-6">
    <div className="flex items-center mb-4">
      <BaseIcon path={mdiAccount} size={20} className="mr-2" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {isGuest ? 'Ingresado por' : 'Técnico Asignado'}
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Nombre:
        </span>
        <p className="text-gray-900 dark:text-gray-100">
          {isGuest ? ticket.created_by_user.name : ticket.technician.name}
        </p>
      </div>

      <div className="flex items-center">
        <BaseIcon path={mdiEmail} size={16} className="mr-2 text-gray-500" />
        <span className="text-gray-900 dark:text-gray-100">
          {isGuest ? ticket.created_by_user.email : ticket.technician.email}
        </span>
      </div>
    </div>
  </CardBox>
);

export const TicketDeviceInfo = ({ ticket }: { ticket: TicketDetailT }) => (
  <CardBox className="mb-6">
    <div className="flex items-center mb-4">
      <BaseIcon path={mdiCellphone} size={20} className="mr-2" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Dispositivo
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Modelo:
        </span>
        <p className="text-gray-900 dark:text-gray-100">
          {ticket.device_model}
        </p>
      </div>

      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Número de Serie:
        </span>
        <p className="text-gray-900 dark:text-gray-100">
          {ticket.device_serial}
        </p>
      </div>
    </div>
  </CardBox>
);

export const TicketPaymentInfo = ({ ticket }: { ticket: TicketDetailT }) => (
  <CardBox className="mb-6">
    <div className="flex items-center mb-4">
      <BaseIcon path={mdiCreditCard} size={20} className="mr-2" />
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        Información de Pago
      </h3>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Monto Total:
        </span>
        <p className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          ${parseFloat(ticket.amount).toFixed(2)}
        </p>
      </div>

      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Método de Pago:
        </span>
        <p className="text-gray-900 dark:text-gray-100">
          {getPaymentMethodLabel(ticket.payment_method)}
        </p>
      </div>

      <div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
          Primer Pago:
        </span>
        <p className="text-gray-900 dark:text-gray-100">
          ${parseFloat(ticket.payment_first_amount).toFixed(2)}
        </p>
      </div>

      {/* Solo mostrar segundo pago si es mayor a 0 */}
      {ticket.payment_second_amount &&
        parseFloat(ticket.payment_second_amount) > 0 && (
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Segundo Pago:
            </span>
            <p className="text-gray-900 dark:text-gray-100">
              ${parseFloat(ticket.payment_second_amount).toFixed(2)}
            </p>
          </div>
        )}
    </div>

    {/* Mostrar saldo pendiente si hay segundo pago pendiente y el saldo es mayor a 0 */}
    {(() => {
      const pendingBalance =
        parseFloat(ticket.amount) - parseFloat(ticket.payment_first_amount);
      const hasSecondPaymentPending =
        ticket.payment_second_amount === null ||
        parseFloat(ticket.payment_second_amount || '0') === 0;

      return hasSecondPaymentPending && pendingBalance > 0 ? (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="flex items-center">
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Saldo Pendiente:
            </span>
            <span className="ml-2 text-sm font-semibold text-yellow-900 dark:text-yellow-100">
              ${pendingBalance.toFixed(2)}
            </span>
          </div>
        </div>
      ) : null;
    })()}
  </CardBox>
);

export const TicketEvidences = ({
  ticket,
  isGuest = false,
  onDeleteEvidence,
  showAddButton = false,
}: {
  ticket: TicketDetailT;
  isGuest?: boolean;
  onDeleteEvidence?: (evidenceId: number) => void;
  showAddButton?: boolean;
}) => (
  <CardBox className="mb-6">
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center">
        <BaseIcon path={mdiImageMultiple} size={20} className="mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Evidencias ({ticket.evidences?.length || 0})
        </h3>
      </div>

      {/* Botón para agregar evidencia - solo disponible en desarrollo y no para invitados */}
      {showAddButton && ticket.status === 'in_progress' && !isGuest && (
        <a
          href={`/tickets/${ticket.id}/evidence`}
          className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-yellow-600 rounded-full hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500"
        >
          <BaseIcon path={mdiImageMultiple} size={16} className="mr-2" />
          Agregar Evidencia
        </a>
      )}
    </div>

    {(!ticket.evidences || ticket.evidences.length === 0) && (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <BaseIcon
          path={mdiImageMultiple}
          size={48}
          className="mx-auto mb-2 opacity-50"
        />
        <p>No hay evidencias registradas</p>
        {!isGuest && ticket.status !== 'in_progress' && (
          <p className="text-sm mt-1">
            Solo se puede agregar evidencia cuando el ticket está en desarrollo
          </p>
        )}
      </div>
    )}

    {ticket.evidences && ticket.evidences.length > 0 && (
      <div className="space-y-4">
        {ticket.evidences.map((evidence: TicketEvidenceT) => (
          <div
            key={evidence.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-3">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {getEvidenceTypeLabel(evidence.type)}
                </span>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(evidence.created_at).toLocaleDateString('es-ES')}
                </span>
              </div>
              {/* Solo mostrar botón eliminar si el ticket NO está cerrado y no es invitado */}
              {!isGuest && ticket.status !== 'closed' && onDeleteEvidence && (
                <button
                  onClick={() => onDeleteEvidence(evidence.id)}
                  className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-full hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  <BaseIcon
                    path={mdiImageMultiple}
                    size={16}
                    className="mr-2"
                  />
                  Eliminar
                </button>
              )}
            </div>

            {evidence.comment && (
              <p className="text-gray-900 dark:text-gray-100 mb-3">
                {evidence.comment}
              </p>
            )}

            {evidence.media && evidence.media.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {evidence.media.map((media: TicketEvidenceMediaT) => (
                  <div key={media.id} className="relative group">
                    {media.media_type === 'image' ? (
                      <img
                        src={media.url}
                        alt="Evidencia"
                        className="w-full h-72 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity shadow-md"
                        onClick={() => window.open(media.url, '_blank')}
                      />
                    ) : media.media_type === 'video' ? (
                      <video
                        src={media.url}
                        controls
                        className="w-full h-72 rounded-lg shadow-md"
                        preload="metadata"
                      >
                        Tu navegador no soporta la reproducción de videos.
                      </video>
                    ) : (
                      <div
                        className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md"
                        onClick={() => window.open(media.url, '_blank')}
                      >
                        <BaseIcon
                          path={mdiImageMultiple}
                          size={32}
                          className="text-gray-500"
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    )}
  </CardBox>
);

export const TicketPartChanges = ({ ticket }: { ticket: TicketDetailT }) => {
  if (!ticket.part_changes || ticket.part_changes.length === 0) {
    return null;
  }

  return (
    <CardBox>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Cambios de Piezas ({ticket.part_changes.length})
      </h3>

      <div className="space-y-4">
        {ticket.part_changes.map((change: TicketPartChangeT) => (
          <div
            key={change.id}
            className="border border-gray-200 dark:border-gray-700 rounded-lg p-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-red-600 dark:text-red-400">
                  Pieza Removida:
                </span>
                <p className="text-gray-900 dark:text-gray-100">
                  {change.removed_part_name}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">
                  Pieza Instalada:
                </span>
                <p className="text-gray-900 dark:text-gray-100">
                  {change.installed_part_name}
                </p>
              </div>
            </div>

            <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
              {new Date(change.created_at).toLocaleDateString('es-ES')}
            </div>
          </div>
        ))}
      </div>
    </CardBox>
  );
};
