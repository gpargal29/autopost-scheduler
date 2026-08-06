import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { BarChart3, TrendingUp, Sparkles, PieChart, Layers, CheckCircle2, Clock, CalendarClock, Loader2 } from 'lucide-react';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await API.get('/analytics/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to fetch analytics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div class="glass-panel p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3 min-h-[400px]">
        <Loader2 class="w-8 h-8 text-brand-500 animate-spin" />
        <span class="text-xs font-semibold">Aggregating system analytics...</span>
      </div>
    );
  }

  const { stats, categoryStats } = data || {};

  return (
    <div class="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <BarChart3 class="w-6 h-6 text-brand-400" />
            Dashboard Analytics
          </h1>
          <p class="text-xs text-slate-400 mt-1">Real-time stats, category distribution, and automation metrics.</p>
        </div>
      </div>

      {/* Metrics Cards */}
      <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
          <div class="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
            <span>Total Generated Quotes</span>
            <Sparkles class="w-4 h-4 text-brand-400" />
          </div>
          <p class="text-3xl font-black text-white">{stats?.totalQuotes || 0}</p>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
          <div class="flex items-center justify-between text-amber-400 text-xs font-semibold uppercase">
            <span>Pending Quotes</span>
            <Clock class="w-4 h-4" />
          </div>
          <p class="text-3xl font-black text-white">{stats?.pendingCount || 0}</p>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
          <div class="flex items-center justify-between text-blue-400 text-xs font-semibold uppercase">
            <span>Scheduled Queue</span>
            <CalendarClock class="w-4 h-4" />
          </div>
          <p class="text-3xl font-black text-white">{stats?.scheduledCount || 0}</p>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
          <div class="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase">
            <span>Published Posts</span>
            <CheckCircle2 class="w-4 h-4" />
          </div>
          <p class="text-3xl font-black text-white">{stats?.postedCount || 0}</p>
        </div>
      </div>

      {/* Category Breakdown */}
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
        <h3 class="text-base font-bold text-white flex items-center gap-2">
          <PieChart class="w-5 h-5 text-indigo-400" />
          Category Distribution
        </h3>

        {categoryStats?.length === 0 ? (
          <p class="text-xs text-slate-400">No category statistics available yet.</p>
        ) : (
          <div class="space-y-4">
            {categoryStats?.map((cat) => {
              const percentage = Math.round((cat.count / (stats?.totalQuotes || 1)) * 100);
              return (
                <div key={cat._id} class="space-y-1.5">
                  <div class="flex items-center justify-between text-xs font-semibold">
                    <span class="text-white">{cat._id}</span>
                    <span class="text-slate-400">{cat.count} quotes ({percentage}%)</span>
                  </div>
                  <div class="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
                    <div
                      class="bg-gradient-to-r from-brand-600 to-indigo-600 h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Analytics;
