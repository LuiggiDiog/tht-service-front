import { useQuery } from '@tanstack/react-query';
import { getRoles } from './roles.service';

export const KEY_QUERY_ROLES = 'roles';

export function useGetRoles() {
  return useQuery({
    queryKey: [KEY_QUERY_ROLES],
    queryFn: getRoles,
  });
}
