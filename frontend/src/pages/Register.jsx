import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Bot, User, Mail, Lock, UserPlus, AlertCircle, Loader2 } from 'lucide-react';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    if (!name || !email || !password) {
      setFormError('Please fill in all required fields');
      return;
    }
    if (password.length < 6) {
      setFormError('Password must be at least 6 characters long');
      return;
    }

    setSubmitting(true);
    const result = await register(name, email, password);
    setSubmitting(false);

    if (result.success) {
      navigate('/');
    } else {
      setFormError(result.error);
    }
  };

  return (
    <div class="min-h-screen bg-slate-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Glow background accents */}
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-brand-600/15 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-indigo-600/15 rounded-full blur-3xl pointer-events-none"></div>

      <div class="w-full max-w-md glass-panel p-8 rounded-3xl border border-slate-800 shadow-2xl relative z-10">
        {/* Header */}
        <div class="text-center mb-8">
          <div class="inline-flex p-3 bg-gradient-to-tr from-brand-600 to-indigo-600 rounded-2xl shadow-xl shadow-brand-500/20 mb-4">
            <Bot class="w-8 h-8 text-white" />
          </div>
          <h1 class="text-2xl font-bold text-white tracking-tight">Create Account</h1>
          <p class="text-xs text-slate-400 mt-1">Get started with AI Quote Auto Scheduler</p>
        </div>

        {/* Error Alert */}
        {formError && (
          <div class="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-3 text-rose-400 text-sm">
            <AlertCircle class="w-5 h-5 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} class="space-y-4">
          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Full Name
            </label>
            <div class="relative">
              <User class="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                class="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div class="relative">
              <Mail class="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                class="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label class="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <div class="relative">
              <Lock class="w-5 h-5 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 6 characters"
                class="w-full pl-11 pr-4 py-3 bg-slate-900/90 border border-slate-800 rounded-xl text-white placeholder:text-slate-600 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500 text-sm transition-all"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            class="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-bold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-50 mt-2"
          >
            {submitting ? (
              <>
                <Loader2 class="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <UserPlus class="w-4 h-4" />
                Register Account
              </>
            )}
          </button>
        </form>

        {/* Footer Link */}
        <div class="mt-8 text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link to="/login" class="text-brand-400 font-semibold hover:underline">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
