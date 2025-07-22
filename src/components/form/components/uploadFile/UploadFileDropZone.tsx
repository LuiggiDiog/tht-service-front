import { mdiClose, mdiFileDocument, mdiFileUpload } from '@mdi/js';
import imageCompression from 'browser-image-compression';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { AVATAR_DEFAULT, IMAGE_DEFAULT } from '../../source';
import DragActive from './DragActive';
import BaseIcon from '@/components/ui/BaseIcon';
import { useAddToast } from '@/domains/toast';
import { EMPTY_STRING, IMAGE_FILE_TYPES } from '@/utils/constants';

type Props = {
  onDrop: (acceptedFiles: File[]) => void;
  message?: string;
  type?: 'avatar' | 'image' | 'file';
  acceptedFileTypes?: string[] | undefined;
  initialPreview?: string | null;
  setLoading?: (loading: boolean) => void;
};

export default function UploadFileDropZone(props: Props) {
  const {
    onDrop,
    acceptedFileTypes,
    message,
    type = 'file',
    initialPreview,
    setLoading,
  } = props;
  const [droppedFileName, setDroppedFileName] = useState<string | null>(null);
  const { warning } = useAddToast();

  const [acceptedTypes, setAcceptedTypes] = useState<string[]>([]);
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (type === 'image' || type === 'avatar') {
      setAcceptedTypes(IMAGE_FILE_TYPES);
    } else {
      setAcceptedTypes(acceptedFileTypes || []);
    }
  }, [type, acceptedFileTypes]);

  useEffect(() => {
    if (initialPreview) {
      setPreview(initialPreview);
    }
  }, [initialPreview]);

  const acceptedFileTypesString = acceptedTypes.join(', ');

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (typeof onDrop === 'function') {
        const filteredFiles = acceptedFiles.filter((file) => {
          const fileExtension = file.name.split('.').pop()?.toLowerCase();
          return acceptedTypes.includes(fileExtension || EMPTY_STRING);
        });

        if (filteredFiles.length === 0) {
          warning(
            `Solo se permiten archivos de tipo: ${acceptedFileTypesString}`
          );
          return;
        }

        try {
          if (setLoading) setLoading(true);

          const compressedFiles = await Promise.all(
            filteredFiles.map(async (file) => {
              if (type === 'image' || type === 'avatar') {
                const options = {
                  maxSizeMB: 1,
                  maxWidthOrHeight: 1920,
                  useWebWorker: true,
                  quality: 0.8,
                };
                return await imageCompression(file, options);
              }
              return file;
            })
          );

          onDrop(compressedFiles);

          if (compressedFiles.length > 0) {
            setDroppedFileName(compressedFiles[0].name);
            if (type === 'image' || type === 'avatar') {
              setPreview(URL.createObjectURL(compressedFiles[0]));
            }
          }
        } catch (error) {
          console.error('Error al comprimir la imagen:', error);
          warning(
            'Error al procesar la imagen. Por favor, intente nuevamente.'
          );
        } finally {
          if (setLoading) setLoading(false);
        }
      }
    },
    [onDrop, acceptedTypes, type, warning, acceptedFileTypesString, setLoading]
  );

  const handleRemoveFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setDroppedFileName(null);
    setPreview(null);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  const handleContent = () => {
    if (type === 'avatar') {
      return (
        <img
          alt="avatar default"
          className="w-28 h-28 object-cover rounded-full"
          src={preview || AVATAR_DEFAULT}
        />
      );
    }

    if (type === 'image') {
      return (
        <img
          alt="image default"
          className="w-28 h-28 object-cover rounded-2xl"
          src={preview || IMAGE_DEFAULT}
        />
      );
    }

    return <BaseIcon path={mdiFileUpload} size="36" w="w-24" />;
  };

  const handleLoaded = () => {
    if ((type === 'image' || type === 'avatar') && preview) {
      return null;
    }

    return (
      <div className="mt-4 flex items-center gap-2">
        <BaseIcon path={mdiFileDocument} size={25} />
        <span>{droppedFileName}</span>

        <button
          className="inline-flex justify-center items-center text-red-500 hover:text-red-600"
          onClick={handleRemoveFile}
        >
          <BaseIcon path={mdiClose} size={18} />
        </button>
      </div>
    );
  };

  const handleSyleContent = () => {
    if (type === 'image' || type === 'avatar') {
      return EMPTY_STRING;
    }
    return 'border-2 border-dashed rounded-2xl border-gray-700 py-8 ';
  };

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col justify-center items-center py-2 px-2 min-h-[184px] transition cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-700 dark:border-zinc-50 ${handleSyleContent()}`}
    >
      <input className="hidden" {...getInputProps()} />

      <DragActive isDragActive={isDragActive}>
        <div className="flex items-center flex-col text-center">
          {handleContent()}

          <p className="mt-4 text-xl font-semibold">
            {message || 'Haz click o arrastra la imagen AQUÍ'}
          </p>

          {droppedFileName && handleLoaded()}

          <h2 className="mt-2 text-sm">
            Se recomiendan los archivos de tipo: {acceptedFileTypesString}
          </h2>
        </div>
      </DragActive>
    </div>
  );
}
