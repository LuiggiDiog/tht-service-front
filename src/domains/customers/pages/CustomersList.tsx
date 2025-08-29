import { mdiAccount, mdiDelete, mdiPencil } from '@mdi/js';
import { useDeleteCustomer, useGetCustomers } from '../customers.query';
import { CustomerT } from '../customers.type';
import TableCustom, { Columns } from '@/components/tableCustom';
import BaseActions from '@/components/ui/BaseActions';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import { useConfirmationDeleteModal } from '@/components/ui/modals';
import { useValidatePermissionCurrentRole } from '@/domains/permissions/permissions';

export default function CustomersList() {
  const { data, isLoading } = useGetCustomers();
  const deleteCustomer = useDeleteCustomer();
  const { openModal: confirmationOpenModal, Modal: ConfirmationModal } =
    useConfirmationDeleteModal();

  const editCustomerPermission =
    useValidatePermissionCurrentRole('customers/edit');

  const columns: Columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Nombre',
      cell: ({ row }) => {
        const customer = row.original as CustomerT;
        return `${customer.name} ${customer.last_name}`;
      },
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Teléfono',
      cell: ({ row }) => {
        const customer = row.original as CustomerT;
        return customer.phone || 'N/A';
      },
    },
    {
      header: 'Empresa',
      cell: ({ row }) => {
        const customer = row.original as CustomerT;
        return customer.company || 'N/A';
      },
    },
    {
      header: 'Estado',
      cell: ({ row }) => {
        const customer = row.original as CustomerT;
        return (
          <span
            className={`px-2 py-1 text-xs rounded-full ${
              customer.status === 'active'
                ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
            }`}
          >
            {customer.status === 'active' ? 'Activo' : 'Inactivo'}
          </span>
        );
      },
    },
    {
      header: 'Acciones',
      cell: ({ row }) => {
        const customer = row.original as CustomerT;
        return (
          <BaseActions>
            {editCustomerPermission && (
              <BaseButton
                href={`/customers/${customer.id}`}
                color="warning"
                icon={mdiPencil}
                label="Editar"
                roundedFull
                small
              />
            )}

            {editCustomerPermission && (
              <BaseButton
                color="danger"
                icon={mdiDelete}
                label="Eliminar"
                onClick={() =>
                  confirmationOpenModal({
                    message: `¿Estás seguro de eliminar al cliente ${customer.name} ${customer.last_name}?`,
                    onConfirm: () => {
                      deleteCustomer.mutate(customer.id);
                    },
                  })
                }
                roundedFull
                small
              />
            )}
          </BaseActions>
        );
      },
    },
  ];

  return (
    <SectionCustom isLoading={isLoading}>
      <SectionTitleLineWithButton main title="Clientes" icon={mdiAccount}>
        <BaseButton
          href="/customers/new"
          roundedFull
          label="Nuevo Cliente"
          icon={mdiAccount}
        />
      </SectionTitleLineWithButton>

      <TableCustom columns={columns} data={data} />
      <ConfirmationModal />
    </SectionCustom>
  );
}
