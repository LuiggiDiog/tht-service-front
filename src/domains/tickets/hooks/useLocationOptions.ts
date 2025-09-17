import { useMemo } from 'react';
import { OptionFormT } from '@/components/form';

export function useLocationOptions() {
  const { data, isLoading, error } = {
    data: [
      { id: 'in-branch', name: 'En sede' },
      { id: 'out-branch', name: 'Enviado' },
    ],
    isLoading: false,
    error: null,
  };

  const locationOptions: OptionFormT[] = useMemo(() => {
    if (!data) return [];
    return data.map((location) => ({
      label: `${location.name}`,
      value: location.id,
    }));
  }, [data]);

  return { locationOptions, isLoading, error };
}
