import React, { useState, useEffect } from 'react';
import { getQuotes, updateQuote } from '../services/quoteService';
import ScheduleModal from '../components/ScheduleModal';
import {
  CalendarClock,
  Sparkles,
  Calendar,
  Clock,
  Share2,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Play
} from 'lucide-react';

const SmartScheduler = () => {
  const [scheduledQuotes, setScheduledQuotes] = useState([]);
  const [pendingQuotes, setPendingQuotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoScheduling, setAutoScheduling] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);

  const fetchSchedulerData = async () => {
    setLoading(true);
    try {
      // Get scheduled & posted quotes
      const scheduledRes = await getQuotes({ status: 'Scheduled', limit: 50 });
      if (scheduledRes.success) {
        setScheduledQuotes(scheduledRes.quotes);
      }

      // Get pending quotes ready to be scheduled
      const pendingRes = await getQuotes({ status: 'Pending', limit: 50 });
      if (pendingRes.success) {
        setPendingQuotes(pendingRes.quotes);
      }
    } catch (err) {
      console.error('Failed to load scheduler data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSchedulerData();
  }, []);

  // AI Bulk Auto-Schedule Handler
  const handleBulkAutoSchedule = async () => {
    if (pendingQuotes.length === 0) return;
    setAutoScheduling(true);

    try {
      // Distribute pending quotes into optimal daily slots starting tomorrow at 9:00 AM, 2:00 PM, 7:00 PM
      const slots = [9, 14, 19];
      let slotIndex = 0;
      let dayOffset = 1;

      for (let i = 0; i < pendingQuotes.length; i++) {
        const quote = pendingQuotes[i];
        const targetDate = new Date();
        targetDate.setDate(targetDate.getDate() + dayOffset);
        targetDate.setHours(slots[slotIndex], 0, 0, 0);

        await updateQuote(quote._id, {
          status: 'Scheduled',
          scheduledAt: targetDate,
          platforms: ['LinkedIn', 'Instagram'],
        });

        slotIndex++;
        if (slotIndex >= slots.length) {
          slotIndex = 0;
          dayOffset++;
        }
      }

      await fetchSchedulerData();
    } catch (err) {
      alert('Failed to auto-schedule quotes: ' + (err.message || 'Error occurred'));
    } finally {
      setAutoScheduling(false);
    }
  };

  return (
    <div class="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-2">
            <Sparkles class="w-3.5 h-3.5" />
            AI Posting Strategy & Slot Optimization
          </div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight">Smart Scheduler</h1>
          <p class="text-xs text-slate-400 mt-1">Automatically optimize posting times across LinkedIn, Instagram, and Facebook.</p>
        </div>

        {pendingQuotes.length > 0 && (
          <button
            onClick={handleBulkAutoSchedule}
            disabled={autoScheduling}
            class="px-5 py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-brand-500/25 flex items-center gap-2 transition-all shrink-0 self-start md:self-auto disabled:opacity-50"
          >
            {autoScheduling ? (
              <>
                <Loader2 class="w-4 h-4 animate-spin" />
                Scheduling {pendingQuotes.length} Quotes...
              </>
            ) : (
              <>
                <Play class="w-4 h-4" />
                AI Bulk Schedule All ({pendingQuotes.length} Pending)
              </>
            )}
          </button>
        )}
      </div>

      {loading ? (
        <div class="glass-panel p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3 min-h-[300px]">
          <Loader2 class="w-8 h-8 text-brand-500 animate-spin" />
          <span class="text-xs font-semibold">Loading scheduling timeline...</span>
        </div>
      ) : (
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Scheduled Posts Timeline */}
          <div class="lg:col-span-7 space-y-4">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <CalendarClock class="w-5 h-5 text-brand-400" />
              Scheduled Timeline ({scheduledQuotes.length})
            </h2>

            {scheduledQuotes.length === 0 ? (
              <div class="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
                <Clock class="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p class="text-xs font-semibold text-slate-300">No upcoming scheduled quotes</p>
                <p class="text-[11px] text-slate-400 mt-1">Schedule quotes manually or click "AI Bulk Schedule" on pending items.</p>
              </div>
            ) : (
              <div class="space-y-4">
                {scheduledQuotes.map((q) => (
                  <div key={q._id} class="glass-panel p-5 rounded-2xl border border-slate-800 space-y-3">
                    <div class="flex items-center justify-between gap-2">
                      <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-brand-500/10 text-brand-400 border border-brand-500/20">
                        {q.category}
                      </span>
                      <span class="text-xs font-bold text-brand-300 flex items-center gap-1.5 bg-brand-600/10 px-3 py-1 rounded-full border border-brand-500/20">
                        <Calendar class="w-3.5 h-3.5" />
                        {new Date(q.scheduledAt).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' })}
                      </span>
                    </div>

                    <p class="text-xs font-bold text-white italic">"{q.quote}"</p>

                    <div class="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[11px]">
                      <div class="flex items-center gap-1.5 text-slate-400">
                        <Share2 class="w-3.5 h-3.5 text-indigo-400" />
                        Platforms: {q.platforms?.join(', ') || 'LinkedIn, Instagram'}
                      </div>
                      <button
                        onClick={() => setSelectedQuote(q)}
                        class="text-xs text-brand-400 font-semibold hover:underline"
                      >
                        Reschedule
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Pending Queue */}
          <div class="lg:col-span-5 space-y-4">
            <h2 class="text-base font-bold text-white flex items-center gap-2">
              <Clock class="w-5 h-5 text-amber-400" />
              Pending Queue ({pendingQuotes.length})
            </h2>

            {pendingQuotes.length === 0 ? (
              <div class="glass-panel p-8 rounded-2xl border border-slate-800 text-center">
                <CheckCircle2 class="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p class="text-xs font-semibold text-slate-300">All quotes scheduled!</p>
              </div>
            ) : (
              <div class="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                {pendingQuotes.map((q) => (
                  <div key={q._id} class="glass-panel p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <span class="text-[10px] font-bold text-brand-400 block mb-0.5">{q.category}</span>
                      <p class="text-xs font-semibold text-white truncate">"{q.quote}"</p>
                    </div>
                    <button
                      onClick={() => setSelectedQuote(q)}
                      class="px-3 py-1.5 rounded-lg bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 text-xs font-semibold border border-brand-500/30 shrink-0"
                    >
                      Schedule
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Schedule Modal */}
      <ScheduleModal
        quote={selectedQuote}
        isOpen={!!selectedQuote}
        onClose={() => setSelectedQuote(null)}
        onScheduleSuccess={() => fetchSchedulerData()}
      />
    </div>
  );
};

export default SmartScheduler;
