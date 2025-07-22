import { UserT } from '../users';

type LocationT = {
  id: number;
  name: string;
};

export type RegisterT = {
  id: number;
  user_id: number;
  state_items_id: number;
  state: {
    id: number;
    name: string;
  };
  lacation: LocationT;
  user: UserT;
  date_time: string;
};
