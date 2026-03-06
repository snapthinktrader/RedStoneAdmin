import React from 'react';
import { useLocation } from 'react-router-dom';
import { Bell, User } from 'lucide-react';

const Header = () => {
  const location = useLocation();

  const getPageTitle = () => {
    switch (location.pathname) {
      case '/dashboard':
        return { title: 'Dashboard Overview', subtitle: '' };
      case '/users':
        return { title: 'User Management', subtitle: 'View and manage all registered users' };
      case '/withdrawals':
        return { title: 'Withdrawal Management', subtitle: 'Review and process pending withdrawal requests' };
      default:
        return { title: 'Admin Panel', subtitle: '' };
    }
  };

  const { title, subtitle } = getPageTitle();

  return (
    <header className="bg-white shadow-sm p-4 flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
        {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
      </div>
      <div className="flex items-center space-x-4">
        <div className="relative">
          <Bell className="text-gray-500 hover:text-red-500 cursor-pointer w-6 h-6" />
          <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full"></span>
        </div>
        <div className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-full bg-red-100 flex items-center justify-center">
            <User className="text-red-500 w-4 h-4" />
          </div>
          <span className="text-sm font-medium">Admin</span>
        </div>
      </div>
    </header>
  );
};

export default Header;