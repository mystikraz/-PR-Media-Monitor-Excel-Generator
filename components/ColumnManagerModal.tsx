'use client';

import React, { useState } from 'react';
import { ColumnDef } from '@/lib/types';
import { X, ArrowUp, ArrowDown, Trash2, Plus, RotateCcw, Check } from 'lucide-react';
import { DEFAULT_COLUMNS } from '@/lib/sampleData';

interface ColumnManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  columns: ColumnDef[];
  onChangeColumns: (columns: ColumnDef[]) => void;
}

export const ColumnManagerModal: React.FC<ColumnManagerModalProps> = ({
  isOpen,
  onClose,
  columns,
  onChangeColumns,
}) => {
  const [localCols, setLocalCols] = useState<ColumnDef[]>(columns);
  const [newColLabel, setNewColLabel] = useState('');
  const [newColType, setNewColType] = useState<ColumnDef['type']>('text');

  if (!isOpen) return null;

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= localCols.length) return;

    const next = [...localCols];
    const [moved] = next.splice(index, 1);
    next.splice(targetIndex, 0, moved);
    setLocalCols(next);
  };

  const handleUpdate = (index: number, field: keyof ColumnDef, value: any) => {
    const next = [...localCols];
    next[index] = { ...next[index], [field]: value };
    setLocalCols(next);
  };

  const handleDelete = (index: number) => {
    if (localCols.length <= 1) return;
    setLocalCols(localCols.filter((_, i) => i !== index));
  };

  const handleAddColumn = () => {
    if (!newColLabel.trim()) return;
    const newKey = newColLabel.toLowerCase().replace(/[^a-z0-9]/g, '_');
    const newCol: ColumnDef = {
      id: `col_${Date.now()}`,
      key: newKey,
      label: newColLabel.trim(),
      width: 20,
      align: 'left',
      type: newColType,
    };
    setLocalCols([...localCols, newCol]);
    setNewColLabel('');
  };

  const handleReset = () => {
    setLocalCols(DEFAULT_COLUMNS);
  };

  const handleSave = () => {
    onChangeColumns(localCols);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="w-full max-w-2xl bg-white rounded-xl shadow-xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50">
          <div>
            <h3 className="text-base font-semibold text-slate-900">
              Customize Report Columns &amp; Headers
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Reorder, rename, or add custom fields to both the table and the generated Excel workbook.
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 rounded-lg p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Column List */}
          <div className="space-y-2">
            {localCols.map((col, idx) => (
              <div
                key={col.id || col.key}
                className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-lg hover:border-slate-300 transition-colors"
              >
                {/* Reorder Buttons */}
                <div className="flex flex-col gap-0.5">
                  <button
                    type="button"
                    disabled={idx === 0}
                    onClick={() => handleMove(idx, 'up')}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
                    title="Move column left / up"
                  >
                    <ArrowUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    disabled={idx === localCols.length - 1}
                    onClick={() => handleMove(idx, 'down')}
                    className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-30 disabled:hover:text-slate-400"
                    title="Move column right / down"
                  >
                    <ArrowDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Column Name */}
                <div className="flex-1 min-w-0">
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                    Header Label ({col.key})
                  </label>
                  <input
                    type="text"
                    value={col.label}
                    onChange={(e) => handleUpdate(idx, 'label', e.target.value)}
                    className="w-full text-xs font-medium rounded border border-slate-300 bg-white px-2 py-1 text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Alignment */}
                <div className="w-24">
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                    Align
                  </label>
                  <select
                    value={col.align}
                    onChange={(e) => handleUpdate(idx, 'align', e.target.value as any)}
                    className="w-full text-xs rounded border border-slate-300 bg-white px-2 py-1 text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  >
                    <option value="left">Left</option>
                    <option value="center">Center</option>
                    <option value="right">Right</option>
                  </select>
                </div>

                {/* Width */}
                <div className="w-20">
                  <label className="text-[10px] uppercase font-semibold text-slate-400 block mb-0.5">
                    Excel Width
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="100"
                    value={col.width || 20}
                    onChange={(e) => handleUpdate(idx, 'width', parseInt(e.target.value, 10) || 15)}
                    className="w-full text-xs rounded border border-slate-300 bg-white px-2 py-1 text-slate-800 focus:border-blue-500 focus:outline-hidden"
                  />
                </div>

                {/* Delete Column */}
                <div className="pt-4">
                  <button
                    type="button"
                    onClick={() => handleDelete(idx)}
                    disabled={localCols.length <= 1}
                    className="p-1.5 text-slate-400 hover:text-red-500 disabled:opacity-20 transition-colors"
                    title="Remove column"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add New Column Form */}
          <div className="p-4 border border-dashed border-slate-300 rounded-lg bg-slate-50/50 space-y-3">
            <h4 className="text-xs font-semibold text-slate-700">Add New Column</h4>
            <div className="flex flex-wrap items-center gap-2">
              <input
                type="text"
                placeholder="Column Name (e.g. Sentiment, AVE, Journalist)"
                value={newColLabel}
                onChange={(e) => setNewColLabel(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddColumn()}
                className="flex-1 min-w-[200px] text-xs rounded border border-slate-300 bg-white px-3 py-1.5 text-slate-800 focus:border-blue-500 focus:outline-hidden"
              />
              <select
                value={newColType}
                onChange={(e) => setNewColType(e.target.value as any)}
                className="text-xs rounded border border-slate-300 bg-white px-3 py-1.5 text-slate-800 focus:border-blue-500 focus:outline-hidden"
              >
                <option value="text">Text</option>
                <option value="number">Number</option>
                <option value="link_image">Link / Image</option>
              </select>
              <button
                type="button"
                onClick={handleAddColumn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded transition-colors cursor-pointer"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Column</span>
              </button>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Standard PR Columns</span>
          </button>

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
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-900 hover:bg-blue-800 rounded-md shadow-xs transition-colors"
            >
              <Check className="h-3.5 w-3.5" />
              <span>Apply Changes</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
