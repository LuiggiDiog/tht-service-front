import { useMemo } from 'react';
import { useGetCustomers } from '../customers.query';
import { OptionFormT } from '@/components/form';

export function useCustomerOptions() {
  const { data, isLoading, error } = useGetCustomers();

  const customerOptions: OptionFormT[] = useMemo(() => {
    if (!data) return [];
    return data.map((customer) => ({
      label: `${customer.name} ${customer.last_name}`,
      value: customer.id,
    }));
  }, [data]);

  return { customerOptions, isLoading, error };
}
