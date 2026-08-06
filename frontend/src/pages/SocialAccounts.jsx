import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Share2, Linkedin, Instagram, Facebook, CheckCircle2, XCircle, RefreshCw, ShieldCheck, Loader2 } from 'lucide-react';

const SocialAccounts = () => {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await API.get('/social-accounts');
      if (res.data.success) {
        setAccounts(res.data.accounts);
      }
    } catch (err) {
      console.error('Failed to load social accounts:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccounts();
  }, []);

  const handleToggle = async (id) => {
    setToggling(id);
    try {
      const res = await API.put(`/social-accounts/${id}/toggle`);
      if (res.data.success) {
        setAccounts(accounts.map((a) => (a._id === id ? res.data.account : a)));
      }
    } catch (err) {
      alert('Failed to toggle connection state');
    } finally {
      setToggling(null);
    }
  };

  const getPlatformIcon = (platform) => {
    switch (platform) {
      case 'LinkedIn':
        return <Linkedin class="w-6 h-6 text-blue-400" />;
      case 'Instagram':
        return <Instagram class="w-6 h-6 text-pink-400" />;
      case 'Facebook':
        return <Facebook class="w-6 h-6 text-blue-500" />;
      default:
        return <Share2 class="w-6 h-6 text-brand-400" />;
    }
  };

  return (
    <div class="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header */}
      <div class="glass-panel p-6 rounded-2xl border border-slate-800 flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight">Connected Social Accounts</h1>
          <p class="text-xs text-slate-400 mt-1">Manage publishing target connections for automated quote distribution.</p>
        </div>
        <div class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck class="w-4 h-4" />
          OAuth Architecture Ready
        </div>
      </div>

      {loading ? (
        <div class="glass-panel p-12 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-slate-400 gap-3">
          <Loader2 class="w-8 h-8 text-brand-500 animate-spin" />
          <span class="text-xs font-semibold">Loading connected social profiles...</span>
        </div>
      ) : (
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {accounts.map((acc) => (
            <div key={acc._id} class="glass-panel p-6 rounded-2xl border border-slate-800 space-y-4 flex flex-col justify-between">
              <div>
                <div class="flex items-center justify-between mb-4">
                  <div class="p-3 bg-slate-900 rounded-xl border border-slate-800">
                    {getPlatformIcon(acc.platform)}
                  </div>
                  {acc.isConnected ? (
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <CheckCircle2 class="w-3 h-3" /> Connected
                    </span>
                  ) : (
                    <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-800 text-slate-400 border border-slate-700">
                      <XCircle class="w-3 h-3" /> Disconnected
                    </span>
                  )}
                </div>

                <h3 class="text-base font-bold text-white">{acc.platform}</h3>
                <p class="text-xs font-semibold text-slate-300">{acc.accountName}</p>
                <p class="text-xs text-slate-400">{acc.accountHandle}</p>
              </div>

              <div class="pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span class="text-[10px] text-slate-400">
                  Last Sync: {new Date(acc.lastSync).toLocaleDateString()}
                </span>

                <button
                  onClick={() => handleToggle(acc._id)}
                  disabled={toggling === acc._id}
                  class={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                    acc.isConnected
                      ? 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border-rose-500/20'
                      : 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border-emerald-500/20'
                  }`}
                >
                  {toggling === acc._id ? (
                    <Loader2 class="w-3.5 h-3.5 animate-spin" />
                  ) : acc.isConnected ? (
                    'Disconnect'
                  ) : (
                    'Connect Account'
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SocialAccounts;
