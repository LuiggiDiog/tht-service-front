import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteLot,
  getLot,
  getLotItems,
  getLots,
  getLotsBasicByProduct,
  getLotsByStatus,
  postLot,
  updateLotStatus,
} from './lots.service';

export const KEY_QUERY_LOTS = 'lots';

export function useGetLots() {
  return useQuery({
    queryKey: [KEY_QUERY_LOTS],
    queryFn: getLots,
  });
}

export function useGetLotsByStatus(status: string) {
  return useQuery({
    queryKey: [KEY_QUERY_LOTS, status],
    queryFn: () => getLotsByStatus(status),
    enabled: !!status,
  });
}

export function useGetLot(id: number | string | undefined) {
  const idValue = parseInt(id as string);

  return useQuery({
    queryKey: [KEY_QUERY_LOTS, idValue],
    queryFn: () => getLot(idValue),
    enabled: !!id,
    initialData: undefined,
  });
}

export function useDeleteLot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteLot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_LOTS] });
    },
  });
}

export function useGetLotItems(id: number | string | undefined) {
  const idValue = parseInt(id as string);

  return useQuery({
    queryKey: [KEY_QUERY_LOTS, idValue, 'items'],
    queryFn: () => getLotItems(idValue),
    enabled: !!id,
    initialData: undefined,
  });
}

export function useUpdateLotStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateLotStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_LOTS] });
    },
  });
}

export function useGetLotsBasicByProduct(
  productId: number | string | undefined | null
) {
  const idValue = parseInt(productId as string);

  return useQuery({
    queryKey: [KEY_QUERY_LOTS, 'basic', idValue],
    queryFn: () => getLotsBasicByProduct(idValue),
    enabled: !!productId, // Solo se ejecuta si hay un id válido
    initialData: [], // Por si no se han obtenido datos aún
  });
}

export function usePostLot() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postLot,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_LOTS] });
    },
  });
}
