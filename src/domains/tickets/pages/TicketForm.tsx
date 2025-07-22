import { mdiTableBorder } from '@mdi/js';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import { useUserOptions } from '../hooks/useUserOptions';
import {
  useGetTicket,
  usePostTicket,
  usePostTicketEvidence,
  usePutTicket,
} from '../tickets.query';
import { TicketEvidenceT, TicketT } from '../tickets.type';
import Form, {
  Field,
  FormField,
  SelectField,
  UploadMultipleFilesDropZone,
  ValuesFormT,
} from '@/components/form';
import BaseDivider from '@/components/ui/BaseDivider';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingOverlay from '@/components/ui/loadings/LoadingOverlay';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useCustomerOptions } from '@/domains/customers';
import { useAddToast } from '@/domains/toast';
import { imageToBase64 } from '@/utils/ImagesUtils';
import { EMPTY_STRING } from '@/utils/constants';

export default function TicketForm() {
  const navigate = useNavigate();
  const postTicket = usePostTicket();
  const putTicket = usePutTicket();
  const postTicketEvidence = usePostTicketEvidence();
  const { warning, success } = useAddToast();

  const { id } = useParams();
  const { data, isLoading } = useGetTicket(id);
  const { userOptions } = useUserOptions();
  const { customerOptions } = useCustomerOptions();

  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);

  const schema = Yup.object().shape({
    customer_id: Yup.number().required('Requerido'),
    technician_id: Yup.number().required('Requerido'),
    status: Yup.string().required('Requerido').default('open'),
    description: Yup.string()
      .required('Requerido')
      .default(EMPTY_STRING)
      .min(10, 'Mínimo 10 caracteres'),
    evidence_comment: Yup.string().default(EMPTY_STRING),
    evidence_type: Yup.string().default('reception'),
  });

  const submit = async (values: ValuesFormT) => {
    try {
      if (isLoadingUpload) {
        warning(
          'Por favor espera a que se completen las optimizaciones de las imágenes'
        );
        return;
      }

      setIsLoadingGeneral(true);

      const json = values as TicketT;
      json.id = parseInt(id as string);

      const resp = id
        ? await putTicket.mutateAsync(json)
        : await postTicket.mutateAsync(json);

      if (!resp.id) {
        throw resp;
      }

      // Si hay archivos de evidencia, registrarlos
      if (evidenceFiles.length > 0 && values.evidence_comment) {
        const mediaBase64: string[] = [];

        for (const file of evidenceFiles) {
          const base64 = await imageToBase64(file);
          mediaBase64.push(base64);
        }

        const evidenceData: Partial<TicketEvidenceT> = {
          ticket_id: resp.id,
          type: values.evidence_type as
            | 'reception'
            | 'part_removed'
            | 'part_installed'
            | 'delivery',
          comment: values.evidence_comment as string,
          media: mediaBase64,
          user_id: values.technician_id as number, // Asumimos que el técnico sube la evidencia
        };

        await postTicketEvidence.mutateAsync(evidenceData as TicketEvidenceT);
        success('Ticket y evidencias guardados correctamente');
      } else {
        success('Ticket guardado correctamente');
      }

      navigate('/tickets');
    } catch (error) {
      console.error('Error submitting form:', error);
      warning('Error al guardar el ticket');
    } finally {
      setIsLoadingGeneral(false);
    }
  };

  const handleEvidenceDrop = (files: File[]) => {
    setEvidenceFiles(files);
  };

  const getTitle = () => {
    if (id) {
      return `Editar ticket ${data?.id}`;
    }
    return 'Nuevo ticket';
  };

  if (isLoading) {
    return <LoadingSection />;
  }

  return (
    <Form data={data} onSubmit={submit} schema={schema}>
      <SectionTitleLineWithButton
        backBtn
        main
        title={getTitle()}
        icon={mdiTableBorder}
      >
        <BaseButton color="info" label="Guardar" type="submit" />
      </SectionTitleLineWithButton>

      <FormField label="Cliente">
        <Field
          name="customer_id"
          component={SelectField}
          options={customerOptions}
          placeholder="Selecciona un cliente"
        />
      </FormField>

      <FormField label="Técnico">
        <Field
          name="technician_id"
          component={SelectField}
          options={userOptions}
          placeholder="Selecciona un técnico"
        />
      </FormField>

      <FormField label="Descripción" hasTextareaHeight>
        <Field
          name="description"
          label="Descripción"
          placeholder="Describe el problema o solicitud del ticket"
        />
      </FormField>

      <FormField label="Estado">
        <Field
          name="status"
          component={SelectField}
          options={[
            { value: 'open', label: 'Abierto' },
            { value: 'in_progress', label: 'En Progreso' },
            { value: 'closed', label: 'Cerrado' },
          ]}
        />
      </FormField>

      <BaseDivider />

      <h3 className="text-lg font-semibold mb-4">Evidencias del Ticket</h3>

      <FormField label="Tipo de Evidencia">
        <Field
          name="evidence_type"
          component={SelectField}
          options={[
            { value: 'reception', label: 'Recepción' },
            { value: 'part_removed', label: 'Pieza Removida' },
            { value: 'part_installed', label: 'Pieza Instalada' },
            { value: 'delivery', label: 'Entrega' },
          ]}
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
        <UploadMultipleFilesDropZone
          message="Arrastra las imágenes de evidencia aquí"
          onDrop={handleEvidenceDrop}
          type="image"
          maxFiles={3}
          setLoading={setIsLoadingUpload}
        />
      </div>

      <BaseDivider className="pb-16" />

      {isLoadingGeneral && <LoadingOverlay />}
    </Form>
  );
}
