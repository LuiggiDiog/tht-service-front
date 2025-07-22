import { useQuery } from '@tanstack/react-query';
import { getRegistersByItem } from './registers.service';

export const KEY_QUERY_REGISTERS = 'registers';

export function useGetRegistersByItem(item_id: string | number | undefined) {
  const idValue = parseInt(item_id as string);
  return useQuery({
    queryKey: [KEY_QUERY_REGISTERS, item_id],
    queryFn: () => getRegistersByItem(idValue),
    enabled: !!item_id,
    initialData: undefined,
  });
}
