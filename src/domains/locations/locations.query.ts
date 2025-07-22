import { useQuery } from '@tanstack/react-query';
import { getLocations } from './locations.service';

export const KEY_QUERY_LOCATIONS = 'locations';

export function useGetLocations() {
  return useQuery({
    queryKey: [KEY_QUERY_LOCATIONS],
    queryFn: getLocations,
  });
}
