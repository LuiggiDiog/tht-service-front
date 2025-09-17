type Props = {
  status: string;
};

import { getStatusLabel } from '../tickets.utils';

export default function BadgeStatus(props: Props) {
  const { status } = props;

  const statusColors: Record<string, string> = {
    open: 'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    in_progress:
      'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
    closed: 'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300',
    pending:
      'bg-yellow-200 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
    completed:
      'bg-green-200 text-green-800 dark:bg-green-900 dark:text-green-300',
    cancelled: 'bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
    delivered: 'bg-blue-200 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
  };

  const color =
    statusColors[status] ||
    'bg-gray-200 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
  const label = getStatusLabel(status) || 'Sin estado';

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${color}`}
    >
      {label}
    </span>
  );
}
