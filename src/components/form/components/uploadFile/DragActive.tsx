type Props = {
  isDragActive: boolean;
  children: React.ReactElement;
};

export default function DragActive(props: Props) {
  const { isDragActive, children } = props;

  if (isDragActive)
    return <div className="text-green-700">Suelta los archivos aquí...</div>;

  return children;
}
