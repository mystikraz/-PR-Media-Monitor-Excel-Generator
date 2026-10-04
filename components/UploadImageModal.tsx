'use client';

import React, { useState, useRef } from 'react';
import { X, UploadCloud, CheckCircle2, Loader2, Image as ImageIcon, ExternalLink, Globe } from 'lucide-react';
import { ReportRow } from '@/lib/types';

interface UploadImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  rows: ReportRow[];
  onImageUploaded: (rowId: string, fileData: {
    imageName: string;
    imageDataUrl: string;
    serverUrl: string;
    size: number;
  }) => void;
  defaultRowId?: string;
}

export const UploadImageModal: React.FC<UploadImageModalProps> = ({
  isOpen,
  onClose,
  rows,
  onImageUploaded,
  defaultRowId,
}) => {
  const [selectedRowId, setSelectedRowId] = useState<string>(
    defaultRowId || (rows[0] ? rows[0].id : '')
  );
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewDataUrl, setPreviewDataUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessUrl, setUploadSuccessUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFile = (file: File) => {
    if (!file || !file.type.startsWith('image/')) return;
    setSelectedFile(file);
    setUploadSuccessUrl(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      setPreviewDataUrl(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || !selectedRowId) return;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setUploadSuccessUrl(data.url);
        onImageUploaded(selectedRowId, {
          imageName: data.originalName || selectedFile.name,
          imageDataUrl: previewDataUrl || '',
          serverUrl: data.url,
          size: data.size || selectedFile.size,
        });
      } else {
        alert('Upload failed: ' + (data.error || 'Server error'));
      }
    } catch (err: any) {
      alert('Upload error: ' + err.message);
    } finally {
      setIsUploading(false);
    }
  };

  const selectedRow = rows.find((r) => r.id === selectedRowId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <UploadCloud className="h-5 w-5 text-blue-900" />
            <div>
              <h3 className="text-base font-semibold text-slate-900">
                Upload Press Image to Server
              </h3>
              <p className="text-xs text-slate-500">
                Upload image file, generate public URL, and link in Excel.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Target Row Selection */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Select Target Article / Row:
            </label>
            <select
              value={selectedRowId}
              onChange={(e) => setSelectedRowId(e.target.value)}
              className="w-full text-xs rounded-lg border border-slate-300 bg-white p-2 text-slate-800 focus:border-blue-500 focus:outline-hidden"
            >
              {rows.map((row, idx) => (
                <option key={row.id} value={row.id}>
                  #{idx + 1} - {row.heading || row.imageName || row.subject || 'Empty Row'} ({row.publication || 'No publication'})
                </option>
              ))}
            </select>
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
              dragOver
                ? 'border-blue-500 bg-blue-50/50'
                : 'border-slate-300 hover:border-blue-400 hover:bg-slate-50/70'
            }`}
          >
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) handleFile(f);
              }}
              className="hidden"
            />

            {previewDataUrl ? (
              <div className="space-y-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={previewDataUrl}
                  alt="Preview"
                  className="max-h-36 mx-auto rounded border border-slate-200 object-contain shadow-xs bg-white"
                />
                <div className="text-xs text-slate-600">
                  <span className="font-semibold text-slate-800">{selectedFile?.name}</span>{' '}
                  ({Math.round((selectedFile?.size || 0) / 1024)} KB)
                </div>
                <span className="text-[11px] text-blue-600 hover:underline">
                  Click or drag to choose a different image
                </span>
              </div>
            ) : (
              <div className="space-y-2 py-4">
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-50 flex items-center justify-center text-blue-800">
                  <UploadCloud className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs font-medium text-slate-800">
                    Click to browse or drag &amp; drop image here
                  </p>
                  <p className="text-[11px] text-slate-500 mt-0.5">
                    Supports JPG, PNG, WEBP, SVG newspaper clippings and screenshots
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Success state with link */}
          {uploadSuccessUrl && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-1.5 font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                <span>Uploaded to Server Successfully!</span>
              </div>
              <p className="text-[11px] text-emerald-700">
                This image is now linked to Row #{rows.findIndex((r) => r.id === selectedRowId) + 1} and will open in Excel when clicked.
              </p>
              <div className="flex items-center gap-2 pt-1 font-mono text-[11px]">
                <a
                  href={uploadSuccessUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-700 hover:underline truncate max-w-sm flex items-center gap-1"
                >
                  <Globe className="h-3 w-3" />
                  <span className="truncate">{uploadSuccessUrl}</span>
                  <ExternalLink className="h-2.5 w-2.5" />
                </a>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-200 rounded-md transition-colors"
          >
            {uploadSuccessUrl ? 'Close' : 'Cancel'}
          </button>

          {!uploadSuccessUrl && (
            <button
              type="button"
              disabled={!selectedFile || isUploading}
              onClick={handleUpload}
              className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                  <span>Uploading to Server...</span>
                </>
              ) : (
                <>
                  <UploadCloud className="h-3.5 w-3.5" />
                  <span>Upload &amp; Link in Excel</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
