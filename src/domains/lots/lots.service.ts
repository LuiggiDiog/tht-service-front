import { LotItemT, LotT } from './lots.type';
import apiFetch from '@/services';

const baseURL = `/batchs`;
const baseURLV2 = `/v2/lots`;

type GetLotsResponseT = {
  res: LotT[];
};

export const getLots = async () => {
  const resp: GetLotsResponseT = await apiFetch({
    url: baseURL,
    normalize: false,
  });
  return resp.res;
};

export const getLotsByStatus = async (status: string) => {
  const resp = await apiFetch({
    url: `${baseURLV2}/by-status/${status}`,
  });
  return resp as LotT[];
};

type GetLotResponseT = {
  res: LotT;
};

export const getLot = async (id: number) => {
  const resp: GetLotResponseT = await apiFetch({
    url: `${baseURL}/${id}`,
    normalize: false,
  });
  return resp.res;
};

type PostLotResponseT = {
  res: LotT;
  success: boolean;
};

export const postLot = async (data: LotT) => {
  const resp: PostLotResponseT = await apiFetch({
    url: baseURL,
    method: 'POST',
    body: data,
    normalize: false,
  });
  return resp;
};

export const deleteLot = async (id: number) => {
  await apiFetch({
    url: `${baseURL}/${id}`,
    method: 'DELETE',
    normalize: false,
  });
};

type GetLotItemsResponseT = {
  res: LotItemT[];
};

export const getLotItems = async (id: number) => {
  const resp: GetLotItemsResponseT = await apiFetch({
    url: `${baseURL}/items/${id}`,
    normalize: false,
  });
  return resp.res;
};

export const getLotsBasicByProduct = async (id: number) => {
  const resp = await apiFetch({
    url: `${baseURLV2}/basic-by-product/${id}`,
  });
  return resp as LotT[];
};

export const updateLotStatus = async (props: LotT) => {
  const { id } = props;
  const url = `${baseURLV2}/update-status/${id}`;
  const resp = await apiFetch({ url, method: 'PUT', body: props });
  return resp;
};

export type GetLotsByProductReportPropsT = {
  product_id: number;
  status: string;
  start_date: string;
  end_date: string;
};

export const getLotsByProductReport = async (
  props: GetLotsByProductReportPropsT
) => {
  const { product_id, status, start_date, end_date } = props;
  const url = `${baseURLV2}/report-by-product?product_id=${product_id}&status=${status}&start_date=${start_date}&end_date=${end_date}`;
  const resp = await apiFetch({ url });
  return resp as LotT[];
};
