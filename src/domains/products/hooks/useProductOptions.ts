import { useMemo } from 'react';
import { useGetProducts } from '../products.query';
import { OptionFormT } from '@/components/form';

export function useProductOptions() {
  const { data, isLoading, error } = useGetProducts(1);

  const productOptions: OptionFormT[] = useMemo(() => {
    if (!data) return [];
    return data.map((product) => ({
      label: product.name,
      value: product.id,
    }));
  }, [data]);

  return { productOptions, isLoading, error };
}
