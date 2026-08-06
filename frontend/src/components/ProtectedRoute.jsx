import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2 } from 'lucide-react';

const ProtectedRoute = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div class="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-3">
        <Loader2 class="w-8 h-8 text-brand-500 animate-spin" />
        <span class="text-sm font-medium">Authenticating session...</span>
      </div>
    );
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
