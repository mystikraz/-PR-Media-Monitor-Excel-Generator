'use client';

import React from 'react';
import { 
  Sparkles, 
  ListOrdered, 
  Type, 
  ArrowDownToLine, 
  Layers, 
  Eraser, 
  CheckCheck,
  Hash
} from 'lucide-react';

interface DataFormattingToolbarProps {
  onRenumber: () => void;
  onApplyTitleCase: () => void;
  onApplySentenceCase: () => void;
  onStandardizeRomanPages: () => void;
  onFillDownSubjects: () => void;
  onClearDuplicateSubjects: () => void;
  onCleanQuotesAndSpaces: () => void;
  onStandardizeAll: () => void;
  selectedCount?: number;
}

export const DataFormattingToolbar: React.FC<DataFormattingToolbarProps> = ({
  onRenumber,
  onApplyTitleCase,
  onApplySentenceCase,
  onStandardizeRomanPages,
  onFillDownSubjects,
  onClearDuplicateSubjects,
  onCleanQuotesAndSpaces,
  onStandardizeAll,
}) => {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white border border-slate-200 rounded-xl shadow-xs">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800">
        <Sparkles className="h-4 w-4 text-blue-700" />
        <span>Auto-Formatting Tools:</span>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {/* All-in-one Smart Standardize */}
        <button
          type="button"
          onClick={onStandardizeAll}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue-900 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg transition-colors cursor-pointer"
          title="Cleans quotes (e.g. People`s -> People's), trims whitespace, and standardizes publications & sections in one click"
        >
          <CheckCheck className="h-3.5 w-3.5 text-blue-700" />
          <span>Auto-Clean All</span>
        </button>

        <div className="h-4 w-px bg-slate-200 mx-1 hidden sm:block" />

        {/* Renumber */}
        <button
          type="button"
          onClick={onRenumber}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          title="Re-number rows sequentially from 1 to N"
        >
          <ListOrdered className="h-3.5 w-3.5 text-slate-500" />
          <span>Renumber (1..N)</span>
        </button>

        {/* Title Case */}
        <button
          type="button"
          onClick={onApplyTitleCase}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          title="Format Headings and Sections to Title Case"
        >
          <Type className="h-3.5 w-3.5 text-slate-500" />
          <span>Title Case</span>
        </button>

        {/* Fill Subjects Down */}
        <button
          type="button"
          onClick={onFillDownSubjects}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          title="Fill down empty subject cells with their parent subject"
        >
          <ArrowDownToLine className="h-3.5 w-3.5 text-slate-500" />
          <span>Fill Down Subjects</span>
        </button>

        {/* Clear Duplicate Subjects */}
        <button
          type="button"
          onClick={onClearDuplicateSubjects}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          title="Blank out repeated consecutive subjects for PR report continuation style"
        >
          <Layers className="h-3.5 w-3.5 text-slate-500" />
          <span>Clear Duplicates</span>
        </button>

        {/* Roman Numerals for Editorial Pages */}
        <button
          type="button"
          onClick={onStandardizeRomanPages}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          title="Ensure Roman numerals for editorial pages like 'ii', 'iv' are lowercased"
        >
          <Hash className="h-3.5 w-3.5 text-slate-500" />
          <span>Roman Pages</span>
        </button>

        {/* Clean Quotes & Spaces */}
        <button
          type="button"
          onClick={onCleanQuotesAndSpaces}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors cursor-pointer"
          title="Fix backticks, normalize curly quotes, and trim extra whitespace"
        >
          <Eraser className="h-3.5 w-3.5 text-slate-500" />
          <span>Clean Quotes</span>
        </button>
      </div>
    </div>
  );
};
