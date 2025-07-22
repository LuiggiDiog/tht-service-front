import { RoleT } from '../roles/roles.type';

export type UserT = {
  id: number;
  location_id: number;
  role_id: number;
  email: string;
  name: string;
  last_name: string;
  password?: string;
  state: string;
  status: string;
  role: string;
  roles: RoleT[];
};
