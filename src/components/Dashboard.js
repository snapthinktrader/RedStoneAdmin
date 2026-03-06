import React, { useState, useEffect } from 'react';
import { Users, Activity, DollarSign, TrendingUp, Clock, BarChart2, UserPlus, AlertCircle, TrendingDown } from 'lucide-react';
import KPICard from './KPICard';
import RecentActivity from './RecentActivity';
import Charts from './Charts';
import ApiService from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    totalDeposits: 0,
    totalWithdrawals: 0,
    pendingTransactions: 0,
    totalRevenue: 0
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDashboardData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsData, transactionsData] = await Promise.all([
        ApiService.getDashboardStats(),
        ApiService.getAllTransactions()
      ]);
      
      setStats(statsData.data);
      setRecentTransactions(transactionsData.slice(0, 4)); // Get latest 4 transactions
      setError(null);
    } catch (err) {
      setError('Failed to fetch dashboard data');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-300 text-red-600 px-4 py-3 rounded-md flex items-center m-6">
        <AlertCircle className="w-5 h-5 mr-2" />
        {error}
        <button 
          onClick={fetchDashboardData}
          className="ml-4 text-sm underline hover:no-underline"
        >
          Retry
        </button>
      </div>
    );
  }

  const kpiData = [
    {
      title: 'Total Users',
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: '+5.2%',
      changeType: 'positive',
      period: 'from last month'
    },
    {
      title: 'Active Users',
      value: stats.activeUsers.toLocaleString(),
      icon: Activity,
      change: '+2.1%',
      changeType: 'positive',
      period: 'verified users'
    },
    {
      title: 'System Liability',
      value: formatCurrency(stats.totalDeposits - stats.totalWithdrawals),
      icon: DollarSign,
      change: '-1.3%',
      changeType: 'negative',
      period: 'net deposits'
    },
    {
      title: "Total Deposits",
      value: formatCurrency(stats.totalDeposits),
      icon: TrendingUp,
      change: '+8.7%',
      changeType: 'positive',
      period: 'all time'
    },
    {
      title: 'Pending Transactions',
      value: formatCurrency(stats.totalWithdrawals),
      icon: Clock,
      subtitle: `(${stats.pendingTransactions} requests)`,
      change: null,
      period: stats.pendingTransactions > 0 ? 'Needs attention' : 'All clear'
    },
    {
      title: 'Platform Revenue',
      value: formatCurrency(stats.totalRevenue),
      icon: BarChart2,
      change: '+12.8%',
      period: 'total earnings'
    }
  ];

  const recentActivities = [
    ...recentTransactions.map(tx => ({
      icon: tx.type === 'DEPOSIT' ? TrendingUp : tx.type === 'WITHDRAWAL' ? TrendingDown : DollarSign,
      iconColor: tx.type === 'DEPOSIT' ? 'bg-green-100 text-green-500' : 
                 tx.type === 'WITHDRAWAL' ? 'bg-red-100 text-red-500' : 'bg-blue-100 text-blue-500',
      title: `${tx.type.toLowerCase().replace('_', ' ')} ${tx.status.toLowerCase()}`,
      description: `${formatCurrency(tx.amount)} • User ID: ${tx.userId} • ${new Date(tx.createdAt).toLocaleTimeString()}`
    })),
    {
      icon: UserPlus,
      iconColor: 'bg-red-100 text-red-500',
      title: 'New user registered',
      description: 'User ID: #12456 • 15 minutes ago'
    }
  ].slice(0, 4);

  return (
    <div>
      {/* KPI Cards */}
      <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {kpiData.map((kpi, index) => (
          <KPICard key={index} {...kpi} />
        ))}
      </div>
      
      {/* Charts Section */}
      <Charts />
      
      {/* Recent Activity */}
      <div className="p-6">
        <RecentActivity activities={recentActivities} />
      </div>
    </div>
  );
};

export default Dashboard;