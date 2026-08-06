import React from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, Sparkles, Library, CalendarClock, Share2, History, BarChart3, Settings, Bot, LogOut, User as UserIcon } from 'lucide-react';

const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navigation = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'AI Quote Generator', path: '/generator', icon: Sparkles },
    { name: 'Quote Library', path: '/library', icon: Library },
    { name: 'Smart Scheduler', path: '/scheduler', icon: CalendarClock },
    { name: 'Social Accounts', path: '/accounts', icon: Share2 },
    { name: 'Posting History', path: '/history', icon: History },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <div class="min-h-screen flex bg-slate-950 text-slate-100">
      {/* Sidebar */}
      <aside class="w-64 glass-panel border-r border-slate-800 flex flex-col justify-between hidden md:flex sticky top-0 h-screen">
        <div>
          {/* Logo */}
          <div class="p-6 border-b border-slate-800/60 flex items-center gap-3">
            <div class="p-2 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-xl shadow-lg shadow-brand-500/20">
              <Bot class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="font-bold text-lg leading-tight text-white tracking-wide">AutoPost AI</h1>
              <p class="text-xs text-slate-400 font-medium">Quote Auto Scheduler</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav class="p-4 space-y-1.5">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  class={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white shadow-lg shadow-brand-500/25'
                      : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80'
                  }`}
                >
                  <Icon class={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* User profile & Logout */}
        <div class="p-4 border-t border-slate-800/60 flex items-center justify-between gap-2">
          <div class="flex items-center gap-3 min-w-0">
            <div class="w-9 h-9 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-brand-400 shrink-0 font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon class="w-4 h-4" />}
            </div>
            <div class="min-w-0">
              <p class="text-xs font-bold text-slate-200 truncate">{user?.name || 'User'}</p>
              <p class="text-[10px] text-slate-400 truncate">{user?.email || 'user@example.com'}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            title="Log Out"
            class="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
          >
            <LogOut class="w-4 h-4" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Navbar */}
        <header class="glass-panel border-b border-slate-800/60 px-6 py-4 flex items-center justify-between sticky top-0 z-30">
          <div class="flex items-center gap-3">
            <h2 class="text-xl font-bold text-white tracking-tight">
              {navigation.find((item) => item.path === location.pathname)?.name || 'Dashboard'}
            </h2>
          </div>
          <div class="flex items-center gap-4">
            <span class="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Connected ({user?.email})
            </span>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <main class="p-6 flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
