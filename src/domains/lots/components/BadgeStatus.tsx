type Props = {
  status: string;
};

export default function BadgeStatus(props: Props) {
  const { status } = props;

  const getValues = () => {
    if (status === 'active') {
      return {
        color:
          'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300',
        label: 'Activo',
      };
    }

    if (status === 'inactive') {
      return {
        color: 'bg-red-200 text-red-800 dark:bg-red-900 dark:text-red-300',
        label: 'Inactivo',
      };
    }

    if (status === 'finalized') {
      return {
        color: 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
        label: 'Finalizado',
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
