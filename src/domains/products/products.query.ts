import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteProduct,
  getProduct,
  getProducts,
  postProduct,
  putProduct,
} from './products.service';

export const KEY_QUERY_PRODUCTS = 'products';

export function useGetProducts(storeId: number | undefined) {
  const storeIdValue = Number(storeId);
  return useQuery({
    queryKey: [KEY_QUERY_PRODUCTS, storeIdValue],
    queryFn: () => getProducts(storeIdValue),
    enabled: !!storeIdValue,
  });
}

export function useGetProduct(id: number | string | undefined) {
  const idValue = parseInt(id as string);

  return useQuery({
    queryKey: [KEY_QUERY_PRODUCTS, id],
    queryFn: () => getProduct(idValue),
    enabled: !!id,
  });
}

export function usePostProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_PRODUCTS] });
    },
  });
}

export function usePutProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_PRODUCTS] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_PRODUCTS] });
    },
  });
}
