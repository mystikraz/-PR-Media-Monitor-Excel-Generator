'use client';

import React, { useState } from 'react';
import { ReportMeta } from '@/lib/types';
import { Building2, Calendar, ChevronDown, ChevronUp, Palette, Plus, Trash2, HelpCircle } from 'lucide-react';

interface ReportMetaEditorProps {
  meta: ReportMeta;
  onChange: (updated: ReportMeta) => void;
}

const THEME_PRESETS = [
  { name: 'Navy Blue', hex: '#1E3A8A' },
  { name: 'Forest Emerald', hex: '#065F46' },
  { name: 'Slate Executive', hex: '#0F172A' },
  { name: 'Burgundy Crimson', hex: '#881337' },
  { name: 'Classic Charcoal', hex: '#262626' },
];

export const ReportMetaEditor: React.FC<ReportMetaEditorProps> = ({ meta, onChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [newTabInput, setNewTabInput] = useState('');

  const updateField = <K extends keyof ReportMeta>(field: K, value: ReportMeta[K]) => {
    onChange({
      ...meta,
      [field]: value,
    });
  };

  const setTodayDate = () => {
    const today = new Date();
    const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
    const dateStr = today.toLocaleDateString('en-GB', options);
    updateField('reportDate', dateStr);
  };

  const addCategoryTab = () => {
    if (!newTabInput.trim()) return;
    updateField('quickCategoryTabs', [...meta.quickCategoryTabs, newTabInput.trim()]);
    setNewTabInput('');
  };

  const removeCategoryTab = (index: number) => {
    const updated = meta.quickCategoryTabs.filter((_, i) => i !== index);
    updateField('quickCategoryTabs', updated);
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden transition-all">
      {/* Header Banner Preview & Quick Edit */}
      <div 
        className="p-5 text-white transition-colors"
        style={{ backgroundColor: meta.themeColor || '#1E3A8A' }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={meta.companyName}
                onChange={(e) => updateField('companyName', e.target.value)}
                placeholder="Company Name"
                className="text-lg sm:text-xl font-bold bg-transparent border-b border-white/30 focus:border-white focus:outline-hidden px-1 py-0.5 w-full sm:w-auto tracking-tight"
                title="Click to edit company name"
              />
            </div>
            <div>
              <input
                type="text"
                value={meta.reportTitle}
                onChange={(e) => updateField('reportTitle', e.target.value)}
                placeholder="Report Title"
                className="text-sm sm:text-base font-medium text-white/90 bg-transparent border-b border-transparent hover:border-white/30 focus:border-white focus:outline-hidden px-1 py-0.5 w-full sm:w-auto"
                title="Click to edit report title"
              />
            </div>
          </div>

          {/* Quick Date and Settings Button */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1.5 bg-black/20 rounded-lg px-3 py-1.5 text-xs text-white/95 border border-white/10">
              <Calendar className="h-3.5 w-3.5 text-white/70" />
              <input
                type="text"
                value={meta.reportDate}
                onChange={(e) => updateField('reportDate', e.target.value)}
                placeholder="24th August 2026"
                className="bg-transparent focus:outline-hidden font-medium w-36 text-xs"
              />
              <button
                type="button"
                onClick={setTodayDate}
                className="text-[10px] bg-white/20 hover:bg-white/30 rounded px-1.5 py-0.5 transition-colors cursor-pointer"
              >
                Today
              </button>
            </div>

            <button
              type="button"
              onClick={() => setIsExpanded(!isExpanded)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-white/15 hover:bg-white/25 transition-colors cursor-pointer"
            >
              <Palette className="h-3.5 w-3.5" />
              <span>{isExpanded ? 'Hide Settings' : 'Customize Header'}</span>
              {isExpanded ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Sub-header instruction and category links */}
        <div className="mt-4 pt-3 border-t border-white/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-white/80">
          <div className="flex items-center gap-2">
            <span className="italic text-white/90">
              {meta.clickInstruction || '(Kindly click the link)'}
            </span>
          </div>

          {/* Quick Category tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {meta.quickCategoryTabs.map((tab, idx) => (
              <span
                key={idx}
                className="bg-white/15 text-white px-2.5 py-1 rounded text-[11px] font-medium"
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Expanded Customization Panel */}
      {isExpanded && (
        <div className="p-5 bg-slate-50 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
          {/* Section 1: Texts & Headings */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 text-xs tracking-wider uppercase">
              Header Labels
            </h4>
            
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Instruction Text (Row 6)
              </label>
              <input
                type="text"
                value={meta.clickInstruction}
                onChange={(e) => updateField('clickInstruction', e.target.value)}
                className="w-full text-xs rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-800 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Active Section Title (Row 9)
              </label>
              <input
                type="text"
                value={meta.sectionTitle}
                onChange={(e) => updateField('sectionTitle', e.target.value)}
                className="w-full text-xs font-bold rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-800 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">
                Footer Closing Note
              </label>
              <input
                type="text"
                value={meta.footerNote}
                onChange={(e) => updateField('footerNote', e.target.value)}
                className="w-full text-xs rounded-md border border-slate-300 bg-white px-2.5 py-1.5 text-slate-800 focus:border-blue-500 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Section 2: Quick Category Tabs */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-800 text-xs tracking-wider uppercase">
                Report Stream Tabs (Row 7)
              </h4>
              <span className="text-[11px] text-slate-500">
                Shown below header
              </span>
            </div>

            <div className="space-y-1.5 max-h-32 overflow-y-auto pr-1">
              {meta.quickCategoryTabs.map((tab, idx) => (
                <div key={idx} className="flex items-center justify-between bg-white border border-slate-200 px-2.5 py-1 rounded text-xs text-slate-700">
                  <span className="truncate">{tab}</span>
                  <button
                    type="button"
                    onClick={() => removeCategoryTab(idx)}
                    className="text-slate-400 hover:text-red-500 ml-2"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Broadcast & TV News"
                value={newTabInput}
                onChange={(e) => setNewTabInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addCategoryTab()}
                className="flex-1 text-xs rounded-md border border-slate-300 bg-white px-2.5 py-1 text-slate-800 focus:border-blue-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={addCategoryTab}
                className="px-2.5 py-1 bg-slate-800 text-white rounded-md text-xs font-medium hover:bg-slate-700 transition-colors"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Section 3: Color Theme & Formatting options */}
          <div className="space-y-3">
            <h4 className="font-semibold text-slate-800 text-xs tracking-wider uppercase">
              Excel Header Styling
            </h4>

            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1.5">
                Corporate Color Theme
              </label>
              <div className="flex items-center gap-2">
                {THEME_PRESETS.map((preset) => (
                  <button
                    key={preset.hex}
                    type="button"
                    onClick={() => updateField('themeColor', preset.hex)}
                    style={{ backgroundColor: preset.hex }}
                    className={`h-7 w-7 rounded-md transition-all cursor-pointer border ${
                      meta.themeColor === preset.hex
                        ? 'ring-2 ring-blue-500 ring-offset-2 scale-105 border-white'
                        : 'border-transparent opacity-85 hover:opacity-100'
                    }`}
                    title={preset.name}
                  />
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-700">
                <input
                  type="checkbox"
                  checked={meta.mergeDuplicateSubjects}
                  onChange={(e) => updateField('mergeDuplicateSubjects', e.target.checked)}
                  className="rounded border-slate-300 text-blue-900 focus:ring-blue-500"
                />
                <span>Keep clean PR blank continuation rows for repeated subjects</span>
              </label>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
