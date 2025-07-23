export type UserT = {
  id: number;
  name: string;
  email: string;
  branch: string;
  password_hash: string;
  role: 'super_admin' | 'admin' | 'support' | 'vendor';

  status: string;
  created_at: string;
  updated_at: string;
};
