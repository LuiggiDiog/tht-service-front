import { LocationT } from './locations.type';
import apiFetch from '@/services';

const baseURL = `/locations`;

type GetLocationsResponseT = {
  res: LocationT[];
};

export const getLocations = async () => {
  const resp: GetLocationsResponseT = await apiFetch({
    url: baseURL,
    normalize: false,
  });
  return resp.res;
};
