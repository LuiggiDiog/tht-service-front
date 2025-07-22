/* eslint-disable @typescript-eslint/no-explicit-any */
import ExcelJS from 'exceljs';
import { Columns } from './TableCustom';

const KEY_IMAGE = 'url_thumbnail';

type ExportTableExcelProps = {
  columns: Columns;
  data: unknown[];
  exportFooterData?: unknown[];
  fileName?: string;
};

export const exportTableExcel = async (props: ExportTableExcelProps) => {
  const { columns, data, exportFooterData = [], fileName = 'export' } = props;

  try {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Hoja 1');

    const columnsData = columns
      .map((column) => {
        const colExport = 'export' in column ? column.export : true;
        if (!colExport) return null;
        return {
          header: column.header,
          key: column.accessorKey,
          width: 25,
        };
      })
      .filter(Boolean);

    const indexSelect = columnsData.findIndex(
      (item: any) => item.header === 'Acciones'
    );

    if (indexSelect !== -1) {
      columnsData.splice(indexSelect, 1);
    }

    worksheet.columns = columnsData as any;
    worksheet.eachColumnKey((column) => {
      column.alignment = { wrapText: true, vertical: 'middle' };
    });

    const jsonData = jsonDataExport(columns, data);

    for (let i = 0; i < jsonData.length; i++) {
      const item = jsonData[i] as any;
      const row = worksheet.addRow(item);

      const urlImage = item[KEY_IMAGE];
      if (!urlImage) continue;

      const imageData = await downloadImage(urlImage);
      if (!imageData) continue;

      const imageId = workbook.addImage({
        buffer: imageData,
        extension: 'png',
      });

      const rowHeight = 66;
      row.height = rowHeight;

      const imageCell = row.getCell(KEY_IMAGE) as any;
      imageCell.value = '';

      worksheet.addImage(imageId, {
        tl: { col: imageCell.col - 1, row: imageCell.row - 1 },
        br: { col: imageCell.col, row: imageCell.row },
      } as any);
    }

    worksheet.addRow([]);
    worksheet.addRow([]);

    if (exportFooterData.length > 0) {
      for (let i = 0; i < exportFooterData.length; i++) {
        const item = exportFooterData[i] as any;
        const row = worksheet.addRow([]);
        row.getCell(2).value = item.key;
        row.getCell(3).value = item.value;
      }
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/octet-stream' });
    saveAs(blob, `${fileName}.xlsx`);
  } catch (error) {
    console.log('error', error);
  }
};

const jsonDataExport = (columns: Columns, data: unknown[]) => {
  const cloneData = structuredClone(data);

  columns.forEach((column) => {
    cloneData.forEach((item: any) => {
      try {
        const itemData = item[column.accessorKey as string];
        if (itemData === undefined || itemData === null) return;

        const jsonCell = {
          row: {
            original: item,
          },
        };

        if (column.cellExport) {
          const cellExportData = column.cellExport(jsonCell);
          item[column.accessorKey as string] = cellExportData;
          return;
        }

        if (column.cell) {
          let cellData;
          if (typeof column.cell === 'function') {
            // Si es una función, la llamamos pasando el contexto
            cellData = column.cell(jsonCell as any);
          } else {
            // Si es un string (u otro valor no callable), lo asignamos directamente
            cellData = column.cell;
          }
          item[column.accessorKey as string] = cellData;
        }
      } catch (error) {
        console.log('error jsonDataExport: ', error);
      }
    });
  });

  return cloneData;
};

const saveAs = (blob: Blob, filename: string): void => {
  if ((window.navigator as any).msSaveOrOpenBlob) {
    (window.navigator as any).msSaveOrOpenBlob(blob, filename);
  } else {
    const elem = window.document.createElement('a');
    elem.href = window.URL.createObjectURL(blob);
    elem.download = filename;
    document.body.appendChild(elem);
    elem.click();
    document.body.removeChild(elem);
  }
};

async function downloadImage(url: string) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.log(`Error downloading image: ${url} - ${response.statusText}`);
      return null;
    }
    const imageData = await response.arrayBuffer();
    return new Uint8Array(imageData);
  } catch (error) {
    console.log(`Error downloading image: ${url} - ${error}`);
    return null;
  }
}
