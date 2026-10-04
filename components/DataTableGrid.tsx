'use client';

import React, { useState, useRef } from 'react';
import { ColumnDef, ReportRow } from '@/lib/types';
import { 
  Plus, 
  Trash2, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Upload, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  ExternalLink, 
  Search, 
  Filter, 
  Eye, 
  X,
  FileCheck,
  Loader2,
  Check,
  Globe,
  UploadCloud,
  RefreshCw
} from 'lucide-react';
import { UploadImageModal } from './UploadImageModal';

interface DataTableGridProps {
  columns: ColumnDef[];
  rows: ReportRow[];
  onChangeRows: (rows: ReportRow[]) => void;
  onPreviewImage: (row: ReportRow) => void;
  themeColor: string;
}

export const DataTableGrid: React.FC<DataTableGridProps> = ({
  columns,
  rows,
  onChangeRows,
  onPreviewImage,
  themeColor,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [onlyWithImages, setOnlyWithImages] = useState(false);
  const [editingLinkRowId, setEditingLinkRowId] = useState<string | null>(null);
  const [uploadingRowId, setUploadingRowId] = useState<string | null>(null);
  const [copiedLinkId, setCopiedLinkId] = useState<string | null>(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadModalTargetRowId, setUploadModalTargetRowId] = useState<string | undefined>(undefined);

  // Collect unique sections for filter
  const allSections = Array.from(new Set(rows.map((r) => r.section).filter(Boolean)));

  // Filtered rows
  const filteredRows = rows.filter((r) => {
    if (selectedSection !== 'all' && r.section !== selectedSection) return false;
    if (onlyWithImages && !r.imageName && !r.imageDataUrl) return false;
    if (!searchTerm.trim()) return true;

    const term = searchTerm.toLowerCase();
    return (
      String(r.no).toLowerCase().includes(term) ||
      (r.subject || '').toLowerCase().includes(term) ||
      (r.publication || '').toLowerCase().includes(term) ||
      (r.pageNo || '').toLowerCase().includes(term) ||
      (r.section || '').toLowerCase().includes(term) ||
      (r.heading || '').toLowerCase().includes(term) ||
      (r.imageName || '').toLowerCase().includes(term)
    );
  });

  const handleCellChange = (id: string, field: string, value: any) => {
    const next = rows.map((r) => {
      if (r.id === id) {
        return { ...r, [field]: value };
      }
      return r;
    });
    onChangeRows(next);
  };

  const handleAddRow = (afterIndex?: number) => {
    const newNo = rows.length + 1;
    const newRow: ReportRow = {
      id: `row-${Date.now()}`,
      no: newNo,
      subject: '',
      publication: '',
      pageNo: '',
      section: '',
      heading: '',
    };

    if (afterIndex !== undefined && afterIndex >= 0) {
      const next = [...rows];
      next.splice(afterIndex + 1, 0, newRow);
      onChangeRows(next);
    } else {
      onChangeRows([...rows, newRow]);
    }
  };

  const handleDuplicateRow = (index: number) => {
    const source = rows[index];
    const duplicated: ReportRow = {
      ...source,
      id: `row-${Date.now()}`,
      no: rows.length + 1,
    };
    const next = [...rows];
    next.splice(index + 1, 0, duplicated);
    onChangeRows(next);
  };

  const handleDeleteRow = (id: string) => {
    if (rows.length <= 1) return;
    const next = rows.filter((r) => r.id !== id);
    onChangeRows(next);
  };

  const handleMoveRow = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= rows.length) return;

    const next = [...rows];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    onChangeRows(next);
  };

  // Direct row file upload handler
  const uploadFileForRow = async (rowId: string, file: File) => {
    if (!file || !rowId) return;

    setUploadingRowId(rowId);

    // Read local data URL for instant lightbox preview
    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target?.result as string;
      const fileName = file.name;

      let serverUrl = '';
      try {
        const formData = new FormData();
        formData.append('file', file);

        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (res.ok) {
          const json = await res.json();
          if (json.success && json.url) {
            serverUrl = json.url;
          }
        }
      } catch (uploadErr) {
        console.error('Server upload failed:', uploadErr);
      } finally {
        setUploadingRowId(null);
      }

      const next = rows.map((r) => {
        if (r.id === rowId) {
          return {
            ...r,
            imageName: fileName,
            imageDataUrl: dataUrl,
            imageSize: file.size,
            linkUrl: serverUrl || r.linkUrl || dataUrl,
            heading: (!r.heading || r.heading.endsWith('.jpg') || r.heading.endsWith('.png')) ? fileName : r.heading,
          };
        }
        return r;
      });
      onChangeRows(next);
    };
    reader.readAsDataURL(file);
  };

  const copyServerLink = (rowId: string, url: string) => {
    if (!url) return;
    const fullUrl = url.startsWith('http')
      ? url
      : `${window.location.origin}${url.startsWith('/') ? '' : '/'}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setCopiedLinkId(rowId);
    setTimeout(() => setCopiedLinkId(null), 2000);
  };

  const removeRowImage = (rowId: string) => {
    const next = rows.map((r) => {
      if (r.id === rowId) {
        return {
          ...r,
          imageName: undefined,
          imageDataUrl: undefined,
          imageSize: undefined,
          // Clear linkUrl only if it was an uploaded image link
          linkUrl: r.linkUrl?.includes('/api/uploads/') ? undefined : r.linkUrl,
        };
      }
      return r;
    });
    onChangeRows(next);
  };

  return (
    <div className="space-y-3">
      {/* Toolbar: Search, Filters, Add Row, Upload Image to Server */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search subject, publication, headline..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50/50 focus:bg-white focus:border-blue-500 focus:outline-hidden"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          {/* Section Filter */}
          <div className="flex items-center gap-1 text-xs">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={selectedSection}
              onChange={(e) => setSelectedSection(e.target.value)}
              className="text-xs rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-slate-700 focus:border-blue-500 focus:outline-hidden"
            >
              <option value="all">All Sections ({rows.length})</option>
              {allSections.map((sec) => (
                <option key={sec} value={sec}>
                  {sec}
                </option>
              ))}
            </select>
          </div>

          {/* Only Images Filter */}
          <label className="flex items-center gap-1.5 text-xs text-slate-600 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyWithImages}
              onChange={(e) => setOnlyWithImages(e.target.checked)}
              className="rounded border-slate-300 text-blue-900 focus:ring-blue-500"
            />
            <span>Clippings only</span>
          </label>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Dedicated Upload to Server Modal trigger */}
          <button
            type="button"
            onClick={() => {
              setUploadModalTargetRowId(rows[0]?.id);
              setIsUploadModalOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 hover:border-blue-400 rounded-lg shadow-2xs transition-all cursor-pointer"
            title="Open Upload Image Dialog to select row and upload newspaper clipping to server"
          >
            <UploadCloud className="h-3.5 w-3.5 text-blue-700" />
            <span>Upload Image to Server</span>
          </button>

          <span className="text-xs text-slate-400 font-mono hidden md:inline">
            {filteredRows.length} rows
          </span>

          <button
            type="button"
            onClick={() => handleAddRow()}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Row</span>
          </button>
        </div>
      </div>

      {/* Main High-Density Spreadsheet Table */}
      <div className="border border-slate-200 rounded-xl bg-white shadow-xs overflow-hidden">
        <div className="overflow-x-auto max-h-[640px]">
          <table className="w-full text-left border-collapse text-xs">
            {/* Sticky Table Header */}
            <thead 
              className="sticky top-0 z-20 text-white select-none transition-colors"
              style={{ backgroundColor: themeColor || '#1E3A8A' }}
            >
              <tr>
                <th className="w-12 px-2 py-2.5 text-center font-semibold border-r border-white/20">
                  #
                </th>
                {columns.map((col) => (
                  <th
                    key={col.id || col.key}
                    className={`px-3 py-2.5 font-semibold tracking-wide border-r border-white/20 text-${col.align}`}
                    style={{ minWidth: col.width ? `${col.width * 7}px` : undefined }}
                  >
                    {col.label}
                  </th>
                ))}
                <th className="w-28 px-3 py-2.5 text-center font-semibold">
                  Actions
                </th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-slate-100">
              {filteredRows.map((row, index) => {
                const globalIndex = rows.findIndex((r) => r.id === row.id);
                const isEven = index % 2 === 0;

                return (
                  <tr
                    key={row.id}
                    className={`group transition-colors ${
                      isEven ? 'bg-white' : 'bg-slate-50/60'
                    } hover:bg-blue-50/40`}
                  >
                    {/* Index cell */}
                    <td className="px-2 py-1.5 text-center font-mono text-[11px] text-slate-400 border-r border-slate-100">
                      {globalIndex + 1}
                    </td>

                    {/* Dynamic Columns */}
                    {columns.map((col) => {
                      const isNo = col.key === 'no';
                      const isSubject = col.key === 'subject';
                      const isHeading = col.key === 'heading';
                      const isPage = col.key === 'pageNo';

                      if (isHeading) {
                        return (
                          <td
                            key={col.id || col.key}
                            className="px-2.5 py-1.5 border-r border-slate-100 min-w-[280px]"
                          >
                            <div className="space-y-1">
                              {/* Heading text input */}
                              <div className="flex items-center gap-1.5">
                                <input
                                  type="text"
                                  value={row.heading || ''}
                                  onChange={(e) =>
                                    handleCellChange(row.id, 'heading', e.target.value)
                                  }
                                  placeholder="Article headline or file name..."
                                  className={`w-full text-xs font-medium rounded px-1.5 py-1 text-slate-900 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-hidden ${
                                    row.imageName ? 'font-semibold text-emerald-900' : ''
                                  }`}
                                />
                              </div>

                              {/* Image Attachment & Link Sub-row */}
                              <div className="flex flex-wrap items-center gap-2 pt-0.5 text-[11px]">
                                {/* Uploading Spinner */}
                                {uploadingRowId === row.id ? (
                                  <div className="inline-flex items-center gap-1.5 text-[11px] text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded font-medium">
                                    <Loader2 className="h-3 w-3 animate-spin text-blue-600" />
                                    <span>Uploading to server...</span>
                                  </div>
                                ) : row.imageName ? (
                                  /* Image Attachment Button/Chip with Replace and Remove */
                                  <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-md px-2 py-0.5 font-medium shadow-2xs">
                                    <ImageIcon className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                                    <button
                                      type="button"
                                      onClick={() => onPreviewImage(row)}
                                      className="truncate max-w-[140px] hover:underline cursor-pointer font-medium text-emerald-950"
                                      title="Click to preview image clipping"
                                    >
                                      {row.imageName}
                                    </button>

                                    {/* Direct Replace Image button */}
                                    <label
                                      className="p-1 hover:bg-emerald-200/80 rounded text-emerald-700 hover:text-emerald-950 transition-colors cursor-pointer"
                                      title="Upload and replace with new image file"
                                    >
                                      <RefreshCw className="h-3 w-3" />
                                      <input
                                        type="file"
                                        accept="image/*"
                                        className="sr-only"
                                        onChange={(e) => {
                                          const f = e.target.files?.[0];
                                          if (f) uploadFileForRow(row.id, f);
                                          e.target.value = '';
                                        }}
                                      />
                                    </label>

                                    {/* Remove Image button */}
                                    <button
                                      type="button"
                                      onClick={() => removeRowImage(row.id)}
                                      className="p-1 hover:bg-red-100 rounded text-emerald-600 hover:text-red-600 transition-colors cursor-pointer"
                                      title="Remove clipping"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </div>
                                ) : (
                                  /* Direct Native Upload to Server Button */
                                  <label
                                    className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-blue-700 hover:text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-300 hover:border-blue-400 px-2.5 py-1 rounded-md transition-all cursor-pointer shadow-2xs active:scale-95 select-none"
                                    title="Click to select image file to upload to server and link in Excel"
                                  >
                                    <Upload className="h-3.5 w-3.5 text-blue-600" />
                                    <span>Upload to Server</span>
                                    <input
                                      type="file"
                                      accept="image/*"
                                      className="sr-only"
                                      onChange={(e) => {
                                        const f = e.target.files?.[0];
                                        if (f) uploadFileForRow(row.id, f);
                                        e.target.value = '';
                                      }}
                                    />
                                  </label>
                                )}

                                {/* Server Link / URL Actions */}
                                {row.linkUrl && (
                                  <div className="inline-flex items-center gap-1 bg-slate-100 border border-slate-200 text-slate-700 rounded px-1.5 py-0.5 text-[10px]">
                                    <Globe className="h-2.5 w-2.5 text-blue-600 shrink-0" />
                                    <a
                                      href={row.linkUrl}
                                      target="_blank"
                                      rel="noreferrer"
                                      className="text-blue-700 hover:underline flex items-center gap-0.5"
                                      title={`Excel Hyperlink: ${row.linkUrl}`}
                                    >
                                      <span>Excel Link</span>
                                      <ExternalLink className="h-2.5 w-2.5" />
                                    </a>
                                    <button
                                      type="button"
                                      onClick={() => copyServerLink(row.id, row.linkUrl || '')}
                                      className="text-slate-400 hover:text-slate-700 ml-1"
                                      title="Copy URL"
                                    >
                                      {copiedLinkId === row.id ? (
                                        <Check className="h-2.5 w-2.5 text-green-600" />
                                      ) : (
                                        <Copy className="h-2.5 w-2.5" />
                                      )}
                                    </button>
                                  </div>
                                )}

                                {/* Manual Web Link Editor if not an image */}
                                {!row.imageName && (
                                  editingLinkRowId === row.id ? (
                                    <div className="flex items-center gap-1 flex-1">
                                      <input
                                        type="url"
                                        value={row.linkUrl || ''}
                                        onChange={(e) =>
                                          handleCellChange(row.id, 'linkUrl', e.target.value)
                                        }
                                        placeholder="https://..."
                                        className="text-[11px] px-1.5 py-0.5 border border-blue-400 rounded bg-white flex-1 focus:outline-hidden"
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setEditingLinkRowId(null)}
                                        className="text-[10px] bg-blue-900 text-white px-1.5 py-0.5 rounded"
                                      >
                                        Done
                                      </button>
                                    </div>
                                  ) : (
                                    !row.linkUrl && (
                                      <button
                                        type="button"
                                        onClick={() => setEditingLinkRowId(row.id)}
                                        className="text-slate-400 hover:text-slate-700 flex items-center gap-1"
                                        title="Add URL link for this headline"
                                      >
                                        <LinkIcon className="h-3 w-3" />
                                        <span>Add Web URL</span>
                                      </button>
                                    )
                                  )
                                )}
                              </div>
                            </div>
                          </td>
                        );
                      }

                      // Standard cells
                      return (
                        <td
                          key={col.id || col.key}
                          className={`px-2 py-1.5 border-r border-slate-100 text-${col.align}`}
                        >
                          <input
                            type="text"
                            value={row[col.key] !== undefined ? String(row[col.key]) : ''}
                            onChange={(e) =>
                              handleCellChange(row.id, col.key, e.target.value)
                            }
                            className={`w-full text-xs rounded px-1.5 py-1 border border-transparent hover:border-slate-300 focus:border-blue-500 focus:bg-white focus:outline-hidden text-${col.align} ${
                              isNo ? 'font-mono font-semibold text-slate-700' : ''
                            } ${
                              isSubject && row.subject
                                ? 'font-medium text-slate-900'
                                : 'text-slate-700'
                            } ${
                              isPage ? 'font-mono text-slate-600' : ''
                            }`}
                            placeholder={isSubject ? '(Continuation)' : ''}
                          />
                        </td>
                      );
                    })}

                    {/* Row Actions */}
                    <td className="px-2 py-1.5 text-center whitespace-nowrap">
                      <div className="flex items-center justify-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                        {/* Insert row below */}
                        <button
                          type="button"
                          onClick={() => handleAddRow(globalIndex)}
                          className="p-1 text-slate-400 hover:text-blue-800 hover:bg-slate-100 rounded"
                          title="Insert row below"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>

                        {/* Duplicate */}
                        <button
                          type="button"
                          onClick={() => handleDuplicateRow(globalIndex)}
                          className="p-1 text-slate-400 hover:text-slate-800 hover:bg-slate-100 rounded"
                          title="Duplicate row"
                        >
                          <Copy className="h-3.5 w-3.5" />
                        </button>

                        {/* Move Up */}
                        <button
                          type="button"
                          disabled={globalIndex === 0}
                          onClick={() => handleMoveRow(globalIndex, 'up')}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100 rounded"
                          title="Move up"
                        >
                          <ArrowUp className="h-3.5 w-3.5" />
                        </button>

                        {/* Move Down */}
                        <button
                          type="button"
                          disabled={globalIndex === rows.length - 1}
                          onClick={() => handleMoveRow(globalIndex, 'down')}
                          className="p-1 text-slate-400 hover:text-slate-800 disabled:opacity-20 hover:bg-slate-100 rounded"
                          title="Move down"
                        >
                          <ArrowDown className="h-3.5 w-3.5" />
                        </button>

                        {/* Delete */}
                        <button
                          type="button"
                          onClick={() => handleDeleteRow(row.id)}
                          disabled={rows.length <= 1}
                          className="p-1 text-slate-400 hover:text-red-600 disabled:opacity-20 hover:bg-slate-100 rounded"
                          title="Delete row"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Bottom Bar inside grid */}
        <div className="flex flex-wrap items-center justify-between px-4 py-2.5 bg-slate-50 border-t border-slate-200 text-xs text-slate-500">
          <div className="flex items-center gap-4">
            <span>Total Entries: <strong className="text-slate-700 font-mono">{rows.length}</strong></span>
            <span>Sections: <strong className="text-slate-700 font-mono">{allSections.length}</strong></span>
            <span>Images/Proofs: <strong className="text-emerald-700 font-mono">{rows.filter((r) => r.imageName).length}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleAddRow()}
              className="inline-flex items-center gap-1 font-medium text-blue-900 hover:underline cursor-pointer"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Add New Row</span>
            </button>
          </div>
        </div>
      </div>

      {/* Upload Image Modal */}
      <UploadImageModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        rows={rows}
        defaultRowId={uploadModalTargetRowId}
        onImageUploaded={(rowId, fileData) => {
          const next = rows.map((r) => {
            if (r.id === rowId) {
              return {
                ...r,
                imageName: fileData.imageName,
                imageDataUrl: fileData.imageDataUrl,
                imageSize: fileData.size,
                linkUrl: fileData.serverUrl,
                heading: (!r.heading || r.heading.endsWith('.jpg') || r.heading.endsWith('.png')) ? fileData.imageName : r.heading,
              };
            }
            return r;
          });
          onChangeRows(next);
        }}
      />
    </div>
  );
};
