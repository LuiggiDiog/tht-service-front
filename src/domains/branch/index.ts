export const BRANCHES = [
  { label: 'Bogotá', value: 'bogota' },
  { label: 'Medellín', value: 'medellin' },
  { label: 'Quito', value: 'quito' },
  { label: 'Guayaquil', value: 'guayaquil' },
];

import { OptionFormT } from '@/components/form';

export function useBranchOptions() {
  return { branchOptions: BRANCHES as OptionFormT[] };
}

export function getBranchLabel(branch: string) {
  return BRANCHES.find((b) => b.value === branch)?.label;
}
