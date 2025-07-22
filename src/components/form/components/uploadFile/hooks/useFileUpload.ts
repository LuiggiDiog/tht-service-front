import { arrayMove } from '@dnd-kit/sortable';
import imageCompression from 'browser-image-compression';
import { useCallback, useEffect, useState } from 'react';
import { FilePreview, UploadType } from '../types';
import { useAddToast } from '@/domains/toast';
import { EMPTY_STRING, IMAGE_FILE_TYPES } from '@/utils/constants';

interface UseFileUploadProps {
  onDrop: (acceptedFiles: File[]) => void;
  type: UploadType;
  acceptedFileTypes?: string[];
  initialPreviews?: string[] | null;
  maxFiles?: number;
}

export const useFileUpload = ({
  onDrop,
  type,
  acceptedFileTypes,
  initialPreviews,
  maxFiles = 5,
}: UseFileUploadProps) => {
  const [filePreviews, setFilePreviews] = useState<FilePreview[]>([]);
  const [acceptedTypes, setAcceptedTypes] = useState<string[]>([]);
  const [sortedFiles, setSortedFiles] = useState<FilePreview[]>([]);
  const [isCompressing, setIsCompressing] = useState(false);
  const { warning } = useAddToast();

  useEffect(() => {
    if (type === 'image' || type === 'avatar') {
      setAcceptedTypes(IMAGE_FILE_TYPES);
    } else {
      setAcceptedTypes(acceptedFileTypes || []);
    }
  }, [type, acceptedFileTypes]);

  useEffect(() => {
    if (initialPreviews) {
      const createFileFromUrl = async (url: string, index: number) => {
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          const fileName = url.split('/').pop() || `initial-${index}`;
          const file = new File([blob], fileName, { type: blob.type });
          return {
            id: `initial-${index}`,
            file,
            preview: url,
          };
        } catch (error) {
          console.error('Error al cargar la imagen inicial:', error);
          return {
            id: `initial-${index}`,
            file: new File([], `initial-${index}`),
            preview: url,
          };
        }
      };

      const loadInitialPreviews = async () => {
        const previews = await Promise.all(
          initialPreviews.map((preview, index) =>
            createFileFromUrl(preview, index)
          )
        );
        setFilePreviews(previews);
      };

      loadInitialPreviews();
    }
  }, [initialPreviews]);

  useEffect(() => {
    if (sortedFiles.length > 0) {
      onDrop(sortedFiles.map((item) => item.file));
      setSortedFiles([]);
    }
  }, [sortedFiles, onDrop]);

  const compressImage = async (file: File): Promise<File> => {
    if (!IMAGE_FILE_TYPES.includes(file.type.split('/')[1])) {
      return file;
    }

    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true,
      quality: 0.8,
    };

    try {
      const compressedFile = await imageCompression(file, options);
      return new File([compressedFile], file.name, {
        type: file.type,
        lastModified: file.lastModified,
      });
    } catch (error) {
      console.error('Error al comprimir la imagen:', error);
      return file;
    }
  };

  const handleDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const filteredFiles = acceptedFiles.filter((file) => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase();
        return acceptedTypes.includes(fileExtension || EMPTY_STRING);
      });

      if (filteredFiles.length > 0) {
        if (filePreviews.length + filteredFiles.length > maxFiles) {
          warning(`Solo puedes subir un máximo de ${maxFiles} archivos`);
          return;
        }

        try {
          setIsCompressing(true);
          // Comprimir imágenes si es necesario
          const compressedFiles = await Promise.all(
            filteredFiles.map((file) => compressImage(file))
          );

          const newPreviews = compressedFiles.map((file) => ({
            id: Math.random().toString(36).substring(7),
            file,
            preview:
              type === 'image' || type === 'avatar'
                ? URL.createObjectURL(file)
                : '',
          }));

          const updatedPreviews = [...filePreviews, ...newPreviews];
          setFilePreviews(updatedPreviews);
          onDrop(updatedPreviews.map((preview) => preview.file));
        } catch (error) {
          console.error('Error al procesar las imágenes:', error);
          warning('Hubo un error al procesar las imágenes');
        } finally {
          setIsCompressing(false);
        }
      } else {
        warning(
          `Solo se permiten archivos de tipo: ${acceptedTypes.join(', ')}`
        );
      }
    },
    [onDrop, acceptedTypes, type, warning, filePreviews, maxFiles]
  );

  const handleRemoveFile = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setFilePreviews((prev) => {
      const newPreviews = prev.filter((preview) => preview.id !== id);
      onDrop(newPreviews.map((preview) => preview.file));
      return newPreviews;
    });
  };

  const handleDragEnd = (activeId: string, overId: string) => {
    if (overId && activeId !== overId) {
      setFilePreviews((items) => {
        const oldIndex = items.findIndex((item) => item.id === activeId);
        const newIndex = items.findIndex((item) => item.id === overId);
        const newItems = arrayMove(items, oldIndex, newIndex);
        setSortedFiles(newItems);
        return newItems;
      });
    }
  };

  return {
    filePreviews,
    acceptedTypes,
    handleDrop,
    handleRemoveFile,
    handleDragEnd,
    isCompressing,
  };
};
