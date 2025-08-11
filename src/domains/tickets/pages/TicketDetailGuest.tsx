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
import { useGetTicketPublic } from '../tickets.query';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingSection from '@/components/ui/loadings/LoadingSection';

export default function TicketDetailGuest() {
  const { public_id } = useParams();
  const navigate = useNavigate();
  const { data: ticket, isLoading, error } = useGetTicketPublic(public_id);

  if (isLoading) {
    return <LoadingSection />;
  }

  if (error || !ticket) {
    return (
      <SectionCustom>
        <div className="text-center py-8">
          <p className="text-red-500">Error al cargar el ticket</p>
          <BaseButton
            onClick={() => navigate('/')}
            label="Volver al inicio"
            color="info"
            className="mt-4"
          />
        </div>
      </SectionCustom>
    );
  }

  return (
    <SectionCustom>
      <SectionTitleLineWithButton main title={`Ticket #${ticket.id}`} />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Información General del Ticket */}
        <TicketGeneralInfo ticket={ticket} />

        {/* Información del Cliente */}
        <TicketCustomerInfo ticket={ticket} />
      </div>

      {/* Información de la Persona que Creó el Ticket */}
      <TicketUserInfo ticket={ticket} isGuest={true} />

      {/* Información del Dispositivo */}
      <TicketDeviceInfo ticket={ticket} />

      {/* Información de Pagos */}
      <TicketPaymentInfo ticket={ticket} />

      {/* Evidencias - Solo lectura */}
      <TicketEvidences ticket={ticket} isGuest={true} showAddButton={false} />

      {/* Cambios de Piezas */}
      <TicketPartChanges ticket={ticket} />
    </SectionCustom>
  );
}
