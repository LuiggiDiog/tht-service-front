import { mdiArrowLeft, mdiCamera } from '@mdi/js';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import { useGetTicket, usePostTicketEvidence } from '../tickets.query';
import { TicketEvidenceT } from '../tickets.type';
import Form, { Field, FormField, ValuesFormT } from '@/components/form';
import { UploadFilesFormData } from '@/components/form/components/uploadFile';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingOverlay from '@/components/ui/loadings/LoadingOverlay';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useAddToast } from '@/domains/toast';
import { EMPTY_STRING } from '@/utils/constants';

export default function TicketEvidenceForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const postTicketEvidence = usePostTicketEvidence();
  const { data: ticket, isLoading } = useGetTicket(id);
  const { success, error } = useAddToast();

  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);

  const schema = Yup.object().shape({
    type: Yup.string().required('Requerido').default(EMPTY_STRING),
    comment: Yup.string()
      .required('Requerido')
      .default(EMPTY_STRING)
      .min(10, 'Mínimo 10 caracteres'),
  });

  const submit = async (values: ValuesFormT) => {
    try {
      setIsLoadingGeneral(true);

      if (!id) {
        error('ID de ticket no encontrado');
        return;
      }

      if (evidenceFiles.length === 0) {
        error('Debe subir al menos un archivo de evidencia');
        return;
      }

      const evidenceData: Partial<TicketEvidenceT> = {
        ticket_id: parseInt(id),
        type: values.type as string,
        comment: values.comment as string,
        files: evidenceFiles,
      };

      const resp = await postTicketEvidence.mutateAsync(
        evidenceData as TicketEvidenceT
      );

      if (!resp.id) {
        throw resp;
      }

      success('Evidencia guardada correctamente');
      navigate(`/tickets/${id}`);
    } catch (error) {
      console.error('Error submitting evidence:', error);
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

  if (!ticket) {
    return (
      <SectionCustom>
        <div className="text-center py-8">
          <p className="text-red-500">Ticket no encontrado</p>
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

  // Verificar que el ticket esté en desarrollo para poder agregar evidencia
  if (ticket.status !== 'in_progress') {
    return (
      <SectionCustom>
        <div className="text-center py-8">
          <p className="text-red-500">
            Solo se puede agregar evidencia cuando el ticket está en desarrollo
          </p>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Estado actual del ticket: {ticket.status}
          </p>
          <BaseButton
            onClick={() => navigate(`/tickets/${id}`)}
            label="Ver Ticket"
            color="info"
            className="mt-4 mr-2"
          />
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
      <Form onSubmit={submit} schema={schema}>
        <SectionTitleLineWithButton
          main
          title={`Agregar Evidencia - Ticket #${ticket.id}`}
          icon={mdiCamera}
          backBtn
        >
          <BaseButton
            onClick={() => navigate('/tickets')}
            icon={mdiArrowLeft}
            label="Volver"
            color="info"
            roundedFull
          />
        </SectionTitleLineWithButton>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow mb-6">
          <h3 className="text-lg font-semibold mb-2">Información del Ticket</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Cliente: {ticket.customer?.name} {ticket.customer?.last_name}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Dispositivo: {ticket.device_model} - {ticket.device_serial}
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Descripción: {ticket.description}
          </p>
        </div>

        <FormField label="Tipo de Evidencia">
          <Field
            name="type"
            label="Tipo de Evidencia"
            placeholder="Ingresa el tipo de evidencia"
          />
        </FormField>

        <FormField label="Comentario" hasTextareaHeight>
          <Field
            name="comment"
            label="Comentario"
            placeholder="Describe qué muestran las evidencias adjuntas"
          />
        </FormField>

        <div className="w-full pb-4 md:mb-0">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Archivos de Evidencia *
          </label>
          <UploadFilesFormData
            message="Arrastra las imágenes de evidencia aquí (mínimo 1 archivo)"
            onFilesChange={handleEvidenceDrop}
            type="image"
            maxFiles={5}
          />
          {evidenceFiles.length > 0 && (
            <p className="text-sm text-green-600 mt-2">
              {evidenceFiles.length} archivo(s) seleccionado(s)
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-4 pt-6">
          <BaseButton
            color="info"
            label="Cancelar"
            onClick={() => navigate('/tickets')}
          />
          <BaseButton
            color="success"
            label="Guardar Evidencia"
            type="submit"
            disabled={evidenceFiles.length === 0}
          />
        </div>

        {isLoadingGeneral && <LoadingOverlay />}
      </Form>
    </SectionCustom>
  );
}
