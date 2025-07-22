import { RoleT } from './roles.type';
import apiFetch from '@/services';

const baseURL = `/roles`;

type GetRolesResponseT = {
  res: RoleT[];
};

export const getRoles = async () => {
  const resp: GetRolesResponseT = await apiFetch({
    url: baseURL,
    normalize: false,
  });
  return resp.res;
};
