import { mdiArrowLeft } from '@mdi/js';
import { useNavigate, useParams } from 'react-router';
import {
  TicketCustomerInfo,
  TicketDeviceInfo,
  TicketEvidences,
  TicketGeneralInfo,
  TicketPartChanges,
  TicketPaymentInfo,
  TicketUserInfo,
} from '../components';
import { useDeleteTicketEvidence, useGetTicket } from '../tickets.query';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useConfirmationDeleteModal } from '@/components/ui/modals';

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

  const handleDeleteEvidence = (evidenceId: number) => {
    confirmationOpenModal({
      onConfirm: () => {
        deleteTicketEvidence.mutate(evidenceId);
      },
    });
  };

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
        <TicketGeneralInfo ticket={ticket} />

        {/* Información del Cliente */}
        <TicketCustomerInfo ticket={ticket} />
      </div>

      {/* Información del Técnico */}
      <TicketUserInfo ticket={ticket} isGuest={false} />

      {/* Información del Dispositivo */}
      <TicketDeviceInfo ticket={ticket} />

      {/* Información de Pagos */}
      <TicketPaymentInfo ticket={ticket} />

      {/* Evidencias */}
      <TicketEvidences
        ticket={ticket}
        isGuest={false}
        onDeleteEvidence={handleDeleteEvidence}
        showAddButton={true}
      />

      {/* Cambios de Piezas */}
      <TicketPartChanges ticket={ticket} />

      <ConfirmationModal />
    </SectionCustom>
  );
}
