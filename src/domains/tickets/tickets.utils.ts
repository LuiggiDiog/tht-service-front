export const getEvidenceTypeLabel = (type: string) => {
  const types = {
    reception: 'Recepción',
    part_removed: 'Pieza Removida',
    part_installed: 'Pieza Instalada',
    delivery: 'Entrega',
  };
  return types[type as keyof typeof types] || type;
};

export const getPaymentMethodLabel = (method: string) => {
  const methods = {
    cash: 'Efectivo',
    card: 'Tarjeta',
    transfer: 'Transferencia',
    check: 'Cheque',
  };
  return methods[method as keyof typeof methods] || method;
};

export const getStatusLabel = (status: string) => {
  const statuses = {
    open: 'Abierto',
    in_progress: 'En Proceso',
    closed: 'Cerrado',
    pending: 'Pendiente',
    completed: 'Completado',
    cancelled: 'Cancelado',
    delivered: 'Entregado',
    // Puedes agregar más si tienes otros status
  };
  return statuses[status as keyof typeof statuses] || status;
};
