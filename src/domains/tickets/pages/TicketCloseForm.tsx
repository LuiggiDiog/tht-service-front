import { mdiLock } from '@mdi/js';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import {
  useCloseTicket,
  useGetTicket,
  usePostTicketEvidence,
} from '../tickets.query';
import { TicketEvidenceT, TicketT } from '../tickets.type';
import Form, {
  Field,
  FormField,
  SelectField,
  ValuesFormT,
} from '@/components/form';
import { UploadFilesFormData } from '@/components/form/components/uploadFile';
import BaseDivider from '@/components/ui/BaseDivider';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingOverlay from '@/components/ui/loadings/LoadingOverlay';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useAuthStore } from '@/domains/auth';
import { useAddToast } from '@/domains/toast';
import { EMPTY_STRING } from '@/utils/constants';

export default function TicketCloseForm() {
  const navigate = useNavigate();
  const closeTicket = useCloseTicket();
  const postTicketEvidence = usePostTicketEvidence();
  const { success } = useAddToast();

  const { id } = useParams();
  const { data, isLoading } = useGetTicket(id);

  const currentUser = useAuthStore((state) => state.user);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);

  // Calcular si hay valor pendiente
  const pendingAmount = data
    ? parseFloat(data.amount) - parseFloat(data.payment_first_amount)
    : 0;
  const hasPendingPayment =
    pendingAmount > 0 &&
    (!data?.payment_second_amount ||
      parseFloat(data.payment_second_amount) === 0);

  const schema = Yup.object().shape({
    evidence_comment: Yup.string().default(EMPTY_STRING).required('Requerido'),
    evidence_type: Yup.string().default('delivery').required('Requerido'),
    ...(hasPendingPayment && {
      payment_second_amount: Yup.number()
        .min(0, 'El monto debe ser mayor o igual a 0')
        .max(
          pendingAmount,
          `El monto no puede ser mayor a $${pendingAmount.toFixed(2)}`
        )
        .required('Requerido para completar el pago'),
    }),
  });

  const submit = async (values: ValuesFormT) => {
    try {
      setIsLoadingGeneral(true);
      if (!id) throw new Error('ID de ticket no encontrado');

      // Preparar datos del ticket para cerrar
      const ticketUpdate: Partial<TicketT> = {
        id: parseInt(id),
      };

      // Agregar segundo pago si es necesario
      if (hasPendingPayment && values.payment_second_amount) {
        ticketUpdate.payment_second_amount = Number(
          values.payment_second_amount
        );
      }

      // Usar closeTicket si hay segundo pago, sino usar changeTicketStatus
      const resp = await closeTicket.mutateAsync(ticketUpdate as TicketT);
      if (!resp?.id) {
        return;
      }

      // Guardar evidencia
      if (evidenceFiles.length > 0 && values.evidence_comment) {
        const evidenceData: Partial<TicketEvidenceT> = {
          ticket_id: parseInt(id),
          type: 'delivery',
          comment: values.evidence_comment as string,
          files: evidenceFiles,
          created_by: (currentUser?.id ?? 0).toString(),
        };
        await postTicketEvidence.mutateAsync(evidenceData as TicketEvidenceT);

        if (hasPendingPayment && values.payment_second_amount) {
          success(
            'Ticket cerrado con segundo pago y evidencia guardada correctamente'
          );
        } else {
          success('Ticket cerrado y evidencia guardada correctamente');
        }
      } else {
        if (hasPendingPayment && values.payment_second_amount) {
          success('Ticket cerrado con segundo pago correctamente');
        } else {
          success('Ticket cerrado correctamente');
        }
      }
      navigate('/tickets');
    } catch (error) {
      console.error('Error cerrando ticket:', error);
    } finally {
      setIsLoadingGeneral(false);
    }
  };

  const handleEvidenceDrop = (files: File[]) => {
    setEvidenceFiles(files);
  };

  if (isLoading) {
    return <LoadingSection />;
  }

  return (
    <Form onSubmit={submit} schema={schema}>
      <SectionTitleLineWithButton
        backBtn
        main
        title={`Cerrar Ticket #${data?.id}`}
        icon={mdiLock}
      >
        <BaseButton color="danger" label="Cerrar Ticket" type="submit" />
      </SectionTitleLineWithButton>

      <FormField label="Tipo de Evidencia">
        <Field
          name="evidence_type"
          component={SelectField}
          options={[
            { value: 'delivery', label: 'Entrega' },
            { value: 'reception', label: 'Recepción' },
            { value: 'part_removed', label: 'Pieza Removida' },
            { value: 'part_installed', label: 'Pieza Instalada' },
          ]}
          isDisabled
        />
      </FormField>

      <FormField label="Comentario de Evidencia" hasTextareaHeight>
        <Field
          name="evidence_comment"
          label="Comentario de Evidencia"
          placeholder="Describe qué muestran las evidencias adjuntas"
        />
      </FormField>

      {/* Campo de segundo pago si hay valor pendiente */}
      {hasPendingPayment && (
        <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
          <div className="mb-3">
            <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
              Valor Pendiente: ${pendingAmount.toFixed(2)}
            </span>
          </div>
          <FormField label="Segundo Pago (Opcional)">
            <Field
              name="payment_second_amount"
              label="Segundo Pago"
              placeholder={`Máximo: $${pendingAmount.toFixed(2)}`}
              type="number"
              step="0.01"
            />
          </FormField>
        </div>
      )}

      <div className="w-full pb-4 md:mb-0">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Archivos de Evidencia
        </label>
        <UploadFilesFormData
          message="Arrastra las imágenes de evidencia aquí"
          onFilesChange={handleEvidenceDrop}
          type="image"
          maxFiles={3}
        />
      </div>

      <BaseDivider className="pb-16" />
      {isLoadingGeneral && <LoadingOverlay />}
    </Form>
  );
}
