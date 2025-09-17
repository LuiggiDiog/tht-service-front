export function getCustomerName(customer: {
  name: string;
  last_name: string;
}): string {
  return `${customer.name} ${customer.last_name}`;
}
