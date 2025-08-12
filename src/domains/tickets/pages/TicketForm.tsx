import { mdiTableBorder } from '@mdi/js';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';

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
import MoneyField from '@/components/form/components/MoneyField';
import { UploadFilesFormData } from '@/components/form/components/uploadFile';
import BaseDivider from '@/components/ui/BaseDivider';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingOverlay from '@/components/ui/loadings/LoadingOverlay';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useCustomerOptions } from '@/domains/customers';
import { useAddToast } from '@/domains/toast';
import { usePaymentMethodOptions } from '@/payments';
import { EMPTY_STRING } from '@/utils/constants';

export default function TicketForm() {
  const navigate = useNavigate();
  const postTicket = usePostTicket();
  const putTicket = usePutTicket();
  const postTicketEvidence = usePostTicketEvidence();
  const { success, error } = useAddToast();

  const { id } = useParams();
  const { data, isLoading } = useGetTicket(id);
  const { customerOptions } = useCustomerOptions();
  const { paymentMethodOptions } = usePaymentMethodOptions();

  const [evidenceFiles, setEvidenceFiles] = useState<File[]>([]);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);

  const schema = Yup.object().shape({
    customer_id: Yup.number().required('Requerido'),
    device_model: Yup.string().required('Requerido'),
    device_serial: Yup.string().required('Requerido'),
    description: Yup.string()
      .required('Requerido')
      .default(EMPTY_STRING)
      .min(10, 'Mínimo 10 caracteres'),
    amount: Yup.number().required('Requerido'),
    payment_method: Yup.string().required('Requerido'),
    payment_first_amount: Yup.number().required('Requerido'),
    status: Yup.string().required('Requerido').default('open'),

    evidence_type: Yup.string().default('reception'),
    evidence_comment: Yup.string().default(EMPTY_STRING),
  });

  const submit = async (values: ValuesFormT) => {
    try {
      setIsLoadingGeneral(true);

      // Validar que haya al menos un archivo de evidencia
      if (evidenceFiles.length === 0) {
        error('Debe subir al menos un archivo de evidencia');
        return;
      }

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
          type: 'reception',
          comment: values.evidence_comment as string,
          files: evidenceFiles,
        };

        await postTicketEvidence.mutateAsync(evidenceData as TicketEvidenceT);
        success('Ticket y evidencias guardados correctamente');
      } else {
        success('Ticket guardado correctamente');
      }

      navigate('/tickets');
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

      <FormField label="Modelo de dispositivo">
        <Field
          name="device_model"
          label="Modelo de dispositivo"
          placeholder="Modelo de dispositivo"
        />
      </FormField>

      <FormField label="Serial de dispositivo">
        <Field
          name="device_serial"
          label="Serial de dispositivo"
          placeholder="Serial de dispositivo"
        />
      </FormField>

      <FormField label="Descripción" hasTextareaHeight>
        <Field
          name="description"
          label="Descripción"
          placeholder="Describe el problema o solicitud del ticket"
        />
      </FormField>

      <FormField label="Precio del servicio">
        <Field name="amount" component={MoneyField} />
      </FormField>

      <FormField label="Método de abono">
        <Field
          name="payment_method"
          component={SelectField}
          options={paymentMethodOptions}
          placeholder="Selecciona un método de abono"
        />
      </FormField>

      <FormField label="Abono">
        <Field name="payment_first_amount" component={MoneyField} />
      </FormField>

      <FormField label="Estado">
        <Field
          name="status"
          component={SelectField}
          options={[{ value: 'open', label: 'Abierto' }]}
          isDisabled={!id}
        />
      </FormField>

      <BaseDivider />

      <h3 className="text-lg font-semibold mb-4">Evidencias de Ingreso</h3>

      <FormField label="Tipo de Evidencia">
        <Field
          name="evidence_type"
          component={SelectField}
          options={[{ value: 'reception', label: 'Recepción' }]}
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
          Archivos de Evidencia *
        </label>
        <UploadFilesFormData
          message="Arrastra las imágenes de evidencia aquí (mínimo 1 archivo)"
          onFilesChange={handleEvidenceDrop}
          type="media"
        />
      </div>

      <BaseDivider className="pb-16" />

      {isLoadingGeneral && <LoadingOverlay />}
    </Form>
  );
}
