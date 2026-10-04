import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { ColumnDef, ReportMeta, ReportRow } from './types';

export async function generateExcelReport(
  meta: ReportMeta,
  columns: ColumnDef[],
  rows: ReportRow[]
): Promise<void> {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = meta.companyName || 'PR Media Monitor';
  workbook.lastModifiedBy = meta.companyName || 'PR Media Monitor';
  workbook.created = new Date();
  workbook.modified = new Date();

  const sheetName = (meta.sectionTitle || 'Press Report').replace(/[\\/?*:[\]]/g, '').slice(0, 30) || 'PRESS';
  const worksheet = workbook.addWorksheet(sheetName, {
    views: [{ showGridLines: true }],
    pageSetup: {
      paperSize: 9, // A4
      orientation: 'landscape',
      fitToPage: true,
      fitToWidth: 1,
      fitToHeight: 0,
    },
  });

  const totalCols = Math.max(columns.length, 6);

  // Set column widths based on ColumnDef or standard sizing
  worksheet.columns = columns.map((col) => ({
    key: col.key,
    width: col.width || (col.key === 'heading' ? 55 : col.key === 'subject' ? 38 : 16),
  }));

  // Helper for hex colors without leading '#'
  const cleanHex = (colorStr: string) => {
    return colorStr.replace('#', '').toUpperCase();
  };

  const primaryThemeHex = cleanHex(meta.themeColor || '1E3A8A');

  // Row 1: Top spacing
  worksheet.addRow([]);

  // Row 2: Company Name (Large, Bold, Primary theme color)
  const companyRow = worksheet.addRow([meta.companyName]);
  companyRow.height = 28;
  worksheet.mergeCells(`A2:${String.fromCharCode(64 + Math.min(totalCols, 26))}2`);
  const companyCell = worksheet.getCell('A2');
  companyCell.font = {
    name: 'Calibri',
    size: 16,
    bold: true,
    color: { argb: `FF${primaryThemeHex}` },
  };
  companyCell.alignment = { vertical: 'middle', horizontal: 'left' };

  // Row 3: Report Title
  const titleRow = worksheet.addRow([meta.reportTitle]);
  titleRow.height = 24;
  worksheet.mergeCells(`A3:${String.fromCharCode(64 + Math.min(totalCols, 26))}3`);
  const titleCell = worksheet.getCell('A3');
  titleCell.font = {
    name: 'Calibri',
    size: 13,
    bold: true,
    color: { argb: 'FF1E293B' },
  };
  titleCell.alignment = { vertical: 'middle', horizontal: 'left' };

  // Row 4: Empty row
  worksheet.addRow([]);

  // Row 5: Date
  const dateText = meta.reportDate ? `Date: - ${meta.reportDate}` : 'Date: -';
  const dateRow = worksheet.addRow([dateText]);
  dateRow.height = 20;
  const dateCell = worksheet.getCell('A5');
  dateCell.font = {
    name: 'Calibri',
    size: 11,
    bold: true,
    color: { argb: 'FF0F172A' },
  };
  dateCell.alignment = { vertical: 'middle', horizontal: 'left' };

  // Row 6: Instruction line (Kindly click the link)
  const instructionRow = worksheet.addRow([meta.clickInstruction || '(Kindly click the link)']);
  instructionRow.height = 18;
  const instrCell = worksheet.getCell('A6');
  instrCell.font = {
    name: 'Calibri',
    size: 10,
    italic: true,
    color: { argb: 'FF2563EB' },
  };
  instrCell.alignment = { vertical: 'middle', horizontal: 'left' };

  // Row 7: Quick Category Tabs
  const quickTabsText = meta.quickCategoryTabs && meta.quickCategoryTabs.length > 0
    ? meta.quickCategoryTabs.join('     ')
    : 'Digital & Economy News - PRESS     Digital & Economy News - E News';
  const tabsRow = worksheet.addRow([quickTabsText]);
  tabsRow.height = 20;
  worksheet.mergeCells(`A7:${String.fromCharCode(64 + Math.min(totalCols, 26))}7`);
  const tabsCell = worksheet.getCell('A7');
  tabsCell.font = {
    name: 'Calibri',
    size: 10,
    bold: true,
    color: { argb: 'FF475569' },
  };
  tabsCell.alignment = { vertical: 'middle', horizontal: 'left' };

  // Row 8: Spacing
  worksheet.addRow([]);

  // Row 9: Section Title (e.g., PRESS)
  const sectionRow = worksheet.addRow([meta.sectionTitle || 'PRESS']);
  sectionRow.height = 26;
  const sectionCell = worksheet.getCell('A9');
  sectionCell.font = {
    name: 'Calibri',
    size: 14,
    bold: true,
    color: { argb: `FF${primaryThemeHex}` },
    underline: true,
  };
  sectionCell.alignment = { vertical: 'middle', horizontal: 'left' };

  // Row 10: Empty spacing before table
  worksheet.addRow([]);

  // Row 11: Table Header Row
  const headerLabels = columns.map((c) => c.label);
  const headerRow = worksheet.addRow(headerLabels);
  headerRow.height = 26;

  headerRow.eachCell((cell, colNumber) => {
    const colDef = columns[colNumber - 1];
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: `FF${primaryThemeHex}` },
    };
    cell.font = {
      name: 'Calibri',
      size: 11,
      bold: true,
      color: { argb: 'FFFFFFFF' },
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: colDef?.align || 'left',
      wrapText: true,
    };
    cell.border = {
      top: { style: 'medium', color: { argb: `FF${primaryThemeHex}` } },
      left: { style: 'thin', color: { argb: 'FFFFFFFF' } },
      bottom: { style: 'medium', color: { argb: `FF${primaryThemeHex}` } },
      right: { style: 'thin', color: { argb: 'FFFFFFFF' } },
    };
  });

  const startDataRowNumber = 12;

  // Add Data Rows
  rows.forEach((row, rowIndex) => {
    const rowValues = columns.map((col) => {
      if (col.key === 'no') return row.no;
      if (col.key === 'subject') return row.subject || '';
      if (col.key === 'publication') return row.publication || '';
      if (col.key === 'pageNo') return row.pageNo || '';
      if (col.key === 'section') return row.section || '';
      if (col.key === 'heading') return row.heading || row.imageName || '';
      return row[col.key] || '';
    });

    const excelRow = worksheet.addRow(rowValues);
    // Dynamic height based on heading length
    const headingText = String(row.heading || '');
    excelRow.height = headingText.length > 80 ? 44 : headingText.length > 40 ? 32 : 22;

    const isEven = rowIndex % 2 === 0;
    const bgFill = isEven ? 'FFFFFFFF' : 'FFF8FAFC';

    excelRow.eachCell((cell, colNumber) => {
      const colDef = columns[colNumber - 1];
      const isHeadingCol = colDef?.key === 'heading';

      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: bgFill },
      };

      cell.alignment = {
        vertical: 'middle',
        horizontal: colDef?.align || 'left',
        wrapText: isHeadingCol || colDef?.key === 'subject',
      };

      cell.border = {
        top: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        left: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        bottom: { style: 'thin', color: { argb: 'FFE2E8F0' } },
        right: { style: 'thin', color: { argb: 'FFE2E8F0' } },
      };

      // Handle Hyperlink if this is heading column and has URL or image
      if (isHeadingCol) {
        const displayText = String(row.heading || row.imageName || '');
        let link = row.linkUrl ? row.linkUrl.trim() : '';

        // If link is relative (e.g. /api/uploads/...), resolve to absolute URL for Excel
        if (link && !link.startsWith('http://') && !link.startsWith('https://')) {
          if (typeof window !== 'undefined' && window.location.origin) {
            link = `${window.location.origin}${link.startsWith('/') ? '' : '/'}${link}`;
          }
        }

        if (link && (link.startsWith('http://') || link.startsWith('https://'))) {
          cell.value = {
            text: displayText,
            hyperlink: link,
            tooltip: `Click to open clipping / article: ${link}`,
          };
          cell.font = {
            name: 'Calibri',
            size: 10.5,
            color: { argb: 'FF1D4ED8' },
            underline: true,
          };
        } else if (row.imageName) {
          // If it's an uploaded image attachment without a link
          cell.value = displayText;
          cell.font = {
            name: 'Calibri',
            size: 10.5,
            bold: true,
            color: { argb: 'FF0F766E' }, // Teal
            underline: true,
          };
        } else {
          cell.font = {
            name: 'Calibri',
            size: 10.5,
            color: { argb: 'FF0F172A' },
          };
        }
      } else if (colDef?.key === 'no') {
        cell.font = {
          name: 'Calibri',
          size: 10.5,
          bold: true,
          color: { argb: 'FF334155' },
        };
      } else if (colDef?.key === 'subject') {
        cell.font = {
          name: 'Calibri',
          size: 10.5,
          bold: !!row.subject,
          color: { argb: 'FF0F172A' },
        };
      } else {
        cell.font = {
          name: 'Calibri',
          size: 10.5,
          color: { argb: 'FF334155' },
        };
      }
    });
  });

  // End of Report Footer
  worksheet.addRow([]); // Blank spacer
  const lastRowNumber = worksheet.rowCount + 1;
  const footerRow = worksheet.addRow([meta.footerNote || 'End of Press Report']);
  footerRow.height = 24;

  const endColLetter = String.fromCharCode(64 + Math.min(totalCols, 26));
  worksheet.mergeCells(`A${lastRowNumber}:${endColLetter}${lastRowNumber}`);
  const footerCell = worksheet.getCell(`A${lastRowNumber}`);
  footerCell.font = {
    name: 'Calibri',
    size: 11,
    italic: true,
    bold: true,
    color: { argb: 'FF64748B' },
  };
  footerCell.alignment = { vertical: 'middle', horizontal: 'center' };

  // Write workbook to buffer and trigger download
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });

  const safeFileName = `${(meta.companyName || 'PR_Report')
    .replace(/[^a-zA-Z0-9]/g, '_')
    .slice(0, 20)}_${(meta.sectionTitle || 'PRESS')}_${(meta.reportDate || 'Update')
    .replace(/[^a-zA-Z0-9]/g, '_')}.xlsx`;

  saveAs(blob, safeFileName);
}

// Quick CSV Exporter
export function generateCsvReport(columns: ColumnDef[], rows: ReportRow[]): void {
  const headerLine = columns.map((c) => `"${c.label.replace(/"/g, '""')}"`).join(',');
  const rowLines = rows.map((row) => {
    return columns
      .map((col) => {
        const val = row[col.key] !== undefined && row[col.key] !== null ? String(row[col.key]) : '';
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(',');
  });

  const csvContent = [headerLine, ...rowLines].join('\r\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, `PR_Media_Monitoring_${new Date().toISOString().slice(0, 10)}.csv`);
}
