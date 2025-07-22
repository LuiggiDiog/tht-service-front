import { UserT } from '../users';

export type UserAuthT = UserT | null;
export type LoginAuthT = {
  email: string;
  password: string;
};
