import React, { useState, useEffect, useCallback } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import ApiService from '../services/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Charts = () => {
  const [userGrowthData, setUserGrowthData] = useState(null);
  const [financialFlowData, setFinancialFlowData] = useState(null);
  const [userDistributionData, setUserDistributionData] = useState(null);
  const [userLevelData, setUserLevelData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAnalyticsData = useCallback(async () => {
    try {
      setLoading(true);
      const [users, transactions] = await Promise.all([
        ApiService.getAllUsers(),
        ApiService.getAllTransactions()
      ]);

      // Generate user growth data (last 30 days)
      const userGrowthChart = generateUserGrowthData(users);
      setUserGrowthData(userGrowthChart);

      // Generate financial flow data (last 7 days)
      const financialChart = generateFinancialFlowData(transactions);
      setFinancialFlowData(financialChart);

      // Generate user distribution data
      const distributionChart = generateUserDistributionData(users);
      setUserDistributionData(distributionChart.chartData);
      setUserLevelData(distributionChart.tableData);

        } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalyticsData();
  }, [fetchAnalyticsData]);

  const generateUserGrowthData = (users) => {
    const last30Days = [];
    const today = new Date();
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayUsers = users.filter(user => {
        const userDate = new Date(user.createdAt);
        return userDate.toDateString() === date.toDateString();
      }).length;

      last30Days.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        count: dayUsers
      });
    }

    return {
      labels: last30Days.map(day => day.label),
      datasets: [{
        label: 'New Users',
        data: last30Days.map(day => day.count),
        backgroundColor: 'rgba(229, 57, 53, 0.1)',
        borderColor: '#E53935',
        borderWidth: 2,
        tension: 0.3,
        fill: true
      }]
    };
  };

  const generateFinancialFlowData = (transactions) => {
    const last7Days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      
      const dayDeposits = transactions
        .filter(tx => 
          tx.type === 'DEPOSIT' && 
          tx.status === 'COMPLETED' &&
          new Date(tx.createdAt).toDateString() === date.toDateString()
        )
        .reduce((sum, tx) => sum + (tx.amount || 0), 0);

      const dayWithdrawals = transactions
        .filter(tx => 
          tx.type === 'WITHDRAWAL' && 
          tx.status === 'COMPLETED' &&
          new Date(tx.createdAt).toDateString() === date.toDateString()
        )
        .reduce((sum, tx) => sum + (tx.amount || 0), 0);

      last7Days.push({
        label: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        deposits: dayDeposits,
        withdrawals: dayWithdrawals
      });
    }

    return {
      labels: last7Days.map(day => day.label),
      datasets: [
        {
          label: 'Deposits',
          data: last7Days.map(day => day.deposits),
          backgroundColor: 'rgba(76, 175, 80, 0.7)',
          borderColor: '#4CAF50',
          borderWidth: 1
        },
        {
          label: 'Withdrawals',
          data: last7Days.map(day => day.withdrawals),
          backgroundColor: 'rgba(229, 57, 53, 0.7)',
          borderColor: '#E53935',
          borderWidth: 1
        }
      ]
    };
  };

  const generateUserDistributionData = (users) => {
    const levelCounts = {
      1: 0,
      2: 0,
      3: 0,
      '4+': 0
    };

    const levelBalances = {
      1: [],
      2: [],
      3: [],
      '4+': []
    };

    users.forEach(user => {
      const level = user.level || 1;
      const balance = user.walletBalance || 0;
      
      if (level <= 3) {
        levelCounts[level]++;
        levelBalances[level].push(balance);
      } else {
        levelCounts['4+']++;
        levelBalances['4+'].push(balance);
      }
    });

    const totalUsers = users.length;
    const chartData = {
      labels: ['Level 1', 'Level 2', 'Level 3', 'Level 4+'],
      datasets: [{
        data: [
          levelCounts[1],
          levelCounts[2], 
          levelCounts[3],
          levelCounts['4+']
        ],
        backgroundColor: [
          '#E53935',
          '#FFCDD2',
          '#FFEBEE',
          '#F5F5F5'
        ],
        borderWidth: 0
      }]
    };

    const tableData = [
      {
        level: 'Level 1',
        users: levelCounts[1].toLocaleString(),
        percentage: totalUsers > 0 ? ((levelCounts[1] / totalUsers) * 100).toFixed(1) + '%' : '0%',
        avgBalance: levelBalances[1].length > 0 
          ? '$' + (levelBalances[1].reduce((a, b) => a + b, 0) / levelBalances[1].length).toFixed(0)
          : '$0'
      },
      {
        level: 'Level 2',
        users: levelCounts[2].toLocaleString(),
        percentage: totalUsers > 0 ? ((levelCounts[2] / totalUsers) * 100).toFixed(1) + '%' : '0%',
        avgBalance: levelBalances[2].length > 0 
          ? '$' + (levelBalances[2].reduce((a, b) => a + b, 0) / levelBalances[2].length).toFixed(0)
          : '$0'
      },
      {
        level: 'Level 3',
        users: levelCounts[3].toLocaleString(),
        percentage: totalUsers > 0 ? ((levelCounts[3] / totalUsers) * 100).toFixed(1) + '%' : '0%',
        avgBalance: levelBalances[3].length > 0 
          ? '$' + (levelBalances[3].reduce((a, b) => a + b, 0) / levelBalances[3].length).toFixed(0)
          : '$0'
      },
      {
        level: 'Level 4+',
        users: levelCounts['4+'].toLocaleString(),
        percentage: totalUsers > 0 ? ((levelCounts['4+'] / totalUsers) * 100).toFixed(1) + '%' : '0%',
        avgBalance: levelBalances['4+'].length > 0 
          ? '$' + (levelBalances['4+'].reduce((a, b) => a + b, 0) / levelBalances['4+'].length).toFixed(0)
          : '$0'
      }
    ];

    return { chartData, tableData };
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return '$' + (value / 1000).toFixed(0) + 'k';
          }
        }
      }
    }
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom'
      }
    }
  };

  if (loading) {
    return (
      <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">User Growth (30 Days)</h3>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading chart data...</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium mb-4">Financial Flow (7 Days)</h3>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading chart data...</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <h3 className="text-lg font-medium mb-4">User Distribution by Level</h3>
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-500">Loading chart data...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">User Growth (30 Days)</h3>
        <div style={{ height: '250px' }}>
          {userGrowthData && <Line data={userGrowthData} options={chartOptions} />}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium mb-4">Financial Flow (7 Days)</h3>
        <div style={{ height: '250px' }}>
          {financialFlowData && <Bar data={financialFlowData} options={barChartOptions} />}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6 lg:col-span-2">
        <h3 className="text-lg font-medium mb-4">User Distribution by Level</h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-1/3">
            <div style={{ height: '200px' }}>
              {userDistributionData && <Doughnut data={userDistributionData} options={doughnutOptions} />}
            </div>
          </div>
          <div className="w-full md:w-2/3">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Users</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Percentage</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Avg. Balance</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {userLevelData.map((row, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{row.level}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.users}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.percentage}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{row.avgBalance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Charts;