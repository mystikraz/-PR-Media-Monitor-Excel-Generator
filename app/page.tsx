'use client';

import React, { useState } from 'react';
import { HeaderBar } from '@/components/HeaderBar';
import { ReportMetaEditor } from '@/components/ReportMetaEditor';
import { DataFormattingToolbar } from '@/components/DataFormattingToolbar';
import { DataTableGrid } from '@/components/DataTableGrid';
import { ColumnManagerModal } from '@/components/ColumnManagerModal';
import { ImageLightboxModal } from '@/components/ImageLightboxModal';
import { BulkImportModal } from '@/components/BulkImportModal';
import { PrintPreviewModal } from '@/components/PrintPreviewModal';
import { DEFAULT_COLUMNS, DEFAULT_REPORT_META, SAMPLE_REPORT_ROWS } from '@/lib/sampleData';
import { ColumnDef, ReportMeta, ReportRow } from '@/lib/types';
import { 
  renumberRows, 
  toTitleCase, 
  toSentenceCase, 
  fillDownSubjects, 
  clearDuplicateSubjects, 
  cleanQuotes, 
  cleanWhitespace, 
  normalizePublication, 
  normalizeSection 
} from '@/lib/formatters';
import { generateExcelReport, generateCsvReport } from '@/lib/excelGenerator';
import { CheckCircle2, AlertCircle, FileSpreadsheet, Sparkles, Layers } from 'lucide-react';

export default function HomePage() {
  const [meta, setMeta] = useState<ReportMeta>(DEFAULT_REPORT_META);
  const [columns, setColumns] = useState<ColumnDef[]>(DEFAULT_COLUMNS);
  const [rows, setRows] = useState<ReportRow[]>(SAMPLE_REPORT_ROWS);

  // Modals state
  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);
  const [isPrintPreviewOpen, setIsPrintPreviewOpen] = useState(false);

  // Image preview modal state
  const [activePreviewRow, setActivePreviewRow] = useState<ReportRow | null>(null);

  // Toast / feedback message
  const [toastMsg, setToastMsg] = useState<{ text: string; type: 'success' | 'info' } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' = 'success') => {
    setToastMsg({ text, type });
    setTimeout(() => {
      setToastMsg((cur) => (cur?.text === text ? null : cur));
    }, 3200);
  };

  // --- Auto-Formatting Tools ---
  const handleRenumber = () => {
    setRows(renumberRows(rows));
    showToast('Renumbered all rows sequentially from 1 to ' + rows.length);
  };

  const handleApplyTitleCase = () => {
    const updated = rows.map((r) => ({
      ...r,
      subject: toTitleCase(r.subject || ''),
      heading: toTitleCase(r.heading || ''),
      section: normalizeSection(r.section || ''),
    }));
    setRows(updated);
    showToast('Applied Title Case formatting to subjects and headlines');
  };

  const handleApplySentenceCase = () => {
    const updated = rows.map((r) => ({
      ...r,
      heading: toSentenceCase(r.heading || ''),
    }));
    setRows(updated);
    showToast('Applied Sentence Case formatting to headlines');
  };

  const handleStandardizeRomanPages = () => {
    const updated = rows.map((r) => {
      const page = (r.pageNo || '').trim();
      // If Roman numeral like II, IV, lower case them for standard editorial convention
      if (/^[ivxlcdm]+$/i.test(page)) {
        return { ...r, pageNo: page.toLowerCase() };
      }
      return r;
    });
    setRows(updated);
    showToast('Standardized editorial Roman page numbers (e.g. ii, iv)');
  };

  const handleFillDownSubjects = () => {
    const updated = fillDownSubjects(rows);
    setRows(updated);
    showToast('Filled down subjects to all empty child rows');
  };

  const handleClearDuplicateSubjects = () => {
    const updated = clearDuplicateSubjects(rows);
    setRows(updated);
    showToast('Removed repeated consecutive subjects for clean PR continuation format');
  };

  const handleCleanQuotesAndSpaces = () => {
    const updated = rows.map((r) => ({
      ...r,
      subject: cleanWhitespace(cleanQuotes(r.subject || '')),
      heading: cleanWhitespace(cleanQuotes(r.heading || '')),
      publication: cleanWhitespace(r.publication || ''),
      section: cleanWhitespace(r.section || ''),
      pageNo: cleanWhitespace(r.pageNo || ''),
    }));
    setRows(updated);
    showToast('Cleaned quotes, apostrophes (e.g. ` to \'), and trimmed spaces');
  };

  const handleStandardizeAll = () => {
    const updated = rows.map((r) => ({
      ...r,
      subject: cleanWhitespace(cleanQuotes(r.subject || '')),
      heading: cleanWhitespace(cleanQuotes(r.heading || '')),
      publication: normalizePublication(r.publication || ''),
      section: normalizeSection(r.section || ''),
      pageNo: cleanWhitespace(r.pageNo || ''),
    }));
    setRows(updated);
    showToast('Completed smart clean: normalized publications, sections, and quotes');
  };

  // --- Export Actions ---
  const handleExportExcel = async () => {
    try {
      showToast('Generating formatted Excel workbook...', 'info');
      await generateExcelReport(meta, columns, rows);
      showToast('Excel (.xlsx) report downloaded successfully!');
    } catch (err: any) {
      console.error(err);
      showToast('Failed to generate Excel file: ' + err.message, 'info');
    }
  };

  const handleExportCsv = () => {
    generateCsvReport(columns, rows);
    showToast('CSV report exported successfully');
  };

  // --- Reset to Prompt Sample ---
  const handleResetSample = () => {
    setMeta(DEFAULT_REPORT_META);
    setColumns(DEFAULT_COLUMNS);
    setRows(SAMPLE_REPORT_ROWS);
    showToast('Reset to original 23-row sample media monitoring report');
  };

  // --- Bulk Import ---
  const handleImportRows = (newRows: ReportRow[], mode: 'replace' | 'append') => {
    if (mode === 'replace') {
      setRows(renumberRows(newRows));
      showToast(`Imported ${newRows.length} rows (replaced previous data)`);
    } else {
      const combined = [...rows, ...newRows];
      setRows(renumberRows(combined));
      showToast(`Appended ${newRows.length} rows to report`);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 selection:bg-blue-100 selection:text-blue-900">
      {/* Top Header Contract */}
      <HeaderBar
        onExportExcel={handleExportExcel}
        onExportCsv={handleExportCsv}
        onOpenColumnManager={() => setIsColumnModalOpen(true)}
        onOpenBulkImport={() => setIsBulkImportOpen(true)}
        onOpenPrintPreview={() => setIsPrintPreviewOpen(true)}
        onResetToPromptSample={handleResetSample}
        rowCount={rows.length}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
        {/* Banner Section / Metadata Editor */}
        <ReportMetaEditor meta={meta} onChange={setMeta} />

        {/* Automatic Data Formatting Toolbar */}
        <DataFormattingToolbar
          onRenumber={handleRenumber}
          onApplyTitleCase={handleApplyTitleCase}
          onApplySentenceCase={handleApplySentenceCase}
          onStandardizeRomanPages={handleStandardizeRomanPages}
          onFillDownSubjects={handleFillDownSubjects}
          onClearDuplicateSubjects={handleClearDuplicateSubjects}
          onCleanQuotesAndSpaces={handleCleanQuotesAndSpaces}
          onStandardizeAll={handleStandardizeAll}
        />

        {/* Live Interactive Data Table Grid */}
        <DataTableGrid
          columns={columns}
          rows={rows}
          onChangeRows={setRows}
          onPreviewImage={(row) => setActivePreviewRow(row)}
          themeColor={meta.themeColor}
        />

        {/* Footer Note and Excel Specifications */}
        <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 py-3 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700">{meta.footerNote}</span>
            <span>·</span>
            <span>Formatted for Microsoft Excel 2016+, Office 365, Google Sheets &amp; Apple Numbers</span>
          </div>
          <div className="mt-2 sm:mt-0 flex items-center gap-3">
            <button
              onClick={() => setIsColumnModalOpen(true)}
              className="text-slate-600 hover:text-slate-900 underline"
            >
              Customize Columns ({columns.length})
            </button>
            <span>·</span>
            <button
              onClick={handleExportExcel}
              className="font-medium text-blue-900 hover:underline"
            >
              Download .xlsx
            </button>
          </div>
        </div>
      </main>

      {/* Modals */}
      <ColumnManagerModal
        isOpen={isColumnModalOpen}
        onClose={() => setIsColumnModalOpen(false)}
        columns={columns}
        onChangeColumns={setColumns}
      />

      <BulkImportModal
        isOpen={isBulkImportOpen}
        onClose={() => setIsBulkImportOpen(false)}
        onImport={handleImportRows}
      />

      <PrintPreviewModal
        isOpen={isPrintPreviewOpen}
        onClose={() => setIsPrintPreviewOpen(false)}
        meta={meta}
        columns={columns}
        rows={rows}
        onExportExcel={handleExportExcel}
      />

      {activePreviewRow && (
        <ImageLightboxModal
          isOpen={!!activePreviewRow}
          onClose={() => setActivePreviewRow(null)}
          imageName={activePreviewRow.imageName || activePreviewRow.heading}
          imageDataUrl={activePreviewRow.imageDataUrl}
          linkUrl={activePreviewRow.linkUrl}
          rowTitle={`${activePreviewRow.publication || ''} · Page ${activePreviewRow.pageNo || ''}`}
          onUploadNewImage={async (file) => {
            showToast('Uploading new image to server...', 'info');
            try {
              const formData = new FormData();
              formData.append('file', file);
              const res = await fetch('/api/upload', { method: 'POST', body: formData });
              const json = await res.json();
              if (res.ok && json.success) {
                const reader = new FileReader();
                reader.onload = (e) => {
                  const dataUrl = e.target?.result as string;
                  const updatedRows = rows.map((r) => {
                    if (r.id === activePreviewRow.id) {
                      const updated = {
                        ...r,
                        imageName: json.originalName || file.name,
                        imageDataUrl: dataUrl,
                        imageSize: file.size,
                        linkUrl: json.url,
                        heading: (!r.heading || r.heading.endsWith('.jpg') || r.heading.endsWith('.png')) ? (json.originalName || file.name) : r.heading,
                      };
                      setActivePreviewRow(updated);
                      return updated;
                    }
                    return r;
                  });
                  setRows(updatedRows);
                  showToast('Uploaded and linked new image to server!');
                };
                reader.readAsDataURL(file);
              } else {
                showToast('Upload failed: ' + (json.error || 'Server error'), 'info');
              }
            } catch (err: any) {
              showToast('Upload error: ' + err.message, 'info');
            }
          }}
        />
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-lg shadow-xl text-xs font-medium border border-slate-800 animate-in fade-in slide-in-from-bottom-2 duration-150">
          {toastMsg.type === 'success' ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
          ) : (
            <Sparkles className="h-4 w-4 text-blue-400 shrink-0" />
          )}
          <span>{toastMsg.text}</span>
        </div>
      )}
    </div>
  );
}
