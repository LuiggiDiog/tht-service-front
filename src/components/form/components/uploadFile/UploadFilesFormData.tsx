import { mdiClose, mdiFileUpload, mdiLoading } from '@mdi/js';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import BaseIcon from '@/components/ui/BaseIcon';
import { useAddToast } from '@/domains/toast';
import { EMPTY_STRING, IMAGE_FILE_TYPES } from '@/utils/constants';

interface FileItem {
  id: string;
  file: File;
  preview?: string;
}

interface UploadFilesFormDataProps {
  onFilesChange: (files: File[]) => void;
  acceptedFileTypes?: string[];
  maxFiles?: number;
  maxSizeMB?: number;
  message?: string;
  type?: 'image' | 'file';
  showPreviews?: boolean;
  disabled?: boolean;
}

export const UploadFilesFormData: React.FC<UploadFilesFormDataProps> = ({
  onFilesChange,
  acceptedFileTypes,
  maxFiles = 5,
  maxSizeMB = 10,
  message,
  type = 'file',
  showPreviews = true,
  disabled = false,
}) => {
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { warning, error } = useAddToast();

  const acceptedTypes =
    acceptedFileTypes || (type === 'image' ? IMAGE_FILE_TYPES : []);

  // Validar archivo
  const validateFile = useCallback(
    (file: File): string | null => {
      // Validar tipo
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      if (
        acceptedTypes.length > 0 &&
        !acceptedTypes.includes(fileExtension || EMPTY_STRING)
      ) {
        return `Tipo de archivo no válido. Se permiten: ${acceptedTypes.join(
          ', '
        )}`;
      }

      // Validar tamaño
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB > maxSizeMB) {
        return `El archivo es demasiado grande. Máximo ${maxSizeMB}MB`;
      }

      return null;
    },
    [acceptedTypes, maxSizeMB]
  );

  // Manejar archivos seleccionados
  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (disabled) return;

      setIsProcessing(true);

      try {
        const validFiles: FileItem[] = [];
        const errors: string[] = [];

        for (const file of acceptedFiles) {
          // Verificar límite de archivos
          if (files.length + validFiles.length >= maxFiles) {
            errors.push(`Solo puedes subir un máximo de ${maxFiles} archivos`);
            break;
          }

          // Validar archivo
          const validationError = validateFile(file);
          if (validationError) {
            errors.push(`${file.name}: ${validationError}`);
            continue;
          }

          // Crear preview si es imagen
          const preview =
            type === 'image' && file.type.startsWith('image/')
              ? URL.createObjectURL(file)
              : undefined;

          validFiles.push({
            id: Math.random().toString(36).substring(7),
            file,
            preview,
          });
        }

        if (errors.length > 0) {
          errors.forEach((err) => warning(err));
        }

        if (validFiles.length > 0) {
          const newFiles = [...files, ...validFiles];
          setFiles(newFiles);
          onFilesChange(newFiles.map((item) => item.file));
        }
      } catch (err) {
        error('Error al procesar los archivos');
        console.error('Error processing files:', err);
      } finally {
        setIsProcessing(false);
      }
    },
    [
      files,
      maxFiles,
      validateFile,
      onFilesChange,
      type,
      disabled,
      warning,
      error,
    ]
  );

  // Eliminar archivo
  const removeFile = useCallback(
    (id: string) => {
      if (disabled) return;

      setFiles((prev) => {
        const fileToRemove = prev.find((f) => f.id === id);
        if (fileToRemove?.preview) {
          URL.revokeObjectURL(fileToRemove.preview);
        }

        const newFiles = prev.filter((f) => f.id !== id);
        onFilesChange(newFiles.map((item) => item.file));
        return newFiles;
      });
    },
    [onFilesChange, disabled]
  );

  // Limpiar URLs al desmontar
  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
    disabled: disabled || isProcessing,
    multiple: maxFiles > 1,
  });

  const canAddMore = files.length < maxFiles && !disabled;

  return (
    <div className="w-full">
      {/* Zona de drop */}
      {canAddMore && (
        <div
          {...getRootProps()}
          className={`
            flex flex-col items-center justify-center p-6 
            border-2 border-dashed border-gray-300 rounded-lg
            transition-colors cursor-pointer
            ${
              isDragActive
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
            }
            ${disabled || isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />

          {isProcessing ? (
            <div className="flex flex-col items-center">
              <BaseIcon
                path={mdiLoading}
                size={48}
                className="animate-spin text-blue-500"
              />
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Procesando archivos...
              </p>
            </div>
          ) : (
            <div className="flex flex-col items-center text-center">
              <BaseIcon
                path={mdiFileUpload}
                size={48}
                className="text-gray-400"
              />
              <p className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">
                {message ||
                  (isDragActive
                    ? 'Suelta los archivos aquí'
                    : 'Haz clic o arrastra archivos aquí')}
              </p>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {acceptedTypes.length > 0 &&
                  `Tipos: ${acceptedTypes.join(', ')} | `}
                Máximo {maxSizeMB}MB por archivo | {maxFiles} archivo
                {maxFiles > 1 ? 's' : ''} máximo
              </p>
            </div>
          )}
        </div>
      )}

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="mt-4">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
            Archivos seleccionados ({files.length}/{maxFiles})
          </h3>

          <div
            className={
              showPreviews && type === 'image'
                ? 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
                : 'space-y-2'
            }
          >
            {files.map((fileItem) => (
              <div
                key={fileItem.id}
                className={
                  showPreviews && type === 'image'
                    ? 'relative group'
                    : 'flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg'
                }
              >
                {showPreviews && type === 'image' && fileItem.preview ? (
                  <div className="relative">
                    <img
                      src={fileItem.preview}
                      alt={fileItem.file.name}
                      className="w-full h-32 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-opacity-0 group-hover:bg-opacity-30 transition-all rounded-lg flex items-center justify-center">
                      <button
                        onClick={() => removeFile(fileItem.id)}
                        disabled={disabled}
                        className="opacity-0 group-hover:opacity-100 transition-opacity bg-red-500 text-white p-2 rounded-full hover:bg-red-600 disabled:opacity-50"
                      >
                        <BaseIcon path={mdiClose} size={16} />
                      </button>
                    </div>
                    <div className="mt-1 text-xs text-gray-600 dark:text-gray-400 truncate">
                      {fileItem.file.name}
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {fileItem.file.name}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {(fileItem.file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                    <button
                      onClick={() => removeFile(fileItem.id)}
                      disabled={disabled}
                      className="ml-2 p-1 text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      <BaseIcon path={mdiClose} size={16} />
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadFilesFormData;
