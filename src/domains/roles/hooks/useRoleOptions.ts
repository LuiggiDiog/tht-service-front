import { useMemo } from 'react';
import { useGetRoles } from '../roles.query';
import { OptionFormT } from '@/components/form';

export function useRoleOptions() {
  const { data, isLoading, error } = useGetRoles();

  const roleOptions: OptionFormT[] = useMemo(() => {
    if (!data) return [];
    return data.map((product) => ({
      label: product.name,
      value: product.id,
    }));
  }, [data]);

  return { roleOptions, isLoading, error };
}
