import React from 'react';
import { Sparkles, CalendarClock, Library, TrendingUp } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  return (
    <div class="space-y-6">
      {/* Welcome Banner */}
      <div class="glass-panel p-8 rounded-2xl border border-brand-500/20 relative overflow-hidden bg-gradient-to-r from-slate-900 via-slate-900/90 to-brand-950/40">
        <div class="relative z-10 max-w-2xl">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-500/10 text-brand-400 border border-brand-500/20 mb-4">
            <Sparkles class="w-3.5 h-3.5" />
            AI-Powered Scheduler Setup
          </div>
          <h1 class="text-3xl font-extrabold text-white tracking-tight mb-3">
            Welcome to AutoPost AI
          </h1>
          <p class="text-slate-400 text-sm leading-relaxed mb-6">
            Project initialized and scaffolded with clean MERN stack architecture. Ready to generate, schedule, and automate engaging content.
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

      {/* Quick Setup Status */}
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div class="glass-panel p-6 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Backend Status</span>
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
          <p class="text-2xl font-extrabold text-white">Express & Node</p>
          <p class="text-xs text-slate-400 mt-1">Configured on port 5000 with CORS & Error Middleware</p>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Frontend Status</span>
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
          <p class="text-2xl font-extrabold text-white">Vite & React</p>
          <p class="text-xs text-slate-400 mt-1">Tailwind CSS, React Router & Axios Client initialized</p>
        </div>

        <div class="glass-panel p-6 rounded-2xl border border-slate-800">
          <div class="flex items-center justify-between mb-4">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-400">Project Scaffolding</span>
            <div class="w-2.5 h-2.5 rounded-full bg-emerald-500"></div>
          </div>
          <p class="text-2xl font-extrabold text-white">Complete</p>
          <p class="text-xs text-slate-400 mt-1">Folders: config, controllers, routes, models, services, etc.</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
