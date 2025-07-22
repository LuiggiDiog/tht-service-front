import { RegisterT } from './registers.type';
import apiFetch from '@/services';

const baseURL = '/v2/registers';

export const getRegistersByItem = async (item_id: number) => {
  const url = `${baseURL}/by-item/${item_id}`;
  const resp = await apiFetch({ url });
  return resp as RegisterT[];
};
