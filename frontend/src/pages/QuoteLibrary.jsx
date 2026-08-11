import React, { useState, useEffect } from 'react';
import {
  getQuotes,
  deleteQuote,
  duplicateQuote
} from '../services/quoteService';
import EditQuoteModal from '../components/EditQuoteModal';
import ScheduleModal from '../components/ScheduleModal';
import Pagination from '../components/Pagination';
import {
  Search,
  Filter,
  Grid,
  List,
  Calendar,
  Edit,
  Trash2,
  Copy,
  Sparkles,
  Loader2,
  Share2,
  Clock,
  CheckCircle2,
  XCircle,
  Clock3
} from 'lucide-react';
import { Link } from 'react-router-dom';

const CATEGORIES = [
  'All',
  'Motivation',
  'Success',
  'Leadership',
  'Business',
  'Productivity',
  'Fitness',
  'Self Improvement',
  'Positivity',
  'Entrepreneurship',
  'Mindfulness',
  'Happiness',
  'Wisdom',
];

const STATUSES = ['All', 'Pending', 'Scheduled', 'Posted', 'Failed'];

const QuoteLibrary = () => {
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'table'
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState({ page: 1, pages: 1, total: 0, limit: 15 });

  // Modals state
  const [editingQuote, setEditingQuote] = useState(null);
  const [schedulingQuote, setSchedulingQuote] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  const fetchQuotes = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 15 };
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedStatus !== 'All') params.status = selectedStatus;
      if (search) params.search = search;

      const data = await getQuotes(params);
      if (data.success) {
        if (data.quotes.length === 0 && data.total > 0 && page > data.pages) {
          setPage(data.pages);
          return;
        }
        setQuotes(data.quotes);
        setPaginationMeta({
          page: data.page || 1,
          pages: data.pages || 1,
          total: data.total || 0,
          limit: 15,
        });
      }
    } catch (err) {
      console.error('Failed to fetch quotes:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
  }, [selectedCategory, selectedStatus, search]);

  useEffect(() => {
    fetchQuotes();
  }, [selectedCategory, selectedStatus, search, page]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this quote?')) return;
    setActionLoading(id);
    try {
      const res = await deleteQuote(id);
      if (res.success) {
        if (quotes.length === 1 && page > 1) {
          setPage((prev) => prev - 1);
        } else {
          fetchQuotes();
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete quote');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDuplicate = async (id) => {
    setActionLoading(id);
    try {
      const res = await duplicateQuote(id);
      if (res.success) {
        fetchQuotes();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to duplicate quote');
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Scheduled':
        return (
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
            <Clock3 class="w-3 h-3" /> Scheduled
          </span>
        );
      case 'Posted':
        return (
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
            <CheckCircle2 class="w-3 h-3" /> Posted
          </span>
        );
      case 'Failed':
        return (
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
            <XCircle class="w-3 h-3" /> Failed
          </span>
        );
      default:
        return (
          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">
            <Clock class="w-3 h-3" /> Pending
          </span>
        );
    }
  };

  return (
    <div class="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight">Quote Library</h1>
          <p class="text-xs text-slate-400 mt-1">Manage, search, filter, schedule, and duplicate your AI-generated quotes.</p>
        </div>
        <Link
          to="/generator"
          class="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/20 flex items-center gap-2 self-start md:self-auto"
        >
          <Sparkles class="w-4 h-4" />
          Generate New Quote
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div class="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div class="flex flex-wrap items-center gap-3 flex-1 min-w-[280px]">
          {/* Search Input */}
          <div class="relative flex-1 min-w-[200px]">
            <Search class="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search quotes, authors, captions..."
              class="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 text-xs"
            />
          </div>

          {/* Category Filter */}
          <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Filter class="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              class="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} class="bg-slate-900 text-white">
                  Category: {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div class="flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              class="bg-transparent text-white focus:outline-none cursor-pointer"
            >
              {STATUSES.map((st) => (
                <option key={st} value={st} class="bg-slate-900 text-white">
                  Status: {st}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* View Mode Toggle */}
        <div class="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setViewMode('grid')}
            class={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'grid' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Grid View"
          >
            <Grid class="w-4 h-4" />
          </button>
          <button
            onClick={() => setViewMode('table')}
            class={`p-1.5 rounded-lg text-xs transition-colors ${
              viewMode === 'table' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'
            }`}
            title="Table View"
          >
            <List class="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quote Grid / Table View */}
      {loading ? (
        <div class="glass-panel p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3 min-h-[300px]">
          <Loader2 class="w-8 h-8 text-brand-500 animate-spin" />
          <span class="text-xs font-semibold">Loading quote library...</span>
        </div>
      ) : quotes.length === 0 ? (
        <div class="glass-panel p-12 rounded-2xl border border-slate-800 text-center flex flex-col items-center justify-center min-h-[300px]">
          <Sparkles class="w-8 h-8 text-slate-600 mb-3" />
          <h3 class="text-base font-bold text-white mb-1">No Quotes Found</h3>
          <p class="text-xs text-slate-400 mb-4 max-w-sm">No quotes match your selected search criteria or filters.</p>
          <Link
            to="/generator"
            class="px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-xs"
          >
            Generate First Quote
          </Link>
        </div>
      ) : viewMode === 'grid' ? (
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quotes.map((q) => (
            <div
              key={q._id}
              class="glass-panel p-6 rounded-2xl border border-slate-800 hover:border-slate-700 transition-all flex flex-col justify-between space-y-4 relative group"
            >
              <div>
                <div class="flex items-center justify-between gap-2 mb-3">
                  <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-brand-500/10 text-brand-400 border border-brand-500/20">
                    {q.category}
                  </span>
                  {getStatusBadge(q.status)}
                </div>

                <blockquote class="text-sm font-bold text-white italic leading-relaxed mb-2">
                  "{q.quote}"
                </blockquote>
                <p class="text-[11px] font-semibold text-slate-400 text-right">— {q.author}</p>

                {q.scheduledAt && (
                  <div class="mt-3 p-2 bg-slate-900/60 rounded-xl border border-slate-800 flex items-center justify-between text-[11px] text-slate-300">
                    <span class="flex items-center gap-1.5 text-blue-400">
                      <Calendar class="w-3.5 h-3.5" />
                      {new Date(q.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>
                    <div class="flex gap-1">
                      {q.platforms?.map((p) => (
                        <span key={p} class="px-1.5 py-0.5 bg-slate-800 rounded text-[9px] font-bold text-slate-400">
                          {p.slice(0, 2)}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Actions toolbar */}
              <div class="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs">
                {q.status !== 'Posted' ? (
                  <button
                    onClick={() => setSchedulingQuote(q)}
                    class={`px-3 py-1.5 rounded-lg border font-semibold flex items-center gap-1.5 transition-colors ${
                      q.status === 'Scheduled'
                        ? 'bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border-indigo-500/30'
                        : q.status === 'Failed'
                        ? 'bg-rose-600/20 hover:bg-rose-600/30 text-rose-300 border-rose-500/30'
                        : 'bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 border-brand-500/30'
                    }`}
                  >
                    <Calendar class="w-3.5 h-3.5" />
                    {q.status === 'Scheduled' ? 'Reschedule' : q.status === 'Failed' ? 'Retry' : 'Schedule'}
                  </button>
                ) : (
                  <div />
                )}

                <div class="flex items-center gap-1">
                  <button
                    onClick={() => setEditingQuote(q)}
                    class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Edit Quote"
                  >
                    <Edit class="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDuplicate(q._id)}
                    disabled={actionLoading === q._id}
                    class="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Duplicate Quote"
                  >
                    <Copy class="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(q._id)}
                    disabled={actionLoading === q._id}
                    class="p-2 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                    title="Delete Quote"
                  >
                    <Trash2 class="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th class="p-4">Quote</th>
                  <th class="p-4">Category</th>
                  <th class="p-4">Status</th>
                  <th class="p-4">Scheduled At</th>
                  <th class="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                {quotes.map((q) => (
                  <tr key={q._id} class="hover:bg-slate-900/40 transition-colors">
                    <td class="p-4 max-w-xs font-semibold text-white truncate">
                      "{q.quote}"
                    </td>
                    <td class="p-4">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                        {q.category}
                      </span>
                    </td>
                    <td class="p-4">{getStatusBadge(q.status)}</td>
                    <td class="p-4 text-slate-400">
                      {q.scheduledAt
                        ? new Date(q.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                        : '—'}
                    </td>
                    <td class="p-4 text-right">
                      <div class="flex items-center justify-end gap-1">
                        {q.status !== 'Posted' && (
                          <button
                            onClick={() => setSchedulingQuote(q)}
                            class={`p-1.5 rounded-lg transition-colors ${
                              q.status === 'Scheduled'
                                ? 'text-indigo-400 hover:bg-indigo-500/10'
                                : q.status === 'Failed'
                                ? 'text-rose-400 hover:bg-rose-500/10'
                                : 'text-brand-400 hover:bg-brand-500/10'
                            }`}
                            title={q.status === 'Scheduled' ? 'Reschedule' : q.status === 'Failed' ? 'Retry' : 'Schedule'}
                          >
                            <Calendar class="w-4 h-4" />
                          </button>
                        )}
                        <button
                          onClick={() => setEditingQuote(q)}
                          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                          title="Edit"
                        >
                          <Edit class="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDuplicate(q._id)}
                          class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
                          title="Duplicate"
                        >
                          <Copy class="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(q._id)}
                          class="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10"
                          title="Delete"
                        >
                          <Trash2 class="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Controls */}
      <Pagination
        page={page}
        pages={paginationMeta.pages}
        total={paginationMeta.total}
        limit={15}
        onPageChange={(p) => setPage(p)}
        label="quotes"
      />

      {/* Edit Modal */}
      <EditQuoteModal
        quote={editingQuote}
        isOpen={!!editingQuote}
        onClose={() => setEditingQuote(null)}
        onUpdateSuccess={() => fetchQuotes()}
      />

      {/* Schedule Modal */}
      <ScheduleModal
        quote={schedulingQuote}
        isOpen={!!schedulingQuote}
        onClose={() => setSchedulingQuote(null)}
        onScheduleSuccess={() => fetchQuotes()}
      />
    </div>
  );
};

export default QuoteLibrary;
