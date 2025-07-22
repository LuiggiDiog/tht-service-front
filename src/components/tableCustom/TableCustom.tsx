/* eslint-disable react-hooks/exhaustive-deps */
import { mdiChevronLeft, mdiChevronRight } from '@mdi/js';
import {
  ColumnDef,
  Row,
  Table,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { useMemo, useState } from 'react';
import BaseButton from '../ui/baseButton';
import ModalLoading from '../ui/loadings/ModalLoading';
import ButtonNavigation from './components/ButtonNavigation';
import ContainerTable from './components/ContainerTable';
import GlobalFilterV2 from './components/GlobalFilter';
import IndeterminateCheckbox from './components/IndeterminateCheckbox';
import { exportTableExcel } from './tableCustomUtil';

type ColumnCustom = ColumnDef<unknown> & {
  header: string;
  accessorKey?: string;
  cellExport?: (cell: { row: { original: unknown } }) => string;
};

export type Columns = ColumnCustom[];

type TableCustomProps = {
  columns: Columns;
  data?: unknown[];
  search?: boolean;
  rowSelect?: boolean;
  exportExcel?: boolean;
  fileName?: string;
  exportFooterData?: unknown[];
  isMain?: boolean;
};

export default function TableCustom(props: TableCustomProps) {
  const {
    columns,
    data = [],
    search = true,
    rowSelect = false,
    exportExcel = false,
    fileName = 'export',
    exportFooterData = [],
    isMain = true,
  } = props;

  const [rowSelection, setRowSelection] = useState({});
  const [isLoadingExport, setIsLoadingExport] = useState(false);

  // Columna para selección de filas
  const selectColumn = {
    id: 'select',
    header: ({ table }: { table: Table<unknown> }) => (
      <IndeterminateCheckbox
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }: { row: Row<unknown> }) => (
      <div className="px-1">
        <IndeterminateCheckbox
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          indeterminate={row.getIsSomeSelected()}
          onChange={row.getToggleSelectedHandler()}
        />
      </div>
    ),
  };

  // Agregar la columna de selección si está habilitada
  const columnsData = useMemo(
    () => (rowSelect ? [selectColumn, ...columns] : columns),
    [columns, rowSelect, selectColumn]
  );

  const table = useReactTable({
    data,
    columns: columnsData,
    state: { rowSelection },
    // Se elimina el globalFilterFn personalizado para usar el predeterminado
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
  });

  const {
    getState,
    getPageCount,
    getCanPreviousPage,
    getCanNextPage,
    setPageIndex,
    previousPage,
    nextPage,
    setGlobalFilter,
    getCoreRowModel: getCoreRowModelData,
    getSelectedRowModel,
  } = table;

  const { globalFilter, pagination } = getState();
  const pageIndex = pagination.pageIndex;
  const pageCount = getPageCount();
  const canPreviousPage = getCanPreviousPage();
  const canNextPage = getCanNextPage();

  // Función para exportar a Excel, usando directamente las filas correspondientes
  const handleExportExcel = async () => {
    setIsLoadingExport(true);
    const preData = rowSelect
      ? getSelectedRowModel().rows
      : getCoreRowModelData().rows;
    const dataExport = preData.map((row) => row.original);
    await exportTableExcel({
      columns,
      data: dataExport,
      fileName,
      exportFooterData,
    });
    setIsLoadingExport(false);
  };

  // Mapeo de estilos para el header según el id de la columna
  const headerStyle = (id: string) => {
    const styles = {
      id: 'p-2 text-left w-16 text-sm',
      acciones: 'p-2 text-sm',
      description: 'p-2 text-left text-sm min-w-[200px]',
    };

    const idLower = id.toLowerCase();
    const style = styles[idLower as keyof typeof styles];

    if (style) {
      return style;
    }

    return 'p-2 text-left text-sm min-w-[80px]';
  };

  return (
    <ContainerTable isMain={isMain}>
      {search && (
        <GlobalFilterV2
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
        />
      )}
      <div className="p-4 overflow-x-auto">
        {exportExcel && data.length > 0 && (
          <div className="flex justify-end mb-2">
            <BaseButton onClick={handleExportExcel} label="Exportar" />
          </div>
        )}
        <table className="w-full min-w-[820px] table-auto p-4">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={headerStyle(header.id)}
                  >
                    {!header.isPlaceholder && (
                      <div>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </div>
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-200 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-slate-800"
              >
                {row.getVisibleCells().map((cell) => (
                  <td key={cell.id} className="px-2 py-1 text-sm">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-end mt-3">
          <p className="mr-8 font-light text-sm">
            Página {pageCount > 0 ? pageIndex + 1 : pageIndex} de {pageCount}
          </p>
          <ButtonNavigation
            onClick={() => setPageIndex(0)}
            disabled={!canPreviousPage}
            icon={mdiChevronLeft}
          />

          <ButtonNavigation
            onClick={previousPage}
            disabled={!canPreviousPage}
            icon={mdiChevronLeft}
          />

          <ButtonNavigation
            onClick={nextPage}
            disabled={!canNextPage}
            icon={mdiChevronRight}
          />

          <ButtonNavigation
            onClick={() => setPageIndex(pageCount - 1)}
            disabled={!canNextPage}
            icon={mdiChevronRight}
          />
        </div>
      </div>
      <ModalLoading isLoading={isLoadingExport} text="Exportando..." />
    </ContainerTable>
  );
}
