import { useMemo } from 'react';
import { useGetLocations } from '../locations.query';
import { OptionFormT } from '@/components/form';

export function useLocationOptions() {
  const { data, isLoading, error } = useGetLocations();

  const locationOptions: OptionFormT[] = useMemo(() => {
    if (!data) return [];
    return data.map((item) => ({
      label: item.name,
      value: item.id,
    }));
  }, [data]);

  return { locationOptions, isLoading, error };
}
