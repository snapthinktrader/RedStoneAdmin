import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, DollarSign, CreditCard, Settings, LogOut, ChevronLeft, ChevronRight, Shield } from 'lucide-react';

const Sidebar = ({ collapsed, setCollapsed }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/admin/dashboard', icon: Home, label: 'Dashboard' },
    { path: '/admin/users', icon: Users, label: 'User Management' },
    { path: '/admin/transactions', icon: DollarSign, label: 'Transactions' },
    { path: '/admin/withdrawals', icon: CreditCard, label: 'Withdrawals' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
    { path: '/admin/admin-settings', icon: Shield, label: 'Admin Settings' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <div className={`sidebar bg-white shadow-md flex flex-col z-10 ${collapsed ? 'w-20' : 'w-64'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center space-x-2">
          <img 
            src="/redstone-logo.png" 
            alt="RedStone Logo" 
            className="w-8 h-8 object-contain"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'block';
            }}
          />
          <div 
            className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm" 
            style={{ display: 'none' }}
          >
            RS
          </div>
          {!collapsed && (
            <span className="logo-text text-xl font-bold text-red-600">RedStone</span>
          )}
        </div>
        <button 
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-500 hover:text-gray-700"
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                isActive(item.path)
                  ? 'bg-red-50 text-red-600'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive(item.path) ? 'text-red-500' : ''}`} />
              {!collapsed && (
                <span className={`sidebar-text ${isActive(item.path) ? 'font-medium' : ''}`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t">
        <div className="flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 cursor-pointer">
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="sidebar-text">Logout</span>}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;