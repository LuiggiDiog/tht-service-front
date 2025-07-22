import { LoginAuthT, UserAuthT } from './auth.type';
import apiFetch from '@/services';

const baseURL = `/login`;

type LoginResponseT = {
  isLogged: boolean;
  token: string;
  user: UserAuthT;
};

export const login = async (data: LoginAuthT) => {
  const resp = await apiFetch({
    url: baseURL,
    method: 'POST',
    body: data,
  });

  return resp as LoginResponseT;
};

type RestoreLoginResponseT = {
  isLogged: boolean;
  token: string;
  user: UserAuthT;
};

export const restoreLogin = async () => {
  const url = `${baseURL}/restore`;
  const resp = await apiFetch({
    url,
    method: 'POST',
  });

  return resp as RestoreLoginResponseT;
};
