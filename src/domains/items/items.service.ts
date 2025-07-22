import { ItemT } from './items.type';
import apiFetch from '@/services';

const baseURL = '/v2/items';

type PropsGetItemsByStatusT = {
  lot_id: number;
  status?: string | null;
};

export const getItemsByStatus = async (props: PropsGetItemsByStatusT) => {
  const { lot_id, status = 'active' } = props;
  let url = `${baseURL}/by-status?lot_id=${lot_id}`;
  if (status) {
    url += `&status=${status}`;
  }

  const resp = await apiFetch({ url });
  return resp as ItemT[];
};

export const updateItemStatus = async (props: ItemT) => {
  const { id } = props;
  const url = `${baseURL}/update-status/${id}`;
  const resp = await apiFetch({ url, method: 'PUT', body: props });
  return resp;
};
