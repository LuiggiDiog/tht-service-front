import { CustomerT } from './customers.type';
import apiFetch from '@/services';

const baseURL = `/customers`;

export const getCustomers = async () => {
  const resp = await apiFetch({
    url: baseURL,
  });
  return resp as CustomerT[];
};

export const getCustomer = async (id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${id}`,
  });
  return resp as CustomerT;
};

export const postCustomer = async (data: CustomerT) => {
  const resp = await apiFetch({
    url: baseURL,
    method: 'POST',
    body: data,
  });
  return resp as CustomerT;
};

export const updateCustomer = async (data: CustomerT) => {
  const resp = await apiFetch({
    url: `${baseURL}/${data.id}`,
    method: 'PUT',
    body: data,
  });
  return resp as CustomerT;
};

export const deleteCustomer = async (id: number) => {
  const resp = await apiFetch({
    url: `${baseURL}/${id}`,
    method: 'DELETE',
  });
  return resp as CustomerT;
};
