import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import QuoteGenerator from './pages/QuoteGenerator';
import QuoteLibrary from './pages/QuoteLibrary';
import SmartScheduler from './pages/SmartScheduler';
import SocialAccounts from './pages/SocialAccounts';
import PostingHistory from './pages/PostingHistory';
import Settings from './pages/Settings';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Authentication Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/" element={<MainLayout />}>
              <Route index element={<Dashboard />} />
              <Route path="generator" element={<QuoteGenerator />} />
              <Route path="library" element={<QuoteLibrary />} />
              <Route path="scheduler" element={<SmartScheduler />} />
              <Route path="accounts" element={<SocialAccounts />} />
              <Route path="history" element={<PostingHistory />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Route>

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
