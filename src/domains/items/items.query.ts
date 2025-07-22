import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { getItemsByStatus, updateItemStatus } from './items.service';

export const KEY_QUERY_ITEMS = 'items';

export function useGetItemsByStatus(
  lot_id: string | number | undefined,
  status?: string | null
) {
  const idValue = parseInt(lot_id as string);
  return useQuery({
    queryKey: [KEY_QUERY_ITEMS, lot_id, status],
    queryFn: () => getItemsByStatus({ lot_id: idValue, status }),
    enabled: !!lot_id,
    initialData: undefined,
  });
}

export function useUpdateItemStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateItemStatus,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_ITEMS] });
    },
  });
}
