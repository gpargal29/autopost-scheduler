import React, { useState, useEffect } from 'react';
import { X, Save, Loader2, Sparkles } from 'lucide-react';
import { updateQuote } from '../services/quoteService';

const CATEGORIES = [
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

const EditQuoteModal = ({ quote, isOpen, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    quote: '',
    author: '',
    category: 'Motivation',
    caption: '',
    explanation: '',
    hashtags: '',
    imagePrompt: '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (quote) {
      setFormData({
        quote: quote.quote || '',
        author: quote.author || 'AI Generated',
        category: quote.category || 'Motivation',
        caption: quote.caption || '',
        explanation: quote.explanation || '',
        hashtags: Array.isArray(quote.hashtags) ? quote.hashtags.join(' ') : quote.hashtags || '',
        imagePrompt: quote.imagePrompt || '',
      });
    }
  }, [quote]);

  if (!isOpen || !quote) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      const hashtagArray = formData.hashtags
        .split(' ')
        .filter((tag) => tag.trim().length > 0)
        .map((tag) => (tag.startsWith('#') ? tag : `#${tag}`));

      const updated = await updateQuote(quote._id, {
        ...formData,
        hashtags: hashtagArray,
      });

      if (updated.success) {
        onUpdateSuccess(updated.quote);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update quote');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div class="glass-panel w-full max-w-2xl rounded-2xl border border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div class="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Sparkles class="w-5 h-5 text-brand-400" />
            <h3 class="text-lg font-bold text-white">Edit Quote & Content</h3>
          </div>
          <button
            onClick={onClose}
            class="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        {/* Body Form */}
        <form onSubmit={handleSubmit} class="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {error && (
            <div class="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl">
              {error}
            </div>
          )}

          <div>
            <label class="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">Quote Text</label>
            <textarea
              rows="3"
              value={formData.quote}
              onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
              class="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
              required
            />
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">Author</label>
              <input
                type="text"
                value={formData.author}
                onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                class="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
              />
            </div>

            <div>
              <label class="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                class="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label class="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">Caption</label>
            <textarea
              rows="3"
              value={formData.caption}
              onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
              class="w-full p-3 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">Hashtags (Space separated)</label>
            <input
              type="text"
              value={formData.hashtags}
              onChange={(e) => setFormData({ ...formData, hashtags: e.target.value })}
              placeholder="#Motivation #Success #Growth"
              class="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500"
            />
          </div>

          <div>
            <label class="block font-bold text-slate-300 uppercase tracking-wider mb-1.5">AI Image Prompt</label>
            <textarea
              rows="2"
              value={formData.imagePrompt}
              onChange={(e) => setFormData({ ...formData, imagePrompt: e.target.value })}
              class="w-full p-2.5 bg-slate-900 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-brand-500 italic"
            />
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
              class="px-5 py-2 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold flex items-center gap-2"
            >
              {saving ? <Loader2 class="w-4 h-4 animate-spin" /> : <Save class="w-4 h-4" />}
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditQuoteModal;
