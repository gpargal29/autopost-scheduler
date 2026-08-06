import React, { useState, useEffect } from 'react';
import { getQuotes } from '../services/quoteService';
import { History, CheckCircle2, XCircle, Share2, Calendar, Loader2 } from 'lucide-react';

const PostingHistory = () => {
  const [historyQuotes, setHistoryQuotes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const data = await getQuotes({ limit: 50 });
        if (data.success) {
          // Filter to posted or failed quotes
          const history = data.quotes.filter((q) => q.status === 'Posted' || q.status === 'Failed');
          setHistoryQuotes(history);
        }
      } catch (err) {
        console.error('Failed to fetch posting history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div class="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <History class="w-6 h-6 text-brand-400" />
            Posting History & Audit Logs
          </h1>
          <p class="text-xs text-slate-400 mt-1">Complete log of published and attempted quote executions.</p>
        </div>
      </div>

      {loading ? (
        <div class="glass-panel p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 class="w-8 h-8 text-brand-500 animate-spin" />
          <span class="text-xs font-semibold">Loading execution logs...</span>
        </div>
      ) : historyQuotes.length === 0 ? (
        <div class="glass-panel p-12 rounded-2xl border border-slate-800 text-center">
          <History class="w-8 h-8 text-slate-600 mx-auto mb-2" />
          <p class="text-xs font-semibold text-slate-300">No posting history records found</p>
          <p class="text-[11px] text-slate-400 mt-1">Quotes executed by the background scheduler will appear here.</p>
        </div>
      ) : (
        <div class="glass-panel rounded-2xl border border-slate-800 overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left text-xs text-slate-300">
              <thead class="bg-slate-900/90 text-slate-400 uppercase font-bold text-[10px] tracking-wider border-b border-slate-800">
                <tr>
                  <th class="p-4">Execution Status</th>
                  <th class="p-4">Quote Text</th>
                  <th class="p-4">Category</th>
                  <th class="p-4">Target Platforms</th>
                  <th class="p-4">Posted Date/Time</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-800">
                {historyQuotes.map((q) => (
                  <tr key={q._id} class="hover:bg-slate-900/40 transition-colors">
                    <td class="p-4">
                      {q.status === 'Posted' ? (
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          <CheckCircle2 class="w-3.5 h-3.5" /> Published
                        </span>
                      ) : (
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">
                          <XCircle class="w-3.5 h-3.5" /> Execution Failed
                        </span>
                      )}
                    </td>
                    <td class="p-4 max-w-sm font-semibold text-white truncate">
                      "{q.quote}"
                    </td>
                    <td class="p-4">
                      <span class="px-2 py-0.5 rounded-full text-[10px] font-bold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                        {q.category}
                      </span>
                    </td>
                    <td class="p-4 text-slate-300 font-medium">
                      <div class="flex items-center gap-1">
                        <Share2 class="w-3.5 h-3.5 text-brand-400" />
                        {q.platforms?.join(', ') || 'LinkedIn, Instagram'}
                      </div>
                    </td>
                    <td class="p-4 text-slate-400 font-medium">
                      <div class="flex items-center gap-1">
                        <Calendar class="w-3.5 h-3.5" />
                        {q.postedAt
                          ? new Date(q.postedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })
                          : new Date(q.updatedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default PostingHistory;
