import { RouteT } from './routes.type';
import apiFetch from '@/services';

const baseURL = `/routes`;

type GetRoutesResponseT = {
  res: RouteT[];
};

export const getRoutes = async () => {
  const resp: GetRoutesResponseT = await apiFetch({
    url: baseURL,
    normalize: false,
  });
  return resp.res;
};
