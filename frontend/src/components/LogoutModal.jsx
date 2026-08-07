import React, { useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LogoutModal = ({ isOpen, onClose }) => {
  const { logout } = useAuth();

  // Close modal on escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        class="absolute inset-0 bg-slate-950/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>
      
      <div class="relative glass-panel bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-sm w-full shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div class="flex flex-col items-center text-center space-y-4">
          <div class="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-500 mb-2">
            <LogOut class="w-8 h-8" />
          </div>
          
          <h2 class="text-2xl font-extrabold text-white">Sign Out?</h2>
          <p class="text-sm font-medium text-slate-400">
            Are you sure you want to sign out of your AutoPost AI account?
          </p>
          
          <div class="flex gap-3 w-full pt-4">
            <button
              onClick={onClose}
              class="flex-1 py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-600"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                onClose();
                logout();
              }}
              class="flex-1 py-3 px-4 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-colors shadow-lg shadow-rose-500/20 focus:outline-none focus:ring-2 focus:ring-rose-500"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogoutModal;
