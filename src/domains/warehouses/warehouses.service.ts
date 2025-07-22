import { WarehouseT } from './warehouses.type';
import apiFetch from '@/services';

const baseURL = `/warehouses`;

type GetWarehousesResponseT = {
  res: WarehouseT[];
};

export const getWarehouses = async () => {
  const resp: GetWarehousesResponseT = await apiFetch({
    url: baseURL,
    normalize: false,
  });
  return resp.res;
};
