import { mdiTableBorder } from '@mdi/js';
import { useState } from 'react';
import { useParams } from 'react-router';
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
  ValuesFormT,
} from '@/components/form';
import { UploadFilesFormData } from '@/components/form/components/uploadFile';
import BaseDivider from '@/components/ui/BaseDivider';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingOverlay from '@/components/ui/loadings/LoadingOverlay';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useCustomerOptions } from '@/domains/customers';
import { useAddToast } from '@/domains/toast';
import { EMPTY_STRING } from '@/utils/constants';

export default function TicketForm() {
  const postTicket = usePostTicket();
  const putTicket = usePutTicket();
  const postTicketEvidence = usePostTicketEvidence();
  const { success } = useAddToast();

  const { id } = useParams();
  const { data, isLoading } = useGetTicket(id);
  const { userOptions } = useUserOptions();
  const { customerOptions } = useCustomerOptions();

  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
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
        const evidenceData: Partial<TicketEvidenceT> = {
          ticket_id: resp.id,
          type: values.evidence_type as
            | 'reception'
            | 'part_removed'
            | 'part_installed'
            | 'delivery',
          comment: values.evidence_comment as string,
          user_id: values.technician_id as number, // Asumimos que el técnico sube la evidencia
          files: evidenceFiles,
        };

        await postTicketEvidence.mutateAsync(evidenceData as TicketEvidenceT);
        success('Ticket y evidencias guardados correctamente');
      } else {
        success('Ticket guardado correctamente');
      }

      /*  */
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsLoadingGeneral(false);
    }
  };

  const handleEvidenceDrop = (files: File[]) => {
    setEvidenceFiles(files);
  };

  const getTitle = () => {
    if (id) {
      return `Editar Ticket ${data?.id}`;
    }
    return 'Nuevo Ticket';
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
          isDisabled={!id}
        />
      </FormField>

      <BaseDivider />

      <h3 className="text-lg font-semibold mb-4">Evidencias de Ingreso</h3>

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
          isDisabled={!id}
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
