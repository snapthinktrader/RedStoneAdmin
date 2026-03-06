import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Homepage from './components/Homepage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import UserManagement from './components/UserManagement';
import WithdrawalManagement from './components/WithdrawalManagement';
import Transactions from './components/Transactions';
import Settings from './components/Settings';
import AppVersionManagement from './components/AppVersionManagement';
// import AdminSettings from './components/AdminSettings'; // Temporarily disabled due to UI library dependency
import Layout from './components/Layout';

// Temporary placeholder for AdminSettings
const AdminSettings = () => (
  <div className="p-6">
    <h1 className="text-2xl font-bold mb-4">Admin Settings</h1>
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <p className="text-blue-800">Admin settings page is being updated. Please check back soon.</p>
    </div>
  </div>
);

function App() {
  const [isAuthenticated, setIsAuthenticated] = React.useState(() => {
    // Check if user has a valid token on mount
    return !!localStorage.getItem('admin_token');
  });

  // Listen for storage changes (logout in other tabs)
  React.useEffect(() => {
    const handleStorageChange = () => {
      const hasToken = !!localStorage.getItem('admin_token');
      setIsAuthenticated(hasToken);
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Homepage />} />
          <Route 
            path="/login" 
            element={
              isAuthenticated ? 
              <Navigate to="/admin/dashboard" replace /> : 
              <Login setIsAuthenticated={setIsAuthenticated} />
            } 
          />
          
          {/* Admin Routes */}
          <Route 
            path="/admin" 
            element={
              isAuthenticated ? 
              <Layout onLogout={handleLogout} /> : 
              <Navigate to="/login" replace />
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="withdrawals" element={<WithdrawalManagement />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="settings" element={<Settings />} />
            <Route path="app-versions" element={<AppVersionManagement />} />
            <Route path="admin-settings" element={<AdminSettings />} />
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;