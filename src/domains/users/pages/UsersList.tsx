import { mdiAccount, mdiDelete, mdiPencil } from '@mdi/js';
import { UserT } from '../user.type';
import { useDeleteUser, useGetUsers } from '../users.query';
import TableCustom, { Columns } from '@/components/tableCustom';
import BaseActions from '@/components/ui/BaseActions';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import { useConfirmationDeleteModal } from '@/components/ui/modals';
import { getBranchLabel } from '@/domains/branch';
import { getRoleLabel } from '@/domains/roles';

export default function UsersList() {
  const { data, isLoading } = useGetUsers();
  const deleteUser = useDeleteUser();
  const { openModal: confirmationOpenModal, Modal: ConfirmationModal } =
    useConfirmationDeleteModal();

  const columns: Columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Nombre',
      accessorKey: 'name',
    },
    {
      header: 'Sucursal',
      accessorKey: 'branch',
      cell: ({ row }) => {
        const info = row.original as UserT;
        return <>{getBranchLabel(info.branch)}</>;
      },
    },
    {
      header: 'Rol',
      accessorKey: 'role',
      cell: ({ row }) => {
        const info = row.original as UserT;
        return <>{getRoleLabel(info.role)}</>;
      },
    },
    {
      header: 'Email',
      accessorKey: 'email',
    },
    {
      header: 'Acciones',
      cell: ({ row }) => {
        const info = row.original as UserT;
        return (
          <BaseActions>
            {Number(info.id) !== 1 && (
              <BaseButton
                href={`/users/${info.id}`}
                color="warning"
                icon={mdiPencil}
                label="Editar"
                roundedFull
                small
              />
            )}

            {Number(info.id) !== 1 && (
              <BaseButton
                color="danger"
                icon={mdiDelete}
                label="Eliminar"
                onClick={() =>
                  confirmationOpenModal({
                    onConfirm: () => {
                      deleteUser.mutate(info.id);
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
      <SectionTitleLineWithButton main title="Lista de usuarios">
        <BaseButton
          href="/users/new"
          roundedFull
          label="Nuevo usuario"
          icon={mdiAccount}
        />
      </SectionTitleLineWithButton>
      <TableCustom columns={columns} data={data} />
      <ConfirmationModal />
    </SectionCustom>
  );
}
