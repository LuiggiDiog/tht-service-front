import { OptionFormT } from '@/components/form';

export const PAYMENT_METHODS = [
  { label: 'Efectivo', value: 'cash' },
  { label: 'Transferencia', value: 'transfer' },
];

export function usePaymentMethodOptions() {
  return { paymentMethodOptions: PAYMENT_METHODS as OptionFormT[] };
}

export function getPaymentMethodLabel(paymentMethod: string) {
  return PAYMENT_METHODS.find((p) => p.value === paymentMethod)?.label;
}
