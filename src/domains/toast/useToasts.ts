import { mdiCheckCircle } from '@mdi/js';
import { useToastStore } from './toast.store';

export function useAddToast() {
  const { addToast } = useToastStore.getState();

  function success(message: string) {
    addToast({
      description: message,
      color: 'success',
      icon: mdiCheckCircle,
    });
  }

  function warning(message: string) {
    addToast({
      description: message,
      color: 'warning',
      icon: mdiCheckCircle,
    });
  }

  return { success, warning };
}
