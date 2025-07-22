import { useMemo } from 'react';
import { OptionFormT } from '@/components/form';
import { useGetUsers } from '@/domains/users/users.query';

export function useUserOptions() {
  const { data, isLoading, error } = useGetUsers();

  const userOptions: OptionFormT[] = useMemo(() => {
    if (!data) return [];
    return data.map((user) => ({
      label: `${user.name}`,
      value: user.id,
    }));
  }, [data]);

  return { userOptions, isLoading, error };
}
