type Props = {
  status: string;
};

export default function BadgeStatus(props: Props) {
  const { status } = props;

  const getValues = () => {
    if (status === 'open') {
      return {
        color:
          'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
        label: 'Abierto',
      };
    }

    if (status === 'in_progress') {
      return {
        color: 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        label: 'En Progreso',
      };
    }

    if (status === 'closed') {
      return {
        color:
          'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300',
        label: 'Cerrado',
      };
    }

    return {
      color: 'bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
      label: 'Sin estado',
    };
  };
  const values = getValues();

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${values.color}`}
    >
      {values.label}
    </span>
  );
}
