export type UserT = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};
