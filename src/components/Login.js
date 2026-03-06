import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError('');
    
    // Check credentials and login directly without 2FA
    if (username === 'admin' && password === 'admin') {
      setIsAuthenticated(true);
      navigate('/admin/dashboard');
    } else {
      setError('Invalid username or password. Use "admin" for both username and password.');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 auth-bg">
        <div className="w-full max-w-md z-10">
          <div className="flex justify-center mb-8">
                        <img 
              src="/redstone-logo.png" 
              alt="RedStone Logo" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'flex';
              }}
            />
            <div 
              className="w-12 h-12 bg-red-500 rounded-lg shadow-lg flex items-center justify-center text-white font-bold text-xl" 
              style={{ display: 'none' }}
            >
              RS
            </div>
          </div>
                    <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">RedStone Control</h1>
          <p className="text-gray-600 text-center mb-8">Secure Admin Portal</p>
          
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-md">
                {error}
              </div>
            )}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="text-gray-400 w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  id="username" 
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3" 
                  placeholder="admin"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="text-gray-400 w-5 h-5" />
                </div>
                <input 
                  type="password" 
                  id="password" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="focus:ring-red-500 focus:border-red-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-3" 
                  placeholder="admin"
                  required
                />
              </div>
            </div>
            
            <div>
              <button 
                type="submit" 
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              >
                Sign In
              </button>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Default credentials: <span className="font-mono bg-gray-100 px-2 py-1 rounded">admin / admin</span>
              </p>
            </div>
          </form>
        </div>
      </div>
      
      {/* Right Panel */}
      <div className="hidden md:block w-1/2 relative bg-red-50">
        <div className="absolute inset-0 flex items-center justify-center p-12 z-10">
          <div className="text-center">
            <h2 className="text-4xl font-bold text-red-600 mb-4">Financial Oversight</h2>
            <p className="text-lg text-gray-700">Redefined with precision control</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;