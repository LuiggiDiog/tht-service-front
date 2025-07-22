import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { mdiClose, mdiFileDocument } from '@mdi/js';
import React from 'react';
import { SortableItemProps } from '../types';
import { AVATAR_DEFAULT, IMAGE_DEFAULT } from '@/components/form/source';
import BaseIcon from '@/components/ui/BaseIcon';

export const SortableItem: React.FC<SortableItemProps> = ({
  id,
  preview,
  type,
  onRemove,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  if (type === 'image' || type === 'avatar') {
    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        className="relative group w-64 h-64 cursor-move"
      >
        <img
          alt="preview"
          className={`w-full h-full object-cover rounded-2xl ${
            type === 'avatar' ? 'rounded-full' : ''
          }`}
          src={
            preview.preview ||
            (type === 'avatar' ? AVATAR_DEFAULT : IMAGE_DEFAULT)
          }
        />
        <button
          type="button"
          className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1.5
                     opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onRemove(e, preview.id);
          }}
        >
          <BaseIcon path={mdiClose} size={16} />
        </button>
      </div>
    );
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="mt-4 flex items-center gap-2 cursor-move"
    >
      <BaseIcon path={mdiFileDocument} size={25} />
      <span>{preview.file.name}</span>
      <button
        type="button"
        className="inline-flex justify-center items-center text-red-500 hover:text-red-600"
        onPointerDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove(e, preview.id);
        }}
      >
        <BaseIcon path={mdiClose} size={18} />
      </button>
    </div>
  );
};
