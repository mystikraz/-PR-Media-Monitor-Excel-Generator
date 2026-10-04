'use client';

import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, ExternalLink, Image as ImageIcon, Copy, Check, Upload } from 'lucide-react';

interface ImageLightboxModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageName: string;
  imageDataUrl?: string;
  linkUrl?: string;
  rowTitle?: string;
  onUploadNewImage?: (file: File) => void;
}

export const ImageLightboxModal: React.FC<ImageLightboxModalProps> = ({
  isOpen,
  onClose,
  imageName,
  imageDataUrl,
  linkUrl,
  rowTitle,
  onUploadNewImage,
}) => {
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleZoomIn = () => setScale((s) => Math.min(s + 0.25, 3));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.25, 0.5));
  const handleRotate = () => setRotation((r) => (r + 90) % 360);

  const handleCopyName = () => {
    navigator.clipboard.writeText(imageName);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!imageDataUrl) return;
    const a = document.createElement('a');
    a.href = imageDataUrl;
    a.download = imageName || 'press_clipping.jpg';
    a.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]">
        {/* Top Control Bar */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-slate-800 bg-slate-900/90 text-white">
          <div className="flex items-center gap-2.5 min-w-0">
            <ImageIcon className="h-4 w-4 text-blue-400 shrink-0" />
            <div className="min-w-0">
              <h3 className="text-sm font-semibold truncate text-slate-100">
                {imageName || 'Press Clipping Preview'}
              </h3>
              {rowTitle && (
                <p className="text-xs text-slate-400 truncate max-w-md">
                  {rowTitle}
                </p>
              )}
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyName}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors text-xs inline-flex items-center gap-1"
              title="Copy filename"
            >
              {copied ? <Check className="h-4 w-4 text-green-400" /> : <Copy className="h-4 w-4" />}
            </button>

            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-xs text-slate-400 font-mono w-12 text-center">
              {Math.round(scale * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            <button
              onClick={handleRotate}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Rotate 90deg"
            >
              <RotateCw className="h-4 w-4" />
            </button>

            {imageDataUrl && (
              <button
                onClick={handleDownload}
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Download original file"
              >
                <Download className="h-4 w-4" />
              </button>
            )}

            {linkUrl && (
              <a
                href={linkUrl}
                target="_blank"
                rel="noreferrer"
                className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-800 rounded transition-colors"
                title="Open external article link"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}

            {onUploadNewImage && (
              <label
                className="px-2.5 py-1 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-xs active:scale-95"
                title="Upload and replace this image on server"
              >
                <Upload className="h-3.5 w-3.5" />
                <span>Upload New</span>
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) onUploadNewImage(f);
                    e.target.value = '';
                  }}
                />
              </label>
            )}

            <div className="h-4 w-px bg-slate-700 mx-1" />

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors"
              title="Close (Esc)"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Image Canvas */}
        <div className="relative flex-1 min-h-[400px] overflow-auto bg-slate-950 flex items-center justify-center p-6 select-none">
          {imageDataUrl ? (
            <div
              style={{
                transform: `scale(${scale}) rotate(${rotation}deg)`,
                transition: 'transform 0.15s ease-out',
              }}
              className="origin-center max-w-full"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageDataUrl}
                alt={imageName}
                className="max-h-[65vh] object-contain rounded shadow-lg border border-slate-800 bg-white"
                referrerPolicy="no-referrer"
              />
            </div>
          ) : (
            <div className="text-center text-slate-500 py-12">
              <ImageIcon className="h-12 w-12 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">No image data stored</p>
              <p className="text-xs text-slate-600 mt-1">
                Referenced filename: {imageName}
              </p>
            </div>
          )}
        </div>

        {/* Footer info */}
        <div className="px-5 py-3 border-t border-slate-800 bg-slate-900 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <span>Attachment: <span className="text-slate-200 font-mono font-medium">{imageName}</span></span>
            {linkUrl && (
              <span className="text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded text-[11px] font-mono">
                Linked in Excel
              </span>
            )}
          </div>

          {linkUrl && (
            <div className="flex items-center gap-2">
              <a
                href={linkUrl}
                target="_blank"
                rel="noreferrer"
                className="text-blue-400 hover:text-blue-300 underline flex items-center gap-1 font-mono text-[11px]"
              >
                <span>Open Direct Server URL</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
