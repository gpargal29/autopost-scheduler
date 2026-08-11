import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ page, pages, total, limit, onPageChange, label = 'records' }) => {
  if (!total || total <= 0 || pages <= 1) return null;

  const start = Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 glass-panel p-3.5 rounded-2xl border border-slate-800 text-xs">
      <div className="text-slate-400 font-medium">
        Showing <span className="text-white font-bold">{start}–{end}</span> of{' '}
        <span className="text-white font-bold">{total}</span> {label}
      </div>

      <div className="flex items-center gap-3">
        <span className="text-slate-400 font-medium">
          Page <span className="text-white font-bold">{page}</span> of{' '}
          <span className="text-white font-bold">{pages}</span>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="Previous page"
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 disabled:cursor-not-allowed transition-all"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pages}
            aria-label="Next page"
            className="p-1.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 disabled:opacity-40 disabled:hover:bg-slate-900 disabled:cursor-not-allowed transition-all"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
