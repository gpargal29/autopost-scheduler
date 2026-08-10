import React, { useState, useEffect } from 'react';
import { X, Calendar, Sparkles, Check, Loader2, Share2 } from 'lucide-react';
import { updateQuote } from '../services/quoteService';

const AVAILABLE_PLATFORMS = ['LinkedIn', 'Instagram', 'Facebook'];

const ScheduleModal = ({ quote, isOpen, onClose, onScheduleSuccess }) => {
  const [scheduleType, setScheduleType] = useState('ai'); // 'ai' or 'manual'
  const [scheduledDateTime, setScheduledDateTime] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState(['LinkedIn', 'Instagram']);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quote) {
      // Default to tomorrow 09:00 AM if not set
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(9, 0, 0, 0);

      const formatted = quote.scheduledAt
        ? new Date(quote.scheduledAt).toISOString().slice(0, 16)
        : tomorrow.toISOString().slice(0, 16);

      setScheduledDateTime(formatted);
      setSelectedPlatforms(quote.platforms?.length > 0 ? quote.platforms : ['LinkedIn', 'Instagram']);
    }
  }, [quote]);

  if (!isOpen || !quote) return null;

  const togglePlatform = (platform) => {
    if (selectedPlatforms.includes(platform)) {
      if (selectedPlatforms.length === 1) return; // Must keep at least one
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleApplyAIRecommendation = () => {
    // Generate AI recommended time (e.g. tomorrow at peak focus hour 9:00 AM)
    const rec = new Date();
    rec.setDate(rec.getDate() + 1);
    rec.setHours(9, 30, 0, 0);
    setScheduledDateTime(rec.toISOString().slice(0, 16));
    setScheduleType('ai');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const scheduledDateObj = new Date(scheduledDateTime);
      if (isNaN(scheduledDateObj.getTime())) {
        setError('Please select a valid date and time');
        setSaving(false);
        return;
      }

      const updated = await updateQuote(quote._id, {
        status: 'Scheduled',
        scheduledAt: scheduledDateObj,
        platforms: selectedPlatforms,
      });

      if (updated.success) {
        onScheduleSuccess(updated.quote);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to schedule quote');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div class="glass-panel w-full max-w-lg rounded-2xl border border-slate-800 shadow-2xl overflow-hidden">
        {/* Header */}
        <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Calendar class="w-5 h-5 text-brand-400" />
            <h3 class="text-lg font-bold text-white">Smart Scheduler</h3>
          </div>
          <button
            onClick={onClose}
            class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} class="p-6 space-y-6 text-xs">
          {/* Quote snippet */}
          <div class="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-slate-300 italic">
            "{quote.quote}"
          </div>

          {error && (
            <div class="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              {error}
            </div>
          )}

          {/* Schedule Method Toggle */}
          <div>
            <label class="block font-bold text-slate-300 uppercase tracking-wider mb-2">
              1. Scheduling Option
            </label>
            <div class="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={handleApplyAIRecommendation}
                class={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  scheduleType === 'ai'
                    ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-md shadow-brand-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Sparkles class="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                <div>
                  <div class="font-bold text-white">AI Recommended Time</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">Peak engagement time for {quote.category}</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setScheduleType('manual')}
                class={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                  scheduleType === 'manual'
                    ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-md shadow-brand-500/10'
                    : 'bg-slate-900 border-slate-800 text-slate-400'
                }`}
              >
                <Calendar class="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
                <div>
                  <div class="font-bold text-white">Manual Schedule</div>
                  <div class="text-[10px] text-slate-400 mt-0.5">Custom date and exact time</div>
                </div>
              </button>
            </div>
          </div>

          {/* Date & Time Picker */}
          <div>
            <label class="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">
              2. Select Date & Time
            </label>
            <input
              type="datetime-local"
              value={scheduledDateTime}
              onChange={(e) => {
                setScheduledDateTime(e.target.value);
                setScheduleType('manual');
              }}
              class="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500 font-medium"
              required
            />
          </div>

          {/* Platform Selection */}
          <div>
            <label class="block font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Share2 class="w-3.5 h-3.5 text-brand-400" />
              3. Target Platforms
            </label>
            <div class="flex gap-3">
              {AVAILABLE_PLATFORMS.map((plat) => {
                const isSelected = selectedPlatforms.includes(plat);
                return (
                  <button
                    key={plat}
                    type="button"
                    onClick={() => togglePlatform(plat)}
                    class={`flex-1 py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                      isSelected
                        ? 'bg-slate-800 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10'
                        : 'bg-slate-900/60 border-slate-800 text-slate-500'
                    }`}
                  >
                    {isSelected && <Check class="w-3.5 h-3.5 text-brand-400" />}
                    <span>{plat}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Footer Actions */}
          <div class="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              class="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-brand-500/20"
            >
              {saving ? <Loader2 class="w-4 h-4 animate-spin" /> : <Calendar class="w-4 h-4" />}
              Confirm Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default ScheduleModal;
