import React, { useState } from 'react';
import { UploadFilesFormData } from './UploadFilesFormData';
import BaseButton from '@/components/ui/baseButton';
import { useAddToast } from '@/domains/toast';

const ExampleFormData: React.FC = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { success, warning } = useAddToast();

  const handleFilesChange = (newFiles: File[]) => {
    setFiles(newFiles);
    console.log('Archivos actualizados:', newFiles);
  };

  const handleSubmit = async () => {
    if (files.length === 0) {
      warning('Debes seleccionar al menos un archivo');
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear FormData
      const formData = new FormData();

      // Agregar archivos al FormData
      files.forEach((file, index) => {
        formData.append(`file_${index}`, file);
        // O simplemente:
        // formData.append('files', file);
      });

      // Agregar otros datos si es necesario
      formData.append('description', 'Archivos subidos desde el componente');
      formData.append('timestamp', new Date().toISOString());

      // Simular envío a API
      console.log('Enviando FormData:', formData);

      // Ejemplo de envío real:
      /*
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Error al subir archivos');
      }

      const result = await response.json();
      console.log('Respuesta del servidor:', result);
      */

      // Simular delay de red
      await new Promise((resolve) => setTimeout(resolve, 2000));

      success(`${files.length} archivo(s) enviado(s) correctamente`);
      setFiles([]); // Limpiar archivos después del envío exitoso
    } catch (err) {
      console.error('Error al enviar archivos:', err);
      warning('Error al enviar los archivos');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">
        Ejemplo de Subida de Archivos con FormData
      </h2>

      {/* Componente para subir imágenes */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Subir Imágenes</h3>
        <UploadFilesFormData
          onFilesChange={handleFilesChange}
          type="image"
          maxFiles={3}
          maxSizeMB={5}
          message="Arrastra tus imágenes aquí"
          showPreviews={true}
          disabled={isSubmitting}
        />
      </div>

      {/* Información de archivos seleccionados */}
      {files.length > 0 && (
        <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <h4 className="font-medium mb-2">Archivos listos para enviar:</h4>
          <ul className="text-sm">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between">
                <span>{file.name}</span>
                <span className="text-gray-500">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Botón de envío */}
      <BaseButton
        onClick={handleSubmit}
        disabled={files.length === 0 || isSubmitting}
        color="success"
        className="w-full"
        label={
          isSubmitting ? 'Enviando...' : `Enviar ${files.length} archivo(s)`
        }
      />

      {/* Código de ejemplo */}
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
        <h4 className="font-medium mb-2">Código de ejemplo:</h4>
        <pre className="text-sm overflow-x-auto">
          {`// Uso básico
<UploadFilesFormData
  onFilesChange={(files) => {
    // files es un array de File objects
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });
    
    // Enviar a tu API
    fetch('/api/upload', {
      method: 'POST', 
      body: formData
    });
  }}
  type="image"
  maxFiles={5}
  maxSizeMB={10}
/>`}
        </pre>
      </div>
    </div>
  );
};

export default ExampleFormData;
