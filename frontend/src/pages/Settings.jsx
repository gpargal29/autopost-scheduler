import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  CheckCircle2, 
  Loader2, 
  User,
  LogOut,
  Brain,
  Activity,
  AlertTriangle,
  Sliders
} from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useOutletContext } from 'react-router-dom';

const Toggle = ({ checked, onChange }) => (
  <button 
    onClick={() => onChange(!checked)}
    class={`w-10 h-5 rounded-full relative transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 focus:ring-offset-slate-900 ${checked ? 'bg-brand-500' : 'bg-slate-700'}`}
  >
    <span class={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`}></span>
  </button>
);

const Settings = () => {
  const { user } = useAuth();
  const { requestLogout } = useOutletContext();

  // Health States
  const [healthStatus, setHealthStatus] = useState('idle'); // idle, loading, success, error
  const [lastChecked, setLastChecked] = useState(null);

  // Preferences States (Local UI)
  const [autoSaveQuotes, setAutoSaveQuotes] = useState(true);
  const [notifyGenerated, setNotifyGenerated] = useState(true);
  const [notifyScheduled, setNotifyScheduled] = useState(true);
  const [notifyFailed, setNotifyFailed] = useState(true);

  const runHealthCheck = async () => {
    setHealthStatus('loading');
    const startTime = Date.now();

    try {
      await API.get('/health');
      const elapsed = Date.now() - startTime;
      if (elapsed < 3000) {
        await new Promise(resolve => setTimeout(resolve, 3000 - elapsed));
      }
      setHealthStatus('success');
      setLastChecked(new Date());
    } catch (err) {
      const elapsed = Date.now() - startTime;
      if (elapsed < 3000) {
        await new Promise(resolve => setTimeout(resolve, 3000 - elapsed));
      }
      setHealthStatus('error');
      setLastChecked(new Date());
    }
    
    // Automatically revert to idle state after an additional 4 seconds
    setTimeout(() => {
      setHealthStatus('idle');
    }, 4000);
  };

  return (
    <div class="space-y-6 max-w-5xl mx-auto pb-10">
      {/* Header */}
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight flex items-center gap-3">
            <SettingsIcon class="w-6 h-6 text-brand-400" />
            Settings
          </h1>
          <p class="text-xs text-slate-400 mt-1">Manage your account, preferences, and monitor application health.</p>
        </div>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* LEFT COLUMN: ACCOUNT PROFILE & AI ENGINE */}
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
          <div class="space-y-5">
            <div class="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <User class="w-4 h-4 text-brand-400" />
                Account
              </h3>
            </div>

            <div class="flex items-center gap-4">
              <div class="w-14 h-14 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-600 flex items-center justify-center text-xl font-bold text-white shadow-lg shadow-brand-500/20 border border-brand-500/30 shrink-0">
                {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div class="min-w-0 flex-1">
                <h2 class="text-lg font-bold text-white truncate">{user?.name || 'User'}</h2>
                <p class="text-xs text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
                {user?.createdAt && (
                  <p class="text-[11px] text-slate-500 mt-0.5 font-medium">
                    Member since {new Date(user.createdAt).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>

            {/* Compact Embedded AI Engine Section */}
            <div class="pt-4 border-t border-slate-800/60 space-y-2.5">
              <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Brain class="w-3.5 h-3.5 text-purple-400" />
                Current AI Engine
              </p>
              <div class="grid grid-cols-3 gap-2 bg-slate-900/60 p-3 rounded-xl border border-slate-800/60 text-xs">
                <div>
                  <span class="text-[10px] text-slate-500 font-medium block">Provider</span>
                  <span class="font-bold text-white">Groq</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-500 font-medium block">Active Model</span>
                  <span class="font-bold text-white truncate block">Llama 3</span>
                </div>
                <div>
                  <span class="text-[10px] text-slate-500 font-medium block">Status</span>
                  <span class="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 mt-0.5">
                    <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={requestLogout}
            class="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-rose-500/10 text-slate-300 hover:text-rose-400 font-bold text-xs border border-slate-800 hover:border-rose-500/30 flex items-center justify-center gap-2 transition-all duration-200 mt-4"
          >
            <LogOut class="w-4 h-4" />
            Sign Out
          </button>
        </div>

        {/* RIGHT COLUMN: PREFERENCES */}
        <div class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-5 flex flex-col justify-between">
          <div class="space-y-5">
            <div class="flex items-center justify-between border-b border-slate-800/60 pb-3">
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Sliders class="w-4 h-4 text-emerald-400" />
                Preferences
              </h3>
            </div>

            <div class="space-y-5">
              {/* Auto Save */}
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-xs font-bold text-white">Auto-Save Quotes</p>
                  <p class="text-[11px] font-medium text-slate-400 mt-0.5">Automatically add new AI quotes to library.</p>
                </div>
                <Toggle checked={autoSaveQuotes} onChange={setAutoSaveQuotes} />
              </div>

              <div class="pt-3 border-t border-slate-800/60">
                <p class="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-3">Notifications</p>
                
                <div class="space-y-3.5">
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-slate-300">Quote Generated</span>
                    <Toggle checked={notifyGenerated} onChange={setNotifyGenerated} />
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-slate-300">Quote Scheduled Successfully</span>
                    <Toggle checked={notifyScheduled} onChange={setNotifyScheduled} />
                  </div>
                  <div class="flex items-center justify-between">
                    <span class="text-xs font-medium text-slate-300">Quote Posting Failed</span>
                    <Toggle checked={notifyFailed} onChange={setNotifyFailed} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ROW 2: SYSTEM HEALTH (COMPACT FULL WIDTH) */}
        <div class="md:col-span-2 glass-panel p-6 rounded-2xl border border-slate-800 relative overflow-hidden">
          <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div class="flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center shrink-0">
                <Activity class="w-5 h-5 text-brand-400" />
              </div>
              <div>
                <h3 class="text-sm font-bold text-white">System Health</h3>
                <div class="text-xs text-slate-400 mt-0.5">
                  {healthStatus === 'idle' && (
                    <span>No recent health check performed.</span>
                  )}
                  {healthStatus === 'loading' && (
                    <span class="text-brand-400 flex items-center gap-2 font-semibold">
                      <Loader2 class="w-3.5 h-3.5 animate-spin" /> Running health check...
                    </span>
                  )}
                  {healthStatus === 'success' && (
                    <span class="text-emerald-400 font-semibold flex items-center gap-1.5">
                      <CheckCircle2 class="w-3.5 h-3.5" /> Application is operating normally.
                    </span>
                  )}
                  {healthStatus === 'error' && (
                    <span class="text-rose-400 font-semibold flex items-center gap-1.5">
                      <AlertTriangle class="w-3.5 h-3.5" /> Unable to verify application health.
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div class="flex items-center gap-4 shrink-0">
              {lastChecked && (
                <span class="text-[11px] text-slate-500 font-medium hidden sm:inline">
                  Last checked: {lastChecked.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}

              <button
                onClick={runHealthCheck}
                disabled={healthStatus === 'loading'}
                class="px-5 py-2 bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-400 text-white text-xs font-bold rounded-xl transition-all duration-200 shadow-md shadow-brand-500/20 disabled:shadow-none focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                {healthStatus === 'error' ? 'Retry Check' : 'Run Health Check'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
