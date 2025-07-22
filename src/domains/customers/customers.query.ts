import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteCustomer,
  getCustomer,
  getCustomers,
  postCustomer,
  updateCustomer,
} from './customers.service';

export const KEY_QUERY_CUSTOMERS = 'customers';

export function useGetCustomers() {
  return useQuery({
    queryKey: [KEY_QUERY_CUSTOMERS],
    queryFn: getCustomers,
  });
}

export function useGetCustomer(id: number | string | undefined) {
  const idValue = parseInt(id as string);

  return useQuery({
    queryKey: [KEY_QUERY_CUSTOMERS, id],
    queryFn: () => getCustomer(idValue),
    enabled: !!idValue,
  });
}

export function usePostCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_CUSTOMERS] });
    },
  });
}

export function usePutCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_CUSTOMERS] });
    },
  });
}

export function useDeleteCustomer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_CUSTOMERS] });
    },
  });
}
