import { mdiLock } from '@mdi/js';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import {
  useChangeTicketStatus,
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
  const changeTicketStatus = useChangeTicketStatus();
  const postTicketEvidence = usePostTicketEvidence();
  const { success } = useAddToast();

  const { id } = useParams();
  const { data, isLoading } = useGetTicket(id);

  const currentUser = useAuthStore((state) => state.user);
  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);

  const schema = Yup.object().shape({
    evidence_comment: Yup.string().default(EMPTY_STRING).required('Requerido'),
    evidence_type: Yup.string().default('delivery').required('Requerido'),
  });

  const submit = async (values: ValuesFormT) => {
    try {
      setIsLoadingGeneral(true);
      if (!id) throw new Error('ID de ticket no encontrado');
      // Cambiar estado del ticket a cerrado
      const ticketUpdate: Partial<TicketT> = {
        id: parseInt(id),
        status: 'closed',
      };
      await changeTicketStatus.mutateAsync(ticketUpdate as TicketT);

      // Guardar evidencia
      if (evidenceFiles.length > 0 && values.evidence_comment) {
        const evidenceData: Partial<TicketEvidenceT> = {
          ticket_id: parseInt(id),
          type: 'delivery',
          comment: values.evidence_comment as string,
          files: evidenceFiles,
          user_id: currentUser?.id ?? 0,
        };
        await postTicketEvidence.mutateAsync(evidenceData as TicketEvidenceT);
        success('Ticket cerrado y evidencia guardada correctamente');
      } else {
        success('Ticket cerrado correctamente');
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
