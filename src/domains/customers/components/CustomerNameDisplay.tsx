interface CustomerNameDisplayProps {
  customer: {
    name: string;
    last_name: string;
  };
}

export default function CustomerNameDisplay({
  customer,
}: CustomerNameDisplayProps) {
  return (
    <span className="font-medium text-gray-900 dark:text-gray-100">
      {customer.name} {customer.last_name}
    </span>
  );
}
