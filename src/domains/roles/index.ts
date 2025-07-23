import { OptionFormT } from '@/components/form';

export const ROLES = [
  { label: 'Super Admin', value: 'super_admin' },
  { label: 'Admin', value: 'admin' },
  { label: 'Soporte', value: 'support' },
  { label: 'Vendedor', value: 'vendor' },
];

export function useRoleOptions() {
  const roleOptions = ROLES.filter((r) => r.value !== 'super_admin');
  return { roleOptions: roleOptions as OptionFormT[] };
}

export function getRoleLabel(role: string) {
  return ROLES.find((r) => r.value === role)?.label;
}
