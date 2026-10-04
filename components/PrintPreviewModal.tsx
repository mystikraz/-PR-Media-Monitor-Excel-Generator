'use client';

import React from 'react';
import { X, Printer, Download } from 'lucide-react';
import { ColumnDef, ReportMeta, ReportRow } from '@/lib/types';

interface PrintPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: ReportMeta;
  columns: ColumnDef[];
  rows: ReportRow[];
  onExportExcel: () => void;
}

export const PrintPreviewModal: React.FC<PrintPreviewModalProps> = ({
  isOpen,
  onClose,
  meta,
  columns,
  rows,
  onExportExcel,
}) => {
  if (!isOpen) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="w-full max-w-5xl bg-white rounded-xl shadow-2xl border border-slate-300 flex flex-col max-h-[92vh]">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-slate-200 bg-slate-50 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="h-4 w-4 text-blue-900" />
            <span className="text-sm font-semibold text-slate-900">
              Print &amp; Document Preview
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-100 rounded-md shadow-xs transition-colors"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onExportExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md shadow-xs transition-colors"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Excel</span>
            </button>
            <button
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Document */}
        <div className="p-8 overflow-y-auto flex-1 bg-slate-100 print:bg-white print:p-0">
          <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-slate-200 font-sans print:border-none print:shadow-none print:p-0 text-slate-900">
            {/* Header */}
            <div className="border-b-2 pb-4 mb-4" style={{ borderColor: meta.themeColor || '#1E3A8A' }}>
              <h1 
                className="text-2xl font-bold tracking-tight"
                style={{ color: meta.themeColor || '#1E3A8A' }}
              >
                {meta.companyName}
              </h1>
              <h2 className="text-lg font-semibold text-slate-800 mt-0.5">
                {meta.reportTitle}
              </h2>

              <div className="mt-4 flex flex-wrap items-center justify-between text-xs font-semibold text-slate-700">
                <span>Date: - {meta.reportDate}</span>
                <span className="italic text-blue-600">
                  {meta.clickInstruction || '(Kindly click the link)'}
                </span>
              </div>

              {meta.quickCategoryTabs.length > 0 && (
                <div className="mt-3 text-xs font-medium text-slate-600 flex flex-wrap gap-4">
                  {meta.quickCategoryTabs.map((tab, i) => (
                    <span key={i} className="text-slate-700 underline decoration-slate-300">
                      {tab}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Section Heading */}
            <div className="mb-4">
              <h3 
                className="text-base font-bold uppercase tracking-wider underline"
                style={{ color: meta.themeColor || '#1E3A8A' }}
              >
                {meta.sectionTitle || 'PRESS'}
              </h3>
            </div>

            {/* Table */}
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr 
                  className="text-white font-semibold"
                  style={{ backgroundColor: meta.themeColor || '#1E3A8A' }}
                >
                  {columns.map((c) => (
                    <th
                      key={c.id || c.key}
                      className={`px-3 py-2 border border-slate-300 text-${c.align}`}
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={row.id || idx}
                    className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}
                  >
                    {columns.map((col) => {
                      let cellVal = row[col.key];
                      const isHeading = col.key === 'heading';

                      return (
                        <td
                          key={col.id || col.key}
                          className={`px-3 py-2 border border-slate-200 text-${col.align} align-top`}
                        >
                          {isHeading ? (
                            <div>
                              {row.linkUrl ? (
                                <a
                                  href={row.linkUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="text-blue-700 hover:underline font-medium"
                                >
                                  {row.heading || row.imageName}
                                </a>
                              ) : row.imageName ? (
                                <span className="font-semibold text-emerald-800">
                                  {row.imageName}
                                </span>
                              ) : (
                                <span>{row.heading}</span>
                              )}
                              {row.imageName && (
                                <span className="ml-1.5 text-[10px] bg-slate-200 text-slate-700 px-1 py-0.5 rounded">
                                  [Photo Proof]
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className={col.key === 'no' ? 'font-semibold text-slate-500 font-mono' : ''}>
                              {cellVal || ''}
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Footer */}
            <div className="mt-8 text-center text-xs font-semibold text-slate-500 italic border-t border-slate-200 pt-4">
              {meta.footerNote || 'End of Press Report'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
