import React, { useState } from 'react';
import { generateQuoteAI, createQuote, updateQuote } from '../services/quoteService';
import ScheduleModal from '../components/ScheduleModal';
import {
  Sparkles,
  Flame,
  Trophy,
  Users,
  Briefcase,
  Zap,
  Dumbbell,
  Target,
  Smile,
  Rocket,
  Brain,
  Sun,
  BookOpen,
  Copy,
  Check,
  Clock,
  MessageSquare,
  Image as ImageIcon,
  Send,
  Loader2,
  AlertCircle,
  Bookmark,
  Calendar,
  RefreshCw,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CATEGORIES = [
  { name: 'Motivation', icon: Flame, color: 'from-amber-500 to-orange-600' },
  { name: 'Success', icon: Trophy, color: 'from-yellow-500 to-amber-600' },
  { name: 'Leadership', icon: Users, color: 'from-blue-500 to-indigo-600' },
  { name: 'Business', icon: Briefcase, color: 'from-emerald-500 to-teal-600' },
  { name: 'Productivity', icon: Zap, color: 'from-purple-500 to-indigo-600' },
  { name: 'Fitness', icon: Dumbbell, color: 'from-rose-500 to-pink-600' },
  { name: 'Self Improvement', icon: Target, color: 'from-cyan-500 to-blue-600' },
  { name: 'Positivity', icon: Sun, color: 'from-yellow-400 to-orange-500' },
  { name: 'Entrepreneurship', icon: Rocket, color: 'from-brand-500 to-indigo-600' },
  { name: 'Mindfulness', icon: Brain, color: 'from-teal-400 to-emerald-600' },
  { name: 'Happiness', icon: Smile, color: 'from-pink-400 to-rose-500' },
  { name: 'Wisdom', icon: BookOpen, color: 'from-violet-500 to-purple-700' },
];

const TONES = ['Inspirational', 'Professional', 'Energetic', 'Thoughtful', 'Direct & Bold'];

const QuoteGenerator = () => {
  const [selectedCategory, setSelectedCategory] = useState('Motivation');
  const [customTopic, setCustomTopic] = useState('');
  const [selectedTone, setSelectedTone] = useState('Inspirational');
  const [targetAudience, setTargetAudience] = useState('Entrepreneurs & Professionals');
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionFeedback, setActionFeedback] = useState('');
  const [generatedQuote, setGeneratedQuote] = useState(null);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [copiedCaption, setCopiedCaption] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError('');
    setActionFeedback('');
    setLoading(true);
    setGeneratedQuote(null);

    try {
      const data = await generateQuoteAI({
        category: selectedCategory,
        customTopic,
        tone: selectedTone,
        targetAudience,
      });

      if (data.success) {
        setGeneratedQuote(data.quote);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to generate quote. Check API configuration.');
    } finally {
      setLoading(false);
    }
  };

  // Action 1: Save to Library (Pending)
  const handleSaveToLibrary = async () => {
    if (!generatedQuote || actionLoading) return;

    if (generatedQuote._id) {
      setActionFeedback('Quote is already saved in your Library.');
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      const res = await createQuote({
        ...generatedQuote,
        status: 'Pending',
      });

      if (res.success) {
        setGeneratedQuote(res.quote);
        setActionFeedback('Quote saved to Library successfully!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save quote to Library');
    } finally {
      setActionLoading(false);
    }
  };

  // Action 2: Schedule Post (Open ScheduleModal)
  const handleSchedulePost = () => {
    if (!generatedQuote) return;
    setIsScheduleModalOpen(true);
  };

  // Action 3: Publish Now (Simulated flow)
  const handlePublishNow = async () => {
    if (!generatedQuote || actionLoading) return;
    if (generatedQuote.status === 'Posted') {
      setActionFeedback('Quote has already been published.');
      return;
    }

    setActionLoading(true);
    setError('');
    try {
      let res;
      if (generatedQuote._id) {
        res = await updateQuote(generatedQuote._id, {
          status: 'Posted',
          postedAt: new Date(),
          platforms: ['LinkedIn', 'Instagram'],
        });
      } else {
        res = await createQuote({
          ...generatedQuote,
          status: 'Posted',
          postedAt: new Date(),
          platforms: ['LinkedIn', 'Instagram'],
        });
      }

      if (res.success) {
        setGeneratedQuote(res.quote);
        setActionFeedback('Quote published successfully (Simulated flow)!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to publish quote');
    } finally {
      setActionLoading(false);
    }
  };

  // Action 4: Generate Another (Discard current temporary result)
  const handleGenerateAnother = () => {
    setGeneratedQuote(null);
    setActionFeedback('');
    setError('');
  };

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'caption') {
      setCopiedCaption(true);
      setTimeout(() => setCopiedCaption(false), 2000);
    } else if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    }
  };

  return (
    <div class="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-slate-800">
        <div>
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-2">
            <Sparkles class="w-3.5 h-3.5" />
            OpenAI Engine Powered
          </div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight">AI Quote Generator</h1>
          <p class="text-xs text-slate-400 mt-1">Select a category and parameters to generate high-engagement social media quotes & captions.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Generator Controls Form */}
        <div class="lg:col-span-5 space-y-6">
          <form onSubmit={handleGenerate} class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            {/* Category Selector */}
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-3">
                1. Select Category ({CATEGORIES.length})
              </label>
              <div class="grid grid-cols-2 gap-2.5 max-h-60 overflow-y-auto pr-1">
                {CATEGORIES.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => setSelectedCategory(cat.name)}
                      class={`flex items-center gap-2.5 p-3 rounded-xl border text-xs font-semibold transition-all text-left ${
                        isSelected
                          ? 'bg-slate-800 border-brand-500 text-white shadow-md shadow-brand-500/10'
                          : 'bg-slate-900/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div class={`p-1.5 rounded-lg bg-gradient-to-tr ${cat.color} text-white shrink-0`}>
                        <Icon class="w-3.5 h-3.5" />
                      </div>
                      <span class="truncate">{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Target Audience */}
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                2. Target Audience
              </label>
              <input
                type="text"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                placeholder="e.g. Founders, Creatives, Students"
                class="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 text-xs"
              />
            </div>

            

            {/* Tone Selector */}
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                3. Content Tone
              </label>
              <div class="flex flex-wrap gap-2">
                {TONES.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setSelectedTone(t)}
                    class={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      selectedTone === t
                        ? 'bg-brand-600/20 border-brand-500 text-brand-300'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Topic */}
            <div>
              <label class="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2">
                4. Specific Keyword (Optional)
              </label>
              <input
                type="text"
                value={customTopic}
                onChange={(e) => setCustomTopic(e.target.value)}
                placeholder="e.g. Overcoming burnout, Morning routines"
                class="w-full px-4 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 text-xs"
              />
            </div>            

            {/* Error Message */}
            {error && (
              <div class="p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle class="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              class="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 class="w-4 h-4 animate-spin" />
                  Generating Quote with OpenAI...
                </>
              ) : (
                <>
                  <Sparkles class="w-4 h-4" />
                  Generate Quote & Metadata
                </>
              )}
            </button>
          </form>
        </div>

        {/* AI Output Preview Section */}
        <div class="lg:col-span-7">
          {generatedQuote ? (
            <div class="glass-panel p-6 rounded-2xl border border-brand-500/30 space-y-6 bg-slate-900/80">
              {/* Category & Status */}
              <div class="flex items-center justify-between border-b border-slate-800 pb-4">
                <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20">
                  <Sparkles class="w-3.5 h-3.5" />
                  Category: {generatedQuote.category}
                </span>
                {!generatedQuote._id && (
                  <span class="text-xs text-amber-400 font-semibold bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
                    Unsaved Draft
                  </span>
                )}
                {generatedQuote._id && generatedQuote.status === 'Pending' && (
                  <span class="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                    Saved in Library
                  </span>
                )}
                {generatedQuote._id && generatedQuote.status === 'Scheduled' && (
                  <span class="text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-full border border-indigo-500/20">
                    Scheduled
                  </span>
                )}
                {generatedQuote._id && generatedQuote.status === 'Posted' && (
                  <span class="text-xs text-teal-400 font-semibold bg-teal-500/10 px-2.5 py-1 rounded-full border border-teal-500/20">
                    Published
                  </span>
                )}
              </div>

              {/* Quote Card */}
              <div class="p-6 rounded-xl bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 relative overflow-hidden">
                <div class="text-4xl text-brand-500/20 font-serif absolute -top-2 left-2 pointer-events-none">“</div>
                <blockquote class="text-lg md:text-xl font-bold text-white leading-relaxed italic relative z-10">
                  "{generatedQuote.quote}"
                </blockquote>
                <p class="mt-3 text-xs font-semibold text-brand-400 text-right">— {generatedQuote.author}</p>
              </div>

              {/* Explanation */}
              <div>
                <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
                  <Brain class="w-3.5 h-3.5 text-indigo-400" />
                  Explanation & Concept
                </h4>
                <p class="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  {generatedQuote.explanation}
                </p>
              </div>

              {/* Caption */}
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <MessageSquare class="w-3.5 h-3.5 text-brand-400" />
                    Generated Social Caption
                  </h4>
                  <button
                    onClick={() => copyToClipboard(`${generatedQuote.caption}\n\n${generatedQuote.hashtags.join(' ')}`, 'caption')}
                    class="text-xs text-brand-400 hover:text-brand-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedCaption ? <Check class="w-3.5 h-3.5 text-emerald-400" /> : <Copy class="w-3.5 h-3.5" />}
                    {copiedCaption ? 'Copied!' : 'Copy Caption & Tags'}
                  </button>
                </div>
                <p class="text-xs text-slate-200 whitespace-pre-line bg-slate-950/60 p-3 rounded-xl border border-slate-800/60">
                  {generatedQuote.caption}
                </p>
              </div>

              {/* Emojis & Hashtags */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Emoji Suggestions</h4>
                  <div class="flex gap-2">
                    {generatedQuote.emojiSuggestions?.map((emoji, idx) => (
                      <span key={idx} class="p-2 bg-slate-950 rounded-lg text-lg border border-slate-800">{emoji}</span>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">Hashtags</h4>
                  <div class="flex flex-wrap gap-1.5">
                    {generatedQuote.hashtags?.map((tag, idx) => (
                      <span key={idx} class="px-2.5 py-1 bg-brand-500/10 text-brand-300 text-[11px] font-semibold rounded-md border border-brand-500/20">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* AI Image Prompt */}
              <div>
                <div class="flex items-center justify-between mb-1.5">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <ImageIcon class="w-3.5 h-3.5 text-purple-400" />
                    AI Image Generation Prompt
                  </h4>
                  <button
                    onClick={() => copyToClipboard(generatedQuote.imagePrompt, 'prompt')}
                    class="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1 font-semibold"
                  >
                    {copiedPrompt ? <Check class="w-3.5 h-3.5 text-emerald-400" /> : <Copy class="w-3.5 h-3.5" />}
                    {copiedPrompt ? 'Copied!' : 'Copy Prompt'}
                  </button>
                </div>
                <p class="text-xs text-slate-300 bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 italic">
                  "{generatedQuote.imagePrompt}"
                </p>
              </div>

              {/* Suggested Posting Time & Engagement Tips */}
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    <Clock class="w-3.5 h-3.5 text-amber-400" />
                    Recommended Time
                  </h4>
                  <p class="text-xs font-medium text-amber-300">{generatedQuote.suggestedPostingTime}</p>
                </div>

                <div class="p-3 bg-slate-950/60 rounded-xl border border-slate-800/60">
                  <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center gap-1.5">
                    <Send class="w-3.5 h-3.5 text-emerald-400" />
                    Engagement Booster
                  </h4>
                  <ul class="text-xs text-slate-300 list-disc list-inside space-y-1">
                    {generatedQuote.engagementSuggestions?.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Action Feedback & 4 Post-Generation Action Buttons */}
              <div class="space-y-3 pt-2">
                {actionFeedback && (
                  <div class="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
                    <Check class="w-4 h-4 shrink-0" />
                    <span>{actionFeedback}</span>
                  </div>
                )}

                <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {/* 1. Save to Library */}
                  <button
                    type="button"
                    onClick={handleSaveToLibrary}
                    disabled={actionLoading || !!generatedQuote._id}
                    class="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    {actionLoading ? <Loader2 class="w-3.5 h-3.5 animate-spin" /> : <Bookmark class="w-3.5 h-3.5 text-brand-400" />}
                    {generatedQuote._id ? 'Saved in Library' : 'Save to Library'}
                  </button>

                  {/* 2. Schedule Post */}
                  <button
                    type="button"
                    onClick={handleSchedulePost}
                    disabled={actionLoading}
                    class="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <Calendar class="w-3.5 h-3.5 text-indigo-400" />
                    {generatedQuote.status === 'Scheduled' ? 'Reschedule Post' : 'Schedule Post'}
                  </button>

                  {/* 3. Publish Now */}
                  <button
                    type="button"
                    onClick={handlePublishNow}
                    disabled={actionLoading || generatedQuote.status === 'Posted'}
                    class="px-3 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-white text-xs font-semibold border border-slate-700 flex items-center justify-center gap-1.5 transition-all"
                  >
                    {actionLoading ? <Loader2 class="w-3.5 h-3.5 animate-spin" /> : <Send class="w-3.5 h-3.5 text-emerald-400" />}
                    {generatedQuote.status === 'Posted' ? 'Published' : 'Publish Now'}
                  </button>

                  {/* 4. Generate Another */}
                  <button
                    type="button"
                    onClick={handleGenerateAnother}
                    disabled={actionLoading}
                    class="px-3 py-2.5 rounded-xl bg-brand-600/20 hover:bg-brand-600/30 text-brand-300 text-xs font-semibold border border-brand-500/30 flex items-center justify-center gap-1.5 transition-all"
                  >
                    <RefreshCw class="w-3.5 h-3.5 text-brand-400" />
                    Generate Another
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div class="glass-panel p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center h-full min-h-[450px]">
              <div class="p-4 bg-slate-900 rounded-full border border-slate-800 mb-4 text-brand-400 animate-pulse">
                <Sparkles class="w-8 h-8" />
              </div>
              <h3 class="text-lg font-bold text-white mb-2">Ready to Generate AI Content</h3>
              <p class="text-xs text-slate-400 max-w-sm">
                Choose a category from the left, add optional custom topics or target audience details, and click "Generate Quote".
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Schedule Modal for Action 2 */}
      <ScheduleModal
        quote={generatedQuote}
        isOpen={isScheduleModalOpen}
        onClose={() => setIsScheduleModalOpen(false)}
        onScheduleSuccess={(savedQuote) => {
          setGeneratedQuote(savedQuote);
          setActionFeedback('Quote scheduled successfully!');
        }}
      />
    </div>
  );
};

export default QuoteGenerator;
