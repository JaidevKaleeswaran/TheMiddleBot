import { Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import AppShell from './components/layout/AppShell';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ClientProfile from './pages/clients/ClientProfile';
import ClientsList from './pages/lists/ClientsList';
import PropertiesList from './pages/lists/PropertiesList';
import BidsList from './pages/lists/BidsList';
import DeadlinesList from './pages/lists/DeadlinesList';

import ClientDashboard from './pages/clients/ClientDashboard';

const ProtectedRoute = ({ children }) => {
  // Temporary bypass
  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />

      {/* Agent Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="clients" element={<ClientsList />} />
        <Route path="clients/:clientId" element={<ClientProfile />} />
        <Route path="properties" element={<PropertiesList />} />
        <Route path="bids" element={<BidsList />} />
        <Route path="deadlines" element={<DeadlinesList />} />
      </Route>

      {/* Client Routes */}
      <Route
        path="/client"
        element={
          <ProtectedRoute>
            <AppShell isClient={true} />
          </ProtectedRoute>
        }
      >
        <Route path="dashboard" element={<ClientDashboard />} />
      </Route>
    </Routes>
  );
}

export default App;
