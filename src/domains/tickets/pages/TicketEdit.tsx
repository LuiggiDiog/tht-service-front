import { mdiInformation, mdiPencil } from '@mdi/js';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';

import BadgeStatus from '../components/BadgeStatus';
import { useDeviceLocationNameResolver } from '../hooks/useDeviceLocationName';
import { useLocationOptions } from '../hooks/useLocationOptions';
import { useGetTicket, usePutTicket } from '../tickets.query';
import { TicketT } from '../tickets.type';
import { getPaymentMethodLabel } from '../tickets.utils';
import Form, {
  Field,
  FormField,
  SelectField,
  ValuesFormT,
} from '@/components/form';
import MoneyField from '@/components/form/components/MoneyField';
import BaseDivider from '@/components/ui/BaseDivider';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import CardBox from '@/components/ui/cardBox';
import LoadingOverlay from '@/components/ui/loadings/LoadingOverlay';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { CustomerNameDisplay } from '@/domains/customers';
import { useAddToast } from '@/domains/toast';
import { UserNameDisplay } from '@/domains/users';

export default function TicketEdit() {
  const navigate = useNavigate();
  const putTicket = usePutTicket();
  const { success, error } = useAddToast();

  const { id } = useParams();
  const { data, isLoading } = useGetTicket(id);
  const { locationOptions } = useLocationOptions();
  const { getName: getLocationName } = useDeviceLocationNameResolver();
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);

  const schema = Yup.object().shape({
    amount: Yup.number()
      .required('El precio es requerido')
      .min(0, 'El precio debe ser mayor a 0'),
    device_location: Yup.string().required('La ubicación es requerida'),
    // Aquí se pueden agregar más campos en el futuro
    // device_model: Yup.string().required('El modelo es requerido'),
    // description: Yup.string().required('La descripción es requerida'),
  });

  const submit = async (values: ValuesFormT) => {
    try {
      setIsLoadingGeneral(true);

      if (!data) {
        throw new Error('No se pudo cargar la información del ticket');
      }

      const ticketData = {
        id: parseInt(id as string),
        amount: values.amount as number,
        device_location: values.device_location as string,
      } as TicketT;

      console.log('Datos a enviar para actualización:', ticketData);

      const resp = await putTicket.mutateAsync(ticketData);

      if (!resp.id) {
        throw resp;
      }

      success('Ticket actualizado correctamente');
      navigate('/tickets');
    } catch (err) {
      console.error('Error actualizando ticket:', err);
      error('Error al actualizar el ticket');
    } finally {
      setIsLoadingGeneral(false);
    }
  };

  const getTitle = () => {
    return `Editar Ticket ${data?.id}`;
  };

  if (isLoading) {
    return <LoadingSection />;
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">
          No se pudo cargar la información del ticket
        </p>
      </div>
    );
  }

  return (
    <Form
      data={{ amount: data.amount, device_location: data.device_location }}
      onSubmit={submit}
      schema={schema}
    >
      <SectionTitleLineWithButton
        backBtn
        main
        title={getTitle()}
        icon={mdiPencil}
      >
        <BaseButton color="info" label="Guardar Cambios" type="submit" />
      </SectionTitleLineWithButton>

      {/* Información del Ticket */}
      <CardBox>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <BaseButton
              icon={mdiInformation}
              color="info"
              roundedFull
              small
              className="mr-2"
            />
            Información del Ticket
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Detalles del Cliente
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Cliente: </span>
                  <CustomerNameDisplay customer={data.customer} />
                </div>
                <div>
                  <span className="text-sm text-gray-500">Técnico: </span>
                  <UserNameDisplay user={data.technician} />
                </div>
                <div>
                  <span className="text-sm text-gray-500">Creado por: </span>
                  <UserNameDisplay user={data.created_by_user} />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Detalles del Dispositivo
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Modelo: </span>
                  <span className="font-medium">{data.device_model}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Serial: </span>
                  <span className="font-medium">{data.device_serial}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Ubicación: </span>
                  <span className="font-medium">
                    {getLocationName(data.device_location)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Estado: </span>
                  <BadgeStatus status={data.status} />
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
              Descripción del Problema
            </h4>
            <p className="text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
              {data.description}
            </p>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Información de Pago
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Método: </span>
                  <span className="font-medium">
                    {getPaymentMethodLabel(data.payment_method)}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Abono inicial: </span>
                  <span className="font-medium">
                    ${parseFloat(data.payment_first_amount).toFixed(2)}
                  </span>
                </div>
                {data.payment_second_amount && (
                  <div>
                    <span className="text-sm text-gray-500">Abono final: </span>
                    <span className="font-medium">
                      ${parseFloat(data.payment_second_amount).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Fechas
              </h4>
              <div className="space-y-2">
                <div>
                  <span className="text-sm text-gray-500">Creado: </span>
                  <span className="font-medium">
                    {new Date(data.created_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Actualizado: </span>
                  <span className="font-medium">
                    {new Date(data.updated_at).toLocaleDateString('es-ES')}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-700 dark:text-gray-300 mb-3">
                Precio Actual
              </h4>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                ${parseFloat(data.amount).toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </CardBox>

      <BaseDivider />

      {/* Formulario de Edición */}
      <CardBox>
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-4 text-center">
            Campos Editables
          </h3>

          {/* Campo de Precio */}
          <FormField label="Precio del Servicio">
            <Field
              name="amount"
              component={MoneyField}
              placeholder="Ingresa el nuevo precio"
            />
          </FormField>

          {/* Campo de Ubicación del Dispositivo */}
          <FormField label="Ubicación del Dispositivo">
            <Field
              name="device_location"
              component={SelectField}
              options={locationOptions}
              placeholder="Selecciona la ubicación"
            />
          </FormField>

          {/* Aquí se pueden agregar más campos editables en el futuro */}
          {/* 
          <FormField label="Modelo del Dispositivo">
            <Field
              name="device_model"
              placeholder="Ingresa el nuevo modelo"
            />
          </FormField>

          <FormField label="Descripción" hasTextareaHeight>
            <Field
              name="description"
              placeholder="Describe el problema o solicitud del ticket"
            />
          </FormField>
          */}

          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              <strong>Nota:</strong> Solo se actualizarán los campos
              modificados. Los demás campos del ticket permanecerán sin cambios.
            </p>
          </div>
        </div>
      </CardBox>

      <BaseDivider className="pb-16" />

      {isLoadingGeneral && <LoadingOverlay />}
    </Form>
  );
}
