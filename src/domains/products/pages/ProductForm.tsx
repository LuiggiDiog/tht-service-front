import { mdiTableBorder } from '@mdi/js';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router';
import * as Yup from 'yup';
import {
  useGetProduct,
  usePostProduct,
  usePutProduct,
} from '../products.query';
import { ProductT } from '../products.type';
import Form, {
  Field,
  FormField,
  SelectField,
  SelectFieldColor,
  UploadMultipleFilesDropZone,
  ValuesFormT,
} from '@/components/form';
import BaseDivider from '@/components/ui/BaseDivider';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import LoadingOverlay from '@/components/ui/loadings/LoadingOverlay';
import LoadingSection from '@/components/ui/loadings/LoadingSection';
import { useAddToast } from '@/domains/toast';
import { imageToBase64 } from '@/utils/ImagesUtils';
import { EMPTY_STRING, ZERO } from '@/utils/constants';

export default function ProductForm() {
  const navigate = useNavigate();
  const postProduct = usePostProduct();
  const putProduct = usePutProduct();
  const { warning } = useAddToast();

  const { id } = useParams();
  const { data, isLoading } = useGetProduct(id);
  const [images, setImages] = useState<File[]>([]);

  const [isLoadingUpload, setIsLoadingUpload] = useState(false);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);

  const schema = Yup.object().shape({
    sku: Yup.string().default(EMPTY_STRING),
    name: Yup.string()
      .required('Requerido')
      .default(EMPTY_STRING)
      .min(8, 'Mínimo 8 caracteres'),
    description: Yup.string()
      .required('Requerido')
      .default(EMPTY_STRING)
      .min(8, 'Mínimo 8 caracteres'),
    status: Yup.string().required('Requerido').default('active'),
    cost: Yup.number()
      .required('Requerido')
      .default(ZERO)
      .min(0.01, 'Mínimo 0.01'),
    price: Yup.number()
      .required('Requerido')
      .default(ZERO)
      .min(0.01, 'Mínimo 0.01'),
    price_offer: Yup.number().default(ZERO).min(0.0, 'Mínimo 0.00'),
    price_package: Yup.number().default(ZERO).min(0.0, 'Mínimo 0.00'),
    package_qty: Yup.number().default(ZERO).min(0, 'Mínimo 0'),
    stock: Yup.number().default(ZERO).min(0, 'Mínimo 0'),
    colors: Yup.array()
      .of(
        Yup.object().shape({
          label: Yup.string().required(),
          value: Yup.string().required(),
        })
      )
      .default([]),
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

      const json = values as ProductT;
      json.id = parseInt(id as string);

      json.metadata = {
        ...json.metadata,
        colors: values.colors || [],
      };

      if (!id && images.length === 0) {
        warning('Debes seleccionar al menos una imagen');
        return;
      }

      if (images.length > 0) {
        const imagesBase64: string[] = [];

        for (const image of images) {
          const base64 = await imageToBase64(image);
          imagesBase64.push(base64);
        }

        json.images = imagesBase64;
      }

      const resp = id
        ? await putProduct.mutateAsync(json)
        : await postProduct.mutateAsync(json);

      if (!resp.id) {
        throw resp;
      }

      navigate('/products');
    } catch (error) {
      console.error('Error submitting form:', error);
      warning('Error al guardar el producto');
    } finally {
      setIsLoadingGeneral(false);
    }
  };

  const handleDrop = (files: File[]) => {
    setImages(files);
  };

  const getTitle = () => {
    if (id) {
      return `Editar producto ${data?.id}`;
    }
    return 'Nuevo producto';
  };

  if (isLoading) {
    return <LoadingSection />;
  }

  return (
    <Form
      data={{
        ...data,
        colors: data?.metadata?.colors || [],
      }}
      onSubmit={submit}
      schema={schema}
    >
      <SectionTitleLineWithButton
        backBtn
        main
        title={getTitle()}
        icon={mdiTableBorder}
      >
        <BaseButton color="info" label="Guardar" type="submit" />
      </SectionTitleLineWithButton>

      <div className="w-full pb-4 md:mb-0">
        <UploadMultipleFilesDropZone
          initialPreviews={data?.images_url ? data.images_url : null}
          message="Arrastra las imágenes aquí"
          onDrop={handleDrop}
          type="image"
          maxFiles={5}
          setLoading={setIsLoadingUpload}
        />
      </div>

      {id && (
        <FormField label="Código de producto">
          <Field
            name="sku"
            label="Código de producto"
            placeholder="Código de producto"
            disabled
          />
        </FormField>
      )}

      <FormField label="Nombre">
        <Field name="name" label="Nombre" placeholder="Nombre del producto" />
      </FormField>

      <FormField label="Descripción" hasTextareaHeight>
        <Field
          name="description"
          label="Descripción"
          placeholder="Descripción del producto"
        />
      </FormField>

      <FormField label="Costo">
        <Field
          name="cost"
          label="Costo"
          placeholder="Costo del producto"
          type="number"
          step={0.01}
        />
      </FormField>

      <FormField label="Precio unidad">
        <Field
          name="price"
          label="Precio"
          placeholder="Precio del producto"
          type="number"
          step={0.01}
        />
      </FormField>

      <FormField label="Precio de oferta">
        <Field
          name="price_offer"
          label="Precio de oferta"
          placeholder="Precio de oferta del producto"
          type="number"
          step={0.01}
        />
      </FormField>

      <FormField label="Precio por paquete">
        <Field
          name="price_package"
          label="Precio por paquete"
          placeholder="Precio por paquete del producto"
          type="number"
          step={0.01}
        />
      </FormField>

      <FormField label="Cantidad por paquete">
        <Field
          name="package_qty"
          label="Cantidad por paquete"
          placeholder="Cantidad por paquete del producto"
          type="number"
          min={0}
        />
      </FormField>

      <FormField label="Stock">
        <Field
          name="stock"
          label="Stock"
          placeholder="Stock del producto"
          type="number"
          min={0}
        />
      </FormField>

      <FormField label="Colores">
        <Field
          name="colors"
          component={SelectFieldColor}
          isMulti
          isClearable
          placeholder="Selecciona o crea nuevos colores"
        />
      </FormField>

      <FormField label="Estado">
        <Field
          name="status"
          component={SelectField}
          options={[
            { value: 'active', label: 'Activo' },
            { value: 'next-available', label: 'Próximamente disponible' },
            { value: 'inactive', label: 'Inactivo' },
          ]}
        />
      </FormField>

      <BaseDivider className="pb-16" />

      {isLoadingGeneral && <LoadingOverlay />}
    </Form>
  );
}
