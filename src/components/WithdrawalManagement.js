import React, { useState, useEffect } from 'react';
import { Filter, Calendar, ChevronLeft, ChevronRight, X } from 'lucide-react';
import ApiService from '../services/api';

const WithdrawalManagement = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);

  // Fetch withdrawals from backend
  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getAllWithdrawals();
      
      // Transform backend data to match component expectations
      const transformedWithdrawals = (data || []).map(withdrawal => ({
        id: `#WD${withdrawal._id.slice(-5)}`,
        userId: withdrawal.userId?._id ? `#${withdrawal.userId._id.slice(-5)}` : (withdrawal.userId ? `#${withdrawal.userId.slice(-5)}` : 'Unknown'),
        currentBalance: withdrawal.userId?.walletBalance ? `$${withdrawal.userId.walletBalance.toFixed(2)}` : '$0.00',
        requestedAmount: `$${withdrawal.amount.toFixed(2)}`,
        withdrawalAddress: withdrawal.toAddress || withdrawal.walletAddress || 'Not specified',
        requestDate: new Date(withdrawal.createdAt).toLocaleDateString('en-US', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        status: withdrawal.status,
        _id: withdrawal._id,
        originalData: withdrawal
      }));

      setWithdrawals(transformedWithdrawals);
    } catch (error) {
      console.error('Error fetching withdrawals:', error);
      setWithdrawals([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleApprove = async (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowApproveModal(true);
  };

  const handleDecline = async (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowDeclineModal(true);
  };

  const confirmApproval = async () => {
    try {
      if (selectedWithdrawal && selectedWithdrawal._id) {
        const adminNotes = document.getElementById('approvalNotes')?.value || '';
        await ApiService.approveWithdrawal(selectedWithdrawal._id, adminNotes);
        alert('Withdrawal approved and executed successfully!');
        await fetchWithdrawals(); // Refresh the list
        setShowApproveModal(false);
        setSelectedWithdrawal(null);
      }
    } catch (error) {
      console.error('Error approving withdrawal:', error);
      alert(`Failed to approve withdrawal: ${error.message}`);
    }
  };

  const confirmDecline = async () => {
    try {
      if (selectedWithdrawal && selectedWithdrawal._id) {
        const adminNotes = document.getElementById('rejectNotes')?.value || '';
        await ApiService.rejectWithdrawal(selectedWithdrawal._id, adminNotes);
        alert('Withdrawal rejected successfully!');
        await fetchWithdrawals(); // Refresh the list
        setShowDeclineModal(false);
        setSelectedWithdrawal(null);
      }
    } catch (error) {
      console.error('Error rejecting withdrawal:', error);
      alert(`Failed to reject withdrawal: ${error.message}`);
    }
  };

  return (
    <div>
      {/* Filters */}
      <div className="p-6 bg-white shadow-sm border-b">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                <option>All Statuses</option>
                <option selected>Pending</option>
                <option>Completed</option>
                <option>Declined</option>
              </select>
            </div>
            <div className="relative">
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                <option>All Methods</option>
                <option>Bank Transfer</option>
                <option>Bitcoin</option>
                <option>Ethereum</option>
                <option>USDT</option>
              </select>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Calendar className="text-gray-400 w-5 h-5" />
              </div>
              <input 
                type="text" 
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm" 
                placeholder="Date range"
              />
            </div>
            <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500">
              <Filter className="mr-2 w-4 h-4" />
              Filter
            </button>
          </div>
        </div>
      </div>
      
      {/* Withdrawals Table */}
      <div className="p-6">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Balance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Requested Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Withdrawal Address</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      Loading withdrawals...
                    </td>
                  </tr>
                ) : withdrawals.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                      No withdrawal requests found
                    </td>
                  </tr>
                ) : (
                  withdrawals.map((withdrawal) => (
                    <tr key={withdrawal.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{withdrawal.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{withdrawal.userId}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.currentBalance}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{withdrawal.requestedAmount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.withdrawalAddress}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{withdrawal.requestDate}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button 
                          onClick={() => handleApprove(withdrawal)}
                          className="text-green-500 hover:text-green-700 mr-3"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleDecline(withdrawal)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Decline
                        </button>
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
                  <span className="font-medium">42</span> requests
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
                    9
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

      {/* Approve Modal */}
      {showApproveModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Confirm Approval</h3>
              <button onClick={() => setShowApproveModal(false)}>
                <X className="text-gray-500 w-6 h-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">
              Are you sure you want to approve this withdrawal of{' '}
              <span className="font-bold">{selectedWithdrawal.requestedAmount}</span> to address{' '}
              <span className="font-mono text-xs">{selectedWithdrawal.withdrawalAddress}</span>?
            </p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Admin Notes (Optional)
              </label>
              <textarea
                id="approvalNotes"
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-green-500 focus:border-green-500"
                placeholder="Add any notes about this approval..."
              />
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowApproveModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmApproval}
                className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              >
                Confirm Approval
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Decline Modal */}
      {showDeclineModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-800">Decline Withdrawal</h3>
              <button onClick={() => setShowDeclineModal(false)}>
                <X className="text-gray-500 w-6 h-6" />
              </button>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Decline</label>
              <select className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md">
                <option>Security Concern</option>
                <option>Insufficient Funds</option>
                <option>Invalid Address</option>
                <option>Suspicious Activity</option>
                <option>Other</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes (Optional)</label>
              <textarea 
                id="rejectNotes"
                rows="3" 
                className="shadow-sm focus:ring-red-500 focus:border-red-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Provide reason for rejection..."
              ></textarea>
            </div>
            <div className="flex space-x-4">
              <button 
                onClick={() => setShowDeclineModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDecline}
                className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Confirm Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WithdrawalManagement;