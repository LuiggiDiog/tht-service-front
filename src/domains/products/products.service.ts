import { ProductT } from './products.type';
import apiFetch from '@/services';

const baseURL = `/products`;

export const getProducts = async (store_id: number) => {
  const url = `${baseURL}?store_id=${store_id}`;
  const resp = await apiFetch({
    url,
  });
  return resp as ProductT[];
};

export const getProduct = async (id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${id}`,
  });
  return resp as ProductT;
};

export const postProduct = async (data: ProductT) => {
  const resp = await apiFetch({
    url: baseURL,
    method: 'POST',
    body: data,
  });
  return resp as ProductT;
};

export const putProduct = async (data: ProductT) => {
  const resp = await apiFetch({
    url: `${baseURL}/${data.id}`,
    method: 'PUT',
    body: data,
  });
  return resp as ProductT;
};

export const deleteProduct = async (id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${id}`,
    method: 'DELETE',
  });
  return resp as ProductT;
};
