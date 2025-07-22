import { mdiDelete, mdiFilePlusOutline, mdiPencil } from '@mdi/js';
import BadgeStatus from '../components/BadgeStatus';
import { useDeleteProduct, useGetProducts } from '../products.query';
import { ProductT } from '../products.type';
import TableCustom, { Columns } from '@/components/tableCustom';
import BaseActions from '@/components/ui/BaseActions';
import SectionCustom from '@/components/ui/SectionCustom';
import SectionTitleLineWithButton from '@/components/ui/SectionTitleLineWithButton';
import BaseButton from '@/components/ui/baseButton';
import { useConfirmationDeleteModal } from '@/components/ui/modals';

export default function ProductsList() {
  const { data, isLoading } = useGetProducts(undefined);
  const deleteProduct = useDeleteProduct();
  const { openModal: confirmationOpenModal, Modal: ConfirmationModal } =
    useConfirmationDeleteModal();

  const columns: Columns = [
    {
      header: 'ID',
      accessorKey: 'id',
    },
    {
      header: 'Código',
      accessorKey: 'sku',
    },
    {
      header: 'Imagen',
      accessorKey: 'thumb_url',
      cell: ({ row }) => {
        const info = row.original as ProductT;
        return info.thumb_url ? (
          <img
            src={info.thumb_url}
            alt={info.name}
            className="w-12 h-12 object-cover rounded"
          />
        ) : null;
      },
    },
    {
      header: 'Nombre',
      accessorKey: 'name',
    },
    {
      header: 'Descripción',
      accessorKey: 'description',
    },
    {
      header: 'Precio',
      accessorKey: 'price',
    },
    {
      header: 'Precio Oferta',
      accessorKey: 'price_offer',
    },
    {
      header: 'Stock',
      accessorKey: 'stock',
    },
    {
      header: 'Estado',
      accessorKey: 'status',
      cell: ({ row }) => {
        const info = row.original as ProductT;
        return <BadgeStatus status={info.status} />;
      },
    },
    {
      header: 'Acciones',
      cell: ({ row }) => {
        const info = row.original as ProductT;
        return (
          <BaseActions>
            <BaseButton
              href={`/products/${info.id}`}
              color="warning"
              icon={mdiPencil}
              label="Editar"
              roundedFull
              small
            />

            <BaseButton
              color="danger"
              icon={mdiDelete}
              label="Eliminar"
              onClick={() =>
                confirmationOpenModal({
                  onConfirm: () => {
                    deleteProduct.mutate(info.id);
                  },
                })
              }
              roundedFull
              small
            />
          </BaseActions>
        );
      },
    },
  ];

  return (
    <SectionCustom isLoading={isLoading}>
      <SectionTitleLineWithButton main title="Lista de productos">
        <BaseButton
          href="/products/new"
          roundedFull
          label="Nuevo producto"
          icon={mdiFilePlusOutline}
        />
      </SectionTitleLineWithButton>
      <TableCustom columns={columns} data={data} />
      <ConfirmationModal />
    </SectionCustom>
  );
}
