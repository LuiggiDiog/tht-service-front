import { useQuery } from '@tanstack/react-query';
import { getWarehouses } from './warehouses.service';

export const KEY_QUERY_WAREHOUSES = 'warehouses';

export function useGetWarehouses() {
  return useQuery({
    queryKey: [KEY_QUERY_WAREHOUSES],
    queryFn: getWarehouses,
  });
}
