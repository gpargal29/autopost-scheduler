import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './layouts/MainLayout';
import Dashboard from './pages/Dashboard';
import QuoteGenerator from './pages/QuoteGenerator';
import QuoteLibrary from './pages/QuoteLibrary';
import SmartScheduler from './pages/SmartScheduler';
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
              <Route path="accounts" element={<Dashboard />} />
              <Route path="history" element={<Dashboard />} />
              <Route path="analytics" element={<Dashboard />} />
              <Route path="settings" element={<Dashboard />} />
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
