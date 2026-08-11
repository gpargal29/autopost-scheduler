import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, Sparkles, Check, Loader2, Share2, Clock, AlertCircle } from 'lucide-react';
import { updateQuote, createQuote } from '../services/quoteService';
import { parseSuggestedPostingTime } from '../utils/dateHelpers';
import { getConnectedPlatforms } from '../services/socialService';

const AVAILABLE_PLATFORMS = ['LinkedIn', 'Instagram', 'Facebook'];

const pad = (n) => String(n).padStart(2, '0');

const ScheduleModal = ({ quote, isOpen, onClose, onScheduleSuccess }) => {
  const [scheduleType, setScheduleType] = useState('ai'); // 'ai' or 'manual'
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [selectedPlatforms, setSelectedPlatforms] = useState([]);
  const [connectedPlatforms, setConnectedPlatforms] = useState([]);
  const [loadingPlatforms, setLoadingPlatforms] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const dateInputRef = useRef(null);
  const timeInputRef = useRef(null);

  const openDatePicker = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        try {
          dateInputRef.current.showPicker();
        } catch (err) {
          dateInputRef.current.focus();
        }
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  const openTimePicker = () => {
    if (timeInputRef.current) {
      if (typeof timeInputRef.current.showPicker === 'function') {
        try {
          timeInputRef.current.showPicker();
        } catch (err) {
          timeInputRef.current.focus();
        }
      } else {
        timeInputRef.current.focus();
      }
    }
  };

  const applyDateObjToState = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = pad(dateObj.getMonth() + 1);
    const day = pad(dateObj.getDate());
    const hours = pad(dateObj.getHours());
    const minutes = pad(dateObj.getMinutes());

    setScheduledDate(`${year}-${month}-${day}`);
    setScheduledTime(`${hours}:${minutes}`);
  };

  useEffect(() => {
    if (quote && isOpen) {
      const targetDate = quote.scheduledAt
        ? new Date(quote.scheduledAt)
        : parseSuggestedPostingTime(quote.suggestedPostingTime);

      applyDateObjToState(targetDate);

      const initPlatforms = async () => {
        setLoadingPlatforms(true);
        const connected = await getConnectedPlatforms();
        setConnectedPlatforms(connected);

        if (quote.platforms && quote.platforms.length > 0) {
          const validSelected = quote.platforms.filter((p) => connected.includes(p));
          setSelectedPlatforms(validSelected);
        } else {
          setSelectedPlatforms(connected);
        }
        setLoadingPlatforms(false);
      };

      initPlatforms();
    }
  }, [quote, isOpen]);

  if (!isOpen || !quote) return null;

  const togglePlatform = (platform) => {
    if (!connectedPlatforms.includes(platform)) return;

    if (selectedPlatforms.includes(platform)) {
      setSelectedPlatforms(selectedPlatforms.filter((p) => p !== platform));
    } else {
      setSelectedPlatforms([...selectedPlatforms, platform]);
    }
  };

  const handleApplyAIRecommendation = () => {
    const targetDate = parseSuggestedPostingTime(quote.suggestedPostingTime);
    applyDateObjToState(targetDate);
    setScheduleType('ai');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (!scheduledDate || !scheduledTime) {
        setError('Please select both a valid date and time');
        setSaving(false);
        return;
      }

      if (selectedPlatforms.length === 0) {
        setError('Connect at least one social account to schedule this post.');
        setSaving(false);
        return;
      }

      const scheduledDateObj = new Date(`${scheduledDate}T${scheduledTime}`);
      if (isNaN(scheduledDateObj.getTime())) {
        setError('Please select a valid date and time');
        setSaving(false);
        return;
      }

      let updated;
      if (quote._id) {
        updated = await updateQuote(quote._id, {
          status: 'Scheduled',
          scheduledAt: scheduledDateObj,
          platforms: selectedPlatforms,
        });
      } else {
        updated = await createQuote({
          ...quote,
          status: 'Scheduled',
          scheduledAt: scheduledDateObj,
          platforms: selectedPlatforms,
        });
      }

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
                  class={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${scheduleType === 'ai'
                      ? 'bg-brand-600/20 border-brand-500 text-brand-300 shadow-md shadow-brand-500/10'
                      : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                >
                  <Sparkles class="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                  <div>
                    <div class="font-bold text-white">AI Recommended Time</div>
                    <div class="text-[10px] text-slate-400 mt-0.5 font-medium">{quote.suggestedPostingTime || `Peak engagement time for ${quote.category}`}</div>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setScheduleType('manual')}
                  class={`p-3 rounded-xl border text-left flex items-start gap-2.5 transition-all ${scheduleType === 'manual'
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
              <label class="block font-bold text-slate-300 uppercase tracking-wider mb-2">
                2. Schedule
              </label>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* Date Picker */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 focus-within:border-brand-500 transition-all">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Schedule Date</span>
                    <button
                      type="button"
                      onClick={openDatePicker}
                      className="text-brand-400 hover:text-brand-300 transition-colors p-0.5"
                      title="Open Calendar"
                    >
                      <Calendar class="w-3.5 h-3.5" />
                    </button>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      ref={dateInputRef}
                      type="date"
                      value={scheduledDate}
                      onChange={(e) => {
                        setScheduledDate(e.target.value);
                        setScheduleType('manual');
                      }}
                      className="w-full bg-slate-900 border border-slate-800/80 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-brand-500 font-medium text-xs color-scheme-dark cursor-pointer"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Choose the posting date</span>
                </div>

                {/* Time Picker */}
                <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 focus-within:border-indigo-500 transition-all">
                  <label className="block text-[11px] font-semibold text-slate-300 mb-1 flex items-center justify-between">
                    <span>Posting Time</span>
                    <button
                      type="button"
                      onClick={openTimePicker}
                      className="text-indigo-400 hover:text-indigo-300 transition-colors p-0.5"
                      title="Open Clock"
                    >
                      <Clock class="w-3.5 h-3.5" />
                    </button>
                  </label>
                  <div className="relative flex items-center">
                    <input
                      ref={timeInputRef}
                      type="time"
                      value={scheduledTime}
                      onChange={(e) => {
                        setScheduledTime(e.target.value);
                        setScheduleType('manual');
                      }}
                      className="w-full bg-slate-900 border border-slate-800/80 rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-indigo-500 font-medium text-xs color-scheme-dark cursor-pointer"
                      required
                    />
                  </div>
                  <span className="text-[10px] text-slate-500 mt-1 block">Choose the posting time</span>
                </div>
              </div>
            </div>

            {/* Platform Selection */}
            <div>
              <label class="block font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Share2 class="w-3.5 h-3.5 text-brand-400" />
                3. Target Platforms
              </label>
              <div class="flex gap-3">
                {AVAILABLE_PLATFORMS.map((plat) => {
                  const isConnected = connectedPlatforms.includes(plat);
                  const isSelected = selectedPlatforms.includes(plat);
                  return (
                    <button
                      key={plat}
                      type="button"
                      onClick={() => togglePlatform(plat)}
                      disabled={!isConnected}
                      class={`flex-1 py-2.5 px-3 rounded-xl border font-bold flex items-center justify-center gap-2 transition-all ${
                        !isConnected
                          ? 'bg-slate-950/40 border-slate-800/50 text-slate-600 cursor-not-allowed opacity-60'
                          : isSelected
                          ? 'bg-slate-800 border-brand-500 text-brand-400 shadow-md shadow-brand-500/10'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:border-slate-700'
                      }`}
                      title={!isConnected ? `${plat} is disconnected` : `Toggle ${plat}`}
                    >
                      {isSelected && <Check class="w-3.5 h-3.5 text-brand-400" />}
                      <span>{plat}</span>
                      {!isConnected && <span class="text-[9px] font-normal text-slate-500">(Off)</span>}
                    </button>
                  );
                })}
              </div>

              {selectedPlatforms.length === 0 && (
                <div class="mt-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs flex items-center gap-2">
                  <AlertCircle class="w-4 h-4 shrink-0" />
                  <span>Connect at least one social account to schedule this post.</span>
                </div>
              )}
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
                disabled={saving || selectedPlatforms.length === 0 || loadingPlatforms}
                class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold flex items-center gap-2 shadow-lg shadow-brand-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
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
