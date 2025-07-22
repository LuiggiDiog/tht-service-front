export type CustomerT = {
  id: number;
  name: string;
  last_name: string;
  email: string;
  phone?: string;
  address?: string;
  company?: string;
  rfc?: string;
  status: 'active' | 'inactive';
  created_at: string;
  updated_at: string;
};

export type CustomerFormT = Omit<CustomerT, 'id' | 'created_at' | 'updated_at'>;
