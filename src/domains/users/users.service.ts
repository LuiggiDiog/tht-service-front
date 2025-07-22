import { UserT } from './user.type';
import apiFetch from '@/services';

const baseURL = `/users`;

export const getUsers = async () => {
  const resp = await apiFetch({
    url: baseURL,
  });
  return resp as UserT[];
};

export const getUser = async (id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${id}`,
  });
  return resp as UserT;
};

export const postUser = async (data: UserT) => {
  const resp = await apiFetch({
    url: baseURL,
    method: 'POST',
    body: data,
  });
  return resp as UserT;
};

export const putUser = async (data: UserT) => {
  const resp = await apiFetch({
    url: `${baseURL}/${data.id}`,
    method: 'PUT',
    body: data,
  });
  return resp as UserT;
};

export const deleteUser = async (id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${id}`,
    method: 'DELETE',
  });
  return resp as UserT;
};
