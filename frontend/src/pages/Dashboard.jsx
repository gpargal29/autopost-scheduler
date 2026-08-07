import React, { useState, useEffect } from 'react';
import { Sparkles, CalendarClock, Library, TrendingUp, Clock, History, AlertCircle, Loader2, PieChart, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import API from '../services/api';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await API.get('/analytics/dashboard');
        if (res.data.success) {
          setData(res.data);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div class="space-y-6">
      {/* Welcome Banner */}
      <div class="glass-panel p-8 rounded-2xl border border-brand-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40">
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-4">
            <Sparkles class="w-3.5 h-3.5" />
            AI-Powered Scheduler
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight mb-3">
            Welcome to AutoPost AI
          </h1>
          <p class="text-slate-400 text-sm leading-relaxed mb-6">
            Generate, schedule, and automate engaging content for your social media platforms.
          </p>
          <div class="flex flex-wrap gap-4">
            <Link
              to="/generator"
              class="px-5 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/20 flex items-center gap-2 transition-all"
            >
              <Sparkles class="w-4 h-4" />
              Generate Quote
            </Link>
            <Link
              to="/library"
              class="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 flex items-center gap-2 transition-all"
            >
              <Library class="w-4 h-4" />
              View Library
            </Link>
          </div>
        </div>
      </div>

      {!loading && !error && (
        <>
          {/* Metrics Cards */}
          <div class="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between text-slate-400 text-xs font-semibold uppercase">
                <span>Total Generated Quotes</span>
                <Sparkles class="w-4 h-4 text-brand-400" />
              </div>
              <p class="text-3xl font-black text-white">{data?.stats?.totalQuotes || 0}</p>
            </div>

            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between text-amber-400 text-xs font-semibold uppercase">
                <span>Pending Quotes</span>
                <Clock class="w-4 h-4" />
              </div>
              <p class="text-3xl font-black text-white">{data?.stats?.pendingCount || 0}</p>
            </div>

            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between text-blue-400 text-xs font-semibold uppercase">
                <span>Scheduled Queue</span>
                <CalendarClock class="w-4 h-4" />
              </div>
              <p class="text-3xl font-black text-white">{data?.stats?.scheduledCount || 0}</p>
            </div>

            <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-1">
              <div class="flex items-center justify-between text-emerald-400 text-xs font-semibold uppercase">
                <span>Published Posts</span>
                <CheckCircle2 class="w-4 h-4" />
              </div>
              <p class="text-3xl font-black text-white">{data?.stats?.postedCount || 0}</p>
            </div>
          </div>

          {/* Category Breakdown */}
          <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-6">
            <h3 class="text-base font-bold text-white flex items-center gap-2">
              <PieChart class="w-5 h-5 text-indigo-400" />
              Category Distribution
            </h3>

            {data?.categoryStats?.length === 0 ? (
              <p class="text-xs text-slate-400">No category statistics available yet.</p>
            ) : (
              <div class="space-y-4">
                {data?.categoryStats?.map((cat) => {
                  const percentage = Math.round((cat.count / (data?.stats?.totalQuotes || 1)) * 100);
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
        </>
      )}

      {loading ? (
        <div class="glass-panel p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3 min-h-[300px]">
          <Loader2 class="w-8 h-8 text-brand-500 animate-spin" />
          <span class="text-xs font-semibold">Loading your dashboard...</span>
        </div>
      ) : error ? (
        <div class="glass-panel p-8 rounded-2xl border border-rose-500/30 flex flex-col items-center justify-center text-center">
          <AlertCircle class="w-10 h-10 text-rose-500 mb-3" />
          <h3 class="text-base font-bold text-white mb-1">Oops, something went wrong!</h3>
          <p class="text-xs text-slate-400 mb-4">{error}</p>
          <button onClick={() => window.location.reload()} class="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-xs font-semibold text-white">Retry</button>
        </div>
      ) : (
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                <History class="w-5 h-5 text-brand-400" />
                Recent Activity
              </h2>
              <Link to="/history" class="text-xs text-brand-400 hover:text-brand-300 font-semibold">View All</Link>
            </div>
            
            {data?.recentActivity?.length === 0 ? (
              <div class="p-6 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                <p class="text-xs font-semibold text-slate-300">No recent activity</p>
                <p class="text-[11px] text-slate-400 mt-1">Generated or posted quotes will appear here.</p>
              </div>
            ) : (
              <div class="space-y-3">
                {data?.recentActivity?.map((activity) => (
                  <div key={activity._id} class="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-3">
                    <div class="p-2 bg-slate-800 rounded-lg shrink-0">
                      <Sparkles class="w-4 h-4 text-brand-400" />
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-2 mb-1">
                        <span class="text-[10px] font-bold text-brand-400 uppercase tracking-wider">{activity.category}</span>
                        <span class="text-[10px] text-slate-500">• {new Date(activity.updatedAt).toLocaleDateString()}</span>
                      </div>
                      <p class="text-xs font-semibold text-white truncate">"{activity.quote}"</p>
                      <p class="text-[11px] text-slate-400 mt-1">Status: <span class="text-slate-300">{activity.status}</span></p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Scheduled Posts */}
          <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
            <div class="flex items-center justify-between">
              <h2 class="text-base font-bold text-white flex items-center gap-2">
                <CalendarClock class="w-5 h-5 text-indigo-400" />
                Upcoming Posts
              </h2>
              <Link to="/scheduler" class="text-xs text-indigo-400 hover:text-indigo-300 font-semibold">Manage</Link>
            </div>

            {data?.upcomingScheduled?.length === 0 ? (
              <div class="p-6 bg-slate-900/60 rounded-xl border border-slate-800 text-center">
                <p class="text-xs font-semibold text-slate-300">No upcoming posts</p>
                <p class="text-[11px] text-slate-400 mt-1">Schedule quotes to see them here.</p>
              </div>
            ) : (
              <div class="space-y-3">
                {data?.upcomingScheduled?.map((post) => (
                  <div key={post._id} class="p-4 bg-slate-900/60 rounded-xl border border-slate-800 flex items-start gap-3">
                    <div class="p-2 bg-indigo-500/20 rounded-lg shrink-0 border border-indigo-500/20">
                      <Clock class="w-4 h-4 text-indigo-400" />
                    </div>
                    <div class="min-w-0 flex-1">
                      <div class="flex items-center justify-between mb-1">
                        <span class="text-[10px] font-bold text-indigo-400 uppercase tracking-wider">{post.category}</span>
                        <span class="text-[10px] font-semibold text-white bg-slate-800 px-2 py-0.5 rounded">
                          {new Date(post.scheduledAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                      <p class="text-xs font-semibold text-white truncate">"{post.quote}"</p>
                      <p class="text-[11px] text-slate-400 mt-1">
                        Platforms: <span class="text-slate-300">{post.platforms?.join(', ') || 'LinkedIn, Instagram'}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
