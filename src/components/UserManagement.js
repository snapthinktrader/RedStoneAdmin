import React, { useState, useEffect } from 'react';
import { Search, Filter, ChevronLeft, ChevronRight, X, User } from 'lucide-react';
import ApiService from '../services/api';

const UserManagement = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserModal, setShowUserModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Fetch users from backend
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllUsers();
      // Transform backend data to match component expectations
      const transformedUsers = data.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        level: user.currentLevel,
        balance: `$${user.walletBalance.toFixed(2)}`,
        joinDate: new Date(user.createdAt).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric'
        }),
        status: user.isVerified ? 'Active' : 'Inactive',
        totalDeposit: user.totalDeposit,
        totalEarnings: user.totalEarnings,
        directReferrals: user.directReferrals,
        indirectReferrals: user.indirectReferrals,
        referralCode: user.referralCode,
        lastLoginAt: user.lastLoginAt,
        emailVerified: user.isVerified
      }));
      setUsers(transformedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
      // Fallback to empty array instead of hardcoded data
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search and status
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || user.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const getLevelColor = (level) => {
    switch (level) {
      case 1: return 'bg-yellow-100 text-yellow-800';
      case 2: return 'bg-green-100 text-green-800';
      case 3: return 'bg-blue-100 text-blue-800';
      case 4: return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowUserModal(true);
  };

  const transactionHistory = [
    { date: '15 Jun 2023', type: 'Deposit', amount: '+$500.00', status: 'Completed', details: 'Bank Transfer' },
    { date: '16 Jun 2023', type: 'Withdrawal', amount: '-$255.00', status: 'Completed', details: 'BTC: 1A1zP...e541' },
    { date: '16 Jun 2023', type: 'Commission', amount: '+$45.00', status: 'Completed', details: 'Referral Bonus' },
  ];

  return (
    <div>
      {/* Filters and Actions */}
      <div className="p-6 bg-white shadow-sm border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="relative w-full md:w-64">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="text-gray-400 w-5 h-5" />
            </div>
            <input 
              type="text" 
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" 
              placeholder="Search users..."
            />
          </div>
          
          <div className="flex space-x-3 w-full md:w-auto">
            <select className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
              <option>All Levels</option>
              <option>Level 1</option>
              <option>Level 2</option>
              <option>Level 3</option>
              <option>Level 4+</option>
            </select>
            
            <select className="block w-full md:w-48 pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
              <option>All Statuses</option>
              <option>Active</option>
              <option>Suspended</option>
              <option>Pending</option>
            </select>
            
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <Filter className="mr-2 w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>
      
      {/* Users Table */}
      <div className="p-6">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Level</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading users...
                    </td>
                  </tr>
                ) : filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getLevelColor(user.level)}`}>
                          Level {user.level}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.balance}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.joinDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="text-red-500 hover:text-red-700 mr-3"
                        >
                          View
                        </button>
                        <button className="text-gray-500 hover:text-gray-700">Suspend</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700">
                  Showing <span className="font-medium">1</span> to <span className="font-medium">5</span> of{' '}
                  <span className="font-medium">24,589</span> users
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button className="z-10 bg-red-50 border-red-500 text-red-600 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    1
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    2
                  </button>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    3
                  </button>
                  <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                    ...
                  </span>
                  <button className="bg-white border-gray-300 text-gray-500 hover:bg-gray-50 relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    492
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Detail Modal */}
      {showUserModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">User Details: {selectedUser.id}</h3>
              <button onClick={() => setShowUserModal(false)}>
                <X className="text-gray-500 w-6 h-6" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="col-span-1">
                <div className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                  <div className="h-24 w-24 rounded-full bg-red-100 flex items-center justify-center mb-4">
                    <User className="text-red-500 w-12 h-12" />
                  </div>
                  <h4 className="text-lg font-medium">{selectedUser.name}</h4>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                  <div className="mt-4 flex space-x-2">
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${getLevelColor(selectedUser.level)}`}>
                      Level {selectedUser.level}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="col-span-1 md:col-span-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">Account Information</h5>
                    <p><span className="font-medium">Joined:</span> {selectedUser.joinDate}</p>
                    <p><span className="font-medium">Last Active:</span> 5 minutes ago</p>
                    <p><span className="font-medium">IP Address:</span> 192.168.1.100</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">Financial Summary</h5>
                    <p><span className="font-medium">Balance:</span> {selectedUser.balance}</p>
                    <p><span className="font-medium">Total Deposits:</span> $2,500.00</p>
                    <p><span className="font-medium">Total Withdrawals:</span> $1,255.00</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">Referral Network</h5>
                    <p><span className="font-medium">Direct Referrals:</span> 12</p>
                    <p><span className="font-medium">Indirect Referrals:</span> 56</p>
                    <p><span className="font-medium">Total Commission:</span> $345.00</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h5 className="text-sm font-medium text-gray-500 mb-2">Account Actions</h5>
                    <div className="flex space-x-2">
                      <button className="text-xs px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600">
                        Suspend
                      </button>
                      <button className="text-xs px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">
                        Reset Password
                      </button>
                      <button className="text-xs px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600">
                        Send Message
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Manual Credit Section */}
            <div className="mb-6">
              <h4 className="text-lg font-medium mb-4">Manual Credit</h4>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Amount</label>
                    <div className="relative rounded-md shadow-sm">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <span className="text-gray-500 sm:text-sm">$</span>
                      </div>
                      <input 
                        type="text" 
                        className="focus:ring-red-500 focus:border-red-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md" 
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                    <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                      <option>Promotional Bonus</option>
                      <option>Support Credit</option>
                      <option>Referral Bonus</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600">
                      Add Credit
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Transaction History */}
            <div>
              <h4 className="text-lg font-medium mb-4">Transaction History</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {transactionHistory.map((transaction, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.date}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.type}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.amount}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {transaction.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{transaction.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button 
                onClick={() => setShowUserModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;