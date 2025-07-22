export type FilePreview = {
  id: string;
  file: File;
  preview: string;
};

export type UploadType = 'avatar' | 'image' | 'file';

export type UploadMultipleFilesDropZoneProps = {
  onDrop: (acceptedFiles: File[]) => void;
  message?: string;
  type?: UploadType;
  acceptedFileTypes?: string[] | undefined;
  initialPreviews?: string[] | null;
  maxFiles?: number;
  setLoading?: (loading: boolean) => void;
};

export type SortableItemProps = {
  id: string;
  preview: FilePreview;
  type: UploadType;
  onRemove: (e: React.MouseEvent, id: string) => void;
};
