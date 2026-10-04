'use client';

import React from 'react';
import { Download, FileSpreadsheet, RotateCcw, UploadCloud, Printer, Settings2 } from 'lucide-react';

interface HeaderBarProps {
  onExportExcel: () => void;
  onExportCsv: () => void;
  onOpenColumnManager: () => void;
  onOpenBulkImport: () => void;
  onOpenPrintPreview: () => void;
  onResetToPromptSample: () => void;
  rowCount: number;
}

export const HeaderBar: React.FC<HeaderBarProps> = ({
  onExportExcel,
  onExportCsv,
  onOpenColumnManager,
  onOpenBulkImport,
  onOpenPrintPreview,
  onResetToPromptSample,
  rowCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Wordmark brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-900 text-white font-bold text-sm shadow-xs">
            PR
          </div>
          <div className="flex flex-col">
            <span className="text-base font-semibold tracking-tight text-slate-900 leading-none">
              Media Monitor Studio
            </span>
            <span className="text-[11px] text-slate-500 font-normal leading-tight mt-0.5">
              Excel Report &amp; Clipping Generator
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation & Tools */}
        <nav className="hidden md:flex items-center gap-1.5 text-sm font-medium text-slate-600">
          <button
            onClick={onOpenBulkImport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            title="Import or paste raw text/data"
          >
            <UploadCloud className="h-3.5 w-3.5" />
            <span>Smart Import</span>
          </button>

          <button
            onClick={onOpenColumnManager}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            title="Customize columns, names and types"
          >
            <Settings2 className="h-3.5 w-3.5" />
            <span>Customize Columns</span>
          </button>

          <button
            onClick={onOpenPrintPreview}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md hover:bg-slate-100 hover:text-slate-900 transition-colors cursor-pointer"
            title="View printable PR brief"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print View</span>
          </button>

          <button
            onClick={onResetToPromptSample}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md text-slate-500 hover:bg-slate-100 hover:text-slate-800 transition-colors cursor-pointer"
            title="Reload initial 23 sample press rows from prompt"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset Sample</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={onExportCsv}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-md transition-colors cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-slate-600" />
            <span>CSV</span>
          </button>

          <button
            onClick={onExportExcel}
            className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-lg shadow-xs transition-colors cursor-pointer active:scale-[0.98]"
            title="Generate and download formatted Excel .xlsx workbook"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Export Excel (.xlsx)</span>
          </button>
        </div>
      </div>
    </header>
  );
};
