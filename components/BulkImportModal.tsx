'use client';

import React, { useState } from 'react';
import { X, ClipboardPaste, ArrowRight, Check, AlertCircle } from 'lucide-react';
import { parseRawTextToRows } from '@/lib/formatters';
import { ReportRow } from '@/lib/types';
import { SAMPLE_REPORT_ROWS } from '@/lib/sampleData';

interface BulkImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImport: (rows: ReportRow[], mode: 'replace' | 'append') => void;
}

export const BulkImportModal: React.FC<BulkImportModalProps> = ({
  isOpen,
  onClose,
  onImport,
}) => {
  const [text, setText] = useState('');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [previewRows, setPreviewRows] = useState<ReportRow[]>([]);

  if (!isOpen) return null;

  const handleTextChange = (val: string) => {
    setText(val);
    if (val.trim()) {
      const parsed = parseRawTextToRows(val);
      setPreviewRows(parsed);
    } else {
      setPreviewRows([]);
    }
  };

  const handleApply = () => {
    if (previewRows.length === 0) return;
    onImport(previewRows, importMode);
    onClose();
  };

  const handleLoadSample = () => {
    onImport(SAMPLE_REPORT_ROWS, 'replace');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-3xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
              <ClipboardPaste className="h-4 w-4 text-blue-900" />
              <span>Smart Paste &amp; Bulk Import</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Paste rows directly from Excel, Google Sheets, or email tables.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Paste Tabular Text (Tab, Pipe, or Comma Delimited):
              </label>
              <button
                type="button"
                onClick={handleLoadSample}
                className="text-xs text-blue-700 hover:text-blue-900 font-medium underline"
              >
                Or Load Official 23-Row Prompt Sample
              </button>
            </div>
            <textarea
              rows={6}
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder={`1\tDigital Payments, Fintech\tE-DailyFT.lk\tii\tBusiness\tHimalayn Editorial.jpg\n2\t\tE-DailyFT.lk\t1\tNews\tNew AML law widens liability risks...`}
              className="w-full text-xs font-mono rounded-lg border border-slate-300 p-3 text-slate-800 focus:border-blue-500 focus:outline-hidden"
            />
          </div>

          {/* Mode Selector */}
          <div className="flex items-center gap-4 text-xs font-medium text-slate-700">
            <span>Import Mode:</span>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                checked={importMode === 'replace'}
                onChange={() => setImportMode('replace')}
                className="text-blue-900 focus:ring-blue-500"
              />
              <span>Replace existing report data</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer">
              <input
                type="radio"
                name="importMode"
                checked={importMode === 'append'}
                onChange={() => setImportMode('append')}
                className="text-blue-900 focus:ring-blue-500"
              />
              <span>Append to current rows</span>
            </label>
          </div>

          {/* Live Preview of parsed rows */}
          {previewRows.length > 0 && (
            <div className="border border-slate-200 rounded-lg overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 text-xs font-semibold text-slate-700 flex items-center justify-between">
                <span>Detected {previewRows.length} Rows</span>
                <span className="text-[11px] text-slate-500 font-normal">
                  Preview first 5 entries
                </span>
              </div>
              <div className="overflow-x-auto max-h-48 text-[11px]">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-600">
                    <tr>
                      <th className="px-2.5 py-1.5 font-semibold">No</th>
                      <th className="px-2.5 py-1.5 font-semibold">Subject</th>
                      <th className="px-2.5 py-1.5 font-semibold">Publication</th>
                      <th className="px-2.5 py-1.5 font-semibold">Page</th>
                      <th className="px-2.5 py-1.5 font-semibold">Section</th>
                      <th className="px-2.5 py-1.5 font-semibold">Heading With Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {previewRows.slice(0, 5).map((row, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="px-2.5 py-1 font-mono text-center text-slate-500">{row.no}</td>
                        <td className="px-2.5 py-1 text-slate-800 max-w-[150px] truncate">{row.subject || '—'}</td>
                        <td className="px-2.5 py-1 text-slate-700">{row.publication}</td>
                        <td className="px-2.5 py-1 text-center font-mono text-slate-600">{row.pageNo}</td>
                        <td className="px-2.5 py-1 text-slate-700">{row.section}</td>
                        <td className="px-2.5 py-1 text-slate-800 max-w-[200px] truncate">{row.heading}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <span className="text-xs text-slate-500">
            {previewRows.length > 0 ? `${previewRows.length} rows ready to import` : 'Paste text above to parse'}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={previewRows.length === 0}
              onClick={handleApply}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-40 rounded-md shadow-xs transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Import {previewRows.length > 0 ? `${previewRows.length} Rows` : ''}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
