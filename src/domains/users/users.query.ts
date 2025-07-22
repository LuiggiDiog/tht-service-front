import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteUser,
  getUser,
  getUsers,
  postUser,
  putUser,
} from './users.service';

export const KEY_QUERY_USERS = 'users';

export function useGetUsers() {
  return useQuery({
    queryKey: [KEY_QUERY_USERS],
    queryFn: getUsers,
  });
}

export function useGetUser(id: number | string | undefined) {
  const idValue = parseInt(id as string);

  return useQuery({
    queryKey: [KEY_QUERY_USERS, id],
    queryFn: () => getUser(idValue),
    enabled: !!id,
  });
}

export function usePostUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: postUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_USERS] });
    },
  });
}

export function usePutUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: putUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_USERS] });
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [KEY_QUERY_USERS] });
    },
  });
}
