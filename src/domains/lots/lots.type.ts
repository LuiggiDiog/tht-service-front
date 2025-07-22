import { ProductT } from '../products/products.type';
import { RouteT } from '../routes/routes.type';
import { UserT } from '../users';

export type LotT = {
  id: number;
  user_id?: number;
  route_id: number;
  product_id: number;

  number: number;
  date_time: string;
  size: number;
  count_finalized: number;
  state: string;
  status: string;

  user: UserT;
  route: RouteT;
  product: ProductT;
};

export type LotItemT = {
  id: number;
  batch_id: number;
  number: number;
  qr: string;
  state: string;
};
