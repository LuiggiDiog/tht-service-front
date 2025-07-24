import {
  mdiAccount,
  mdiArrowLeft,
  mdiCalendar,
  mdiCellphone,
  mdiCreditCard,
  mdiDelete,
  mdiEmail,
  mdiFileImage,
  mdiImageMultiple,
  mdiPhone,
} from '@mdi/js';
import { useNavigate, useParams } from 'react-router';
import BadgeStatus from '../components/BadgeStatus';
import { useDeleteTicketEvidence, useGetTicket } from '../tickets.query';
import BaseIcon from '@/components/ui/BaseIcon';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import CardBox from '@/components/ui/cardBox/CardBox';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useConfirmationDeleteModal } from '@/components/ui/modals';

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

export default function TicketDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: ticket, isLoading, error } = useGetTicket(id);
  const deleteTicketEvidence = useDeleteTicketEvidence();
  const { openModal: confirmationOpenModal, Modal: ConfirmationModal } =
    useConfirmationDeleteModal();

  if (isLoading) {
    return <LoadingSection />;
  }

  if (error || !ticket) {
    return (
      <SectionCustom>
        <div className="text-center py-8">
          <p className="text-red-500">Error al cargar el ticket</p>
          <BaseButton
            onClick={() => navigate('/tickets')}
            label="Volver a la lista"
            color="info"
            className="mt-4"
          />
        </div>
      </SectionCustom>
    );
  }

  return (
    <SectionCustom>
      <SectionTitleLineWithButton main title={`Ticket #${ticket.id}`}>
        <BaseButton
          onClick={() => navigate('/tickets')}
          icon={mdiArrowLeft}
          label="Volver"
          color="info"
          roundedFull
        />
      </SectionTitleLineWithButton>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Información General del Ticket */}
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
                Creado:{' '}
                {new Date(ticket.created_at).toLocaleDateString('es-ES')}
              </span>
            </div>

            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <BaseIcon path={mdiCalendar} size={16} className="mr-2" />
              <span>
                Actualizado:{' '}
                {new Date(ticket.updated_at).toLocaleDateString('es-ES')}
              </span>
            </div>
          </div>
        </CardBox>

        {/* Información del Cliente */}
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
                {ticket.customer.name}
              </p>
            </div>

            <div className="flex items-center">
              <BaseIcon
                path={mdiEmail}
                size={16}
                className="mr-2 text-gray-500"
              />
              <span className="text-gray-900 dark:text-gray-100">
                {ticket.customer.email}
              </span>
            </div>

            <div className="flex items-center">
              <BaseIcon
                path={mdiPhone}
                size={16}
                className="mr-2 text-gray-500"
              />
              <span className="text-gray-900 dark:text-gray-100">
                {ticket.customer.phone}
              </span>
            </div>
          </div>
        </CardBox>
      </div>

      {/* Información del Técnico */}
      <CardBox className="mb-6">
        <div className="flex items-center mb-4">
          <BaseIcon path={mdiAccount} size={20} className="mr-2" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Técnico Asignado
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
              Nombre:
            </span>
            <p className="text-gray-900 dark:text-gray-100">
              {ticket.technician.name}
            </p>
          </div>

          <div className="flex items-center">
            <BaseIcon
              path={mdiEmail}
              size={16}
              className="mr-2 text-gray-500"
            />
            <span className="text-gray-900 dark:text-gray-100">
              {ticket.technician.email}
            </span>
          </div>
        </div>
      </CardBox>

      {/* Información del Dispositivo */}
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

      {/* Información de Pagos */}
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

      {/* Evidencias */}
      <CardBox className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <BaseIcon path={mdiImageMultiple} size={20} className="mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Evidencias ({ticket.evidences?.length || 0})
            </h3>
          </div>

          {/* Botón para agregar evidencia - solo disponible en desarrollo */}
          {ticket.status === 'in_progress' && (
            <BaseButton
              href={`/tickets/${ticket.id}/evidence`}
              color="warning"
              icon={mdiImageMultiple}
              label="Agregar Evidencia"
              roundedFull
              small
            />
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
            {ticket.status !== 'in_progress' && (
              <p className="text-sm mt-1">
                Solo se puede agregar evidencia cuando el ticket está en
                desarrollo
              </p>
            )}
          </div>
        )}

        {ticket.evidences && ticket.evidences.length > 0 && (
          <div className="space-y-4">
            {ticket.evidences.map((evidence) => (
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
                      {new Date(evidence.created_at).toLocaleDateString(
                        'es-ES'
                      )}
                    </span>
                  </div>
                  {/* Solo mostrar botón eliminar si el ticket NO está cerrado */}
                  {ticket.status !== 'closed' && (
                    <BaseButton
                      color="danger"
                      icon={mdiDelete}
                      label="Eliminar"
                      onClick={() =>
                        confirmationOpenModal({
                          onConfirm: () => {
                            deleteTicketEvidence.mutate(evidence.id);
                          },
                        })
                      }
                      roundedFull
                      small
                    />
                  )}
                </div>

                {evidence.comment && (
                  <p className="text-gray-900 dark:text-gray-100 mb-3">
                    {evidence.comment}
                  </p>
                )}

                {evidence.media && evidence.media.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {evidence.media.map((media) => (
                      <div key={media.id} className="relative group">
                        {media.media_type === 'image' ? (
                          <img
                            src={media.url}
                            alt="Evidencia"
                            className="w-full h-72 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity shadow-md"
                            onClick={() => window.open(media.url, '_blank')}
                          />
                        ) : (
                          <div
                            className="w-full h-48 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors shadow-md"
                            onClick={() => window.open(media.url, '_blank')}
                          >
                            <BaseIcon
                              path={mdiFileImage}
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

      {/* Cambios de Piezas */}
      {ticket.part_changes && ticket.part_changes.length > 0 && (
        <CardBox>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Cambios de Piezas ({ticket.part_changes.length})
          </h3>

          <div className="space-y-4">
            {ticket.part_changes.map((change) => (
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
      )}
      <ConfirmationModal />
    </SectionCustom>
  );
}
