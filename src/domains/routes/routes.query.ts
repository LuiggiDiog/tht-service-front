import { useQuery } from '@tanstack/react-query';
import { getRoutes } from './routes.service';

export const KEY_QUERY_ROUTES = 'routes';

export function useGetRoutes() {
  return useQuery({
    queryKey: [KEY_QUERY_ROUTES],
    queryFn: getRoutes,
  });
}
