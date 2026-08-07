import React from 'react';
import { Settings as SettingsIcon, CheckCircle2, ShieldCheck, Database, Key, Server, Cpu } from 'lucide-react';

const Settings = () => {
  return (
    <div class="space-y-8 max-w-4xl mx-auto pb-12">
      {/* Header */}
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <SettingsIcon class="w-6 h-6 text-brand-400" />
            System Settings & Integration Status
          </h1>
          <p class="text-xs text-slate-400 mt-1">System configuration overview and environment connection state.</p>
        </div>
      </div>

      <div class="space-y-6">
        {/* Environment Integrations Card */}
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4">
          <h3 class="text-sm font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
            <Key class="w-4 h-4 text-brand-400" />
            Active Environment Configuration
          </h3>

          <div class="space-y-3 text-xs">
            <div class="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Database class="w-5 h-5 text-emerald-400" />
                <div>
                  <div class="font-bold text-white">MongoDB Atlas Connection</div>
                  <div class="text-slate-400 text-[11px]">Database cluster connected for persistent storage</div>
                </div>
              </div>
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 class="w-3.5 h-3.5" /> Active
              </span>
            </div>

            <div class="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Cpu class="w-5 h-5 text-brand-400" />
                <div>
                  <div class="font-bold text-white">Groq / OpenAI AI Integration</div>
                  <div class="text-slate-400 text-[11px]">Structured content generation engine configured</div>
                </div>
              </div>
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 class="w-3.5 h-3.5" /> Active
              </span>
            </div>

            <div class="p-4 bg-slate-900/80 rounded-xl border border-slate-800 flex items-center justify-between">
              <div class="flex items-center gap-3">
                <Server class="w-5 h-5 text-indigo-400" />
                <div>
                  <div class="font-bold text-white">Node Cron Background Daemon</div>
                  <div class="text-slate-400 text-[11px]">Automated post publisher running every minute (* * * * *)</div>
                </div>
              </div>
              <span class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <CheckCircle2 class="w-3.5 h-3.5" /> Active
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
