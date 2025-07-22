import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { mdiFileUpload, mdiLoading } from '@mdi/js';
import React, { useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import DragActive from './DragActive';
import { SortableItem } from './components/SortableItem';
import { useFileUpload } from './hooks/useFileUpload';
import { UploadMultipleFilesDropZoneProps } from './types';
import BaseIcon from '@/components/ui/BaseIcon';
import { EMPTY_STRING } from '@/utils/constants';

export const UploadMultipleFilesDropZone: React.FC<
  UploadMultipleFilesDropZoneProps
> = ({
  onDrop,
  acceptedFileTypes,
  message,
  type = 'file',
  initialPreviews,
  maxFiles = 5,
  setLoading,
}) => {
  const {
    filePreviews,
    acceptedTypes,
    handleDrop,
    handleRemoveFile,
    handleDragEnd: handleDragEndHook,
    isCompressing,
  } = useFileUpload({
    onDrop,
    type,
    acceptedFileTypes,
    initialPreviews,
    maxFiles,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleDrop,
  });

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over) {
      handleDragEndHook(active.id as string, over.id as string);
    }
  };

  const renderContent = () => {
    if (isCompressing) {
      return (
        <div className="flex flex-col items-center justify-center w-full h-full">
          <BaseIcon
            path={mdiLoading}
            size={48}
            className="animate-spin text-primary"
          />
          <p className="mt-4 text-lg font-medium">Optimizando imágenes...</p>
        </div>
      );
    }

    if (type === 'image' || type === 'avatar') {
      return (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={filePreviews.map((preview) => preview.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 w-full">
              {filePreviews.map((preview) => (
                <SortableItem
                  key={preview.id}
                  id={preview.id}
                  preview={preview}
                  type={type}
                  onRemove={handleRemoveFile}
                />
              ))}
              {filePreviews.length < maxFiles && (
                <div className="w-64 h-64 flex items-center justify-center border-2 border-dashed rounded-2xl border-gray-700">
                  <BaseIcon path={mdiFileUpload} size={36} />
                </div>
              )}
            </div>
          </SortableContext>
        </DndContext>
      );
    }

    return (
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={filePreviews.map((preview) => preview.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="w-full">
            {filePreviews.map((preview) => (
              <SortableItem
                key={preview.id}
                id={preview.id}
                preview={preview}
                type={type}
                onRemove={handleRemoveFile}
              />
            ))}
            {filePreviews.length < maxFiles && (
              <div className="mt-4">
                <BaseIcon path={mdiFileUpload} size="36" w="w-24" />
              </div>
            )}
          </div>
        </SortableContext>
      </DndContext>
    );
  };

  const getStyleContent = () => {
    if (type === 'image' || type === 'avatar') {
      return EMPTY_STRING;
    }
    return 'border-2 border-dashed rounded-2xl border-gray-700 py-8';
  };

  useEffect(() => {
    if (isCompressing) {
      setLoading?.(true);
    } else {
      setLoading?.(false);
    }
  }, [isCompressing, setLoading]);

  return (
    <div
      {...getRootProps()}
      className={`flex flex-col justify-center items-center min-h-[360px] md:p-4 transition cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 dark:border-zinc-50 ${getStyleContent()}`}
    >
      <input className="hidden" {...getInputProps()} disabled={isCompressing} />

      <DragActive isDragActive={isDragActive}>
        <div className="flex items-center flex-col text-center w-full">
          {renderContent()}

          {!isCompressing && (
            <>
              <p className="mt-4 text-xl font-semibold">
                {message || 'Haz click o arrastra las imágenes AQUÍ'}
              </p>

              <h2 className="mt-2 text-sm">
                Se recomiendan los archivos de tipo: {acceptedTypes.join(', ')}
                {maxFiles && ` (Máximo ${maxFiles} archivos)`}
              </h2>
            </>
          )}
        </div>
      </DragActive>
    </div>
  );
};

export default UploadMultipleFilesDropZone;
