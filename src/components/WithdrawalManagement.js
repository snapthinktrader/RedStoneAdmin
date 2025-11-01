import React, { useState, useEffect } from 'react';
import { Filter, Calendar, ChevronLeft, ChevronRight, X, Wallet, User, TrendingUp, RefreshCw } from 'lucide-react';
import ApiService from '../services/api';

const WithdrawalManagement = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showDeclineModal, setShowDeclineModal] = useState(false);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState(null);
  const [withdrawalDetails, setWithdrawalDetails] = useState(null);
  const [adminWalletInfo, setAdminWalletInfo] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

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
    setLoadingDetails(true);
    
    try {
      // Fetch detailed user and wallet information
      const [details, walletInfo] = await Promise.all([
        ApiService.getWithdrawalDetails(withdrawal._id),
        ApiService.getAdminWalletInfo()
      ]);
      
      setWithdrawalDetails(details);
      setAdminWalletInfo(walletInfo);
    } catch (error) {
      console.error('Error fetching withdrawal details:', error);
      alert('Failed to load withdrawal details. Please try again.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleDecline = async (withdrawal) => {
    setSelectedWithdrawal(withdrawal);
    setShowDeclineModal(true);
  };

  const confirmApproval = async () => {
    try {
      if (selectedWithdrawal && selectedWithdrawal._id) {
        const adminNotes = document.getElementById('approvalNotes')?.value || '';
        const selectedWalletAddress = document.getElementById('selectedWallet')?.value;
        
        await ApiService.approveWithdrawal(selectedWithdrawal._id, {
          adminNotes,
          selectedWallet: selectedWalletAddress
        });
        
        alert('Withdrawal approved and executed successfully!');
        await fetchWithdrawals(); // Refresh the list
        setShowApproveModal(false);
        setSelectedWithdrawal(null);
        setWithdrawalDetails(null);
        setAdminWalletInfo(null);
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

      {/* Enhanced Approve Modal with Full Details */}
      {showApproveModal && selectedWithdrawal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full my-8">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b border-gray-200">
              <h3 className="text-2xl font-bold text-gray-800">Withdrawal Approval</h3>
              <button onClick={() => {
                setShowApproveModal(false);
                setWithdrawalDetails(null);
                setAdminWalletInfo(null);
              }}>
                <X className="text-gray-500 w-6 h-6 hover:text-gray-700" />
              </button>
            </div>

            {loadingDetails ? (
              <div className="p-8 text-center">
                <RefreshCw className="animate-spin h-8 w-8 text-red-500 mx-auto mb-4" />
                <p className="text-gray-600">Loading withdrawal details...</p>
              </div>
            ) : (
              <div className="p-6 max-h-[70vh] overflow-y-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* User Information */}
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    <div className="flex items-center mb-3">
                      <User className="w-5 h-5 text-blue-600 mr-2" />
                      <h4 className="text-lg font-semibold text-blue-900">User Information</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">User ID:</span>
                        <span className="font-mono font-medium">{withdrawalDetails?.user?._id?.slice(-8) || selectedWithdrawal.userId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Email:</span>
                        <span className="font-medium">{withdrawalDetails?.user?.email || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">User Level:</span>
                        <span className="font-medium">{withdrawalDetails?.user?.userLevel || 'Basic'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Wallet Balance:</span>
                        <span className="font-bold text-blue-600">${withdrawalDetails?.user?.walletBalance?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Deposited:</span>
                        <span className="font-medium">${withdrawalDetails?.user?.totalDeposited?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Withdrawn:</span>
                        <span className="font-medium">${withdrawalDetails?.user?.totalWithdrawn?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Referral Earnings */}
                  <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                    <div className="flex items-center mb-3">
                      <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                      <h4 className="text-lg font-semibold text-green-900">Referral Earnings</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lifetime Referral:</span>
                        <span className="font-bold text-green-600">${withdrawalDetails?.user?.lifetimeReferralEarnings?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Pending Commission:</span>
                        <span className="font-medium">${withdrawalDetails?.user?.pendingReferralCommission?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Referrals:</span>
                        <span className="font-medium">{withdrawalDetails?.referralStats?.totalReferrals || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Active Referrals:</span>
                        <span className="font-medium">{withdrawalDetails?.referralStats?.activeReferrals || 0}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Upper Track:</span>
                        <span className="font-medium">{withdrawalDetails?.user?.milestoneTracking?.upperTrack?.count || 0} refs</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Lower Track:</span>
                        <span className="font-medium">{withdrawalDetails?.user?.milestoneTracking?.lowerTrack?.count || 0} refs</span>
                      </div>
                    </div>
                  </div>

                  {/* Withdrawal Details */}
                  <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                    <div className="flex items-center mb-3">
                      <Wallet className="w-5 h-5 text-yellow-600 mr-2" />
                      <h4 className="text-lg font-semibold text-yellow-900">Withdrawal Request</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Request ID:</span>
                        <span className="font-mono font-medium">{selectedWithdrawal.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Amount:</span>
                        <span className="font-bold text-yellow-600 text-lg">{selectedWithdrawal.requestedAmount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Destination:</span>
                        <span className="font-mono text-xs break-all">{selectedWithdrawal.withdrawalAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Request Date:</span>
                        <span className="font-medium">{selectedWithdrawal.requestDate}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balance After:</span>
                        <span className="font-bold text-blue-600">
                          ${((withdrawalDetails?.user?.walletBalance || 0) - parseFloat(selectedWithdrawal.requestedAmount.replace('$', ''))).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Admin Wallet Information */}
                  <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center mb-3">
                      <Wallet className="w-5 h-5 text-purple-600 mr-2" />
                      <h4 className="text-lg font-semibold text-purple-900">Current Processing Wallet</h4>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Selected Wallet:</span>
                        <span className="font-mono text-xs break-all">{adminWalletInfo?.currentWallet?.address || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Balance:</span>
                        <span className="font-bold text-purple-600">${adminWalletInfo?.currentWallet?.balance?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{adminWalletInfo?.currentWallet?.type || 'Unknown'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Sufficient Funds:</span>
                        <span className={`font-bold ${adminWalletInfo?.hasSufficientFunds ? 'text-green-600' : 'text-red-600'}`}>
                          {adminWalletInfo?.hasSufficientFunds ? '✓ Yes' : '✗ No'}
                        </span>
                      </div>
                    </div>
                    {adminWalletInfo?.availableWallets && adminWalletInfo.availableWallets.length > 1 && (
                      <div className="mt-3 pt-3 border-t border-purple-200">
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Switch Wallet (if needed):
                        </label>
                        <select 
                          id="selectedWallet"
                          className="w-full text-xs border border-gray-300 rounded px-2 py-1 focus:ring-purple-500 focus:border-purple-500"
                          defaultValue={adminWalletInfo.currentWallet?.address}
                        >
                          {adminWalletInfo.availableWallets.map((wallet, idx) => (
                            <option key={idx} value={wallet.address}>
                              [{wallet.type}] {wallet.address.slice(0, 8)}...{wallet.address.slice(-6)} - ${wallet.balance?.toFixed(2) || '0.00'}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* System Wallet Breakdown - Full Width */}
                <div className="mt-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 border border-indigo-200">
                  <h4 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center">
                    <Wallet className="w-5 h-5 mr-2" />
                    Complete System Wallet Overview
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Main Wallet */}
                    <div className="bg-white rounded-lg p-4 border border-indigo-300 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-indigo-900">Main Wallet</h5>
                        <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">Primary</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Address</p>
                          <p className="font-mono text-xs break-all">{adminWalletInfo?.mainWallet?.address || 'Not configured'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">USDT Balance</p>
                          <p className="font-bold text-lg text-indigo-600">${adminWalletInfo?.mainWallet?.usdtBalance?.toFixed(2) || '0.00'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">TRX Balance</p>
                          <p className="font-medium text-gray-700">{adminWalletInfo?.mainWallet?.trxBalance?.toFixed(2) || '0.00'} TRX</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Status</p>
                          <p className={`font-medium ${adminWalletInfo?.mainWallet?.isActive ? 'text-green-600' : 'text-gray-400'}`}>
                            {adminWalletInfo?.mainWallet?.isActive ? '● Active' : '○ Inactive'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Reusable Wallets */}
                    <div className="bg-white rounded-lg p-4 border border-purple-300 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-purple-900">Reusable Wallets</h5>
                        <span className="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded">
                          {adminWalletInfo?.reusableWallets?.length || 0} wallets
                        </span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Total USDT</p>
                          <p className="font-bold text-lg text-purple-600">
                            ${adminWalletInfo?.reusableWallets?.reduce((sum, w) => sum + (w.usdtBalance || 0), 0).toFixed(2) || '0.00'}
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Total TRX</p>
                          <p className="font-medium text-gray-700">
                            {adminWalletInfo?.reusableWallets?.reduce((sum, w) => sum + (w.trxBalance || 0), 0).toFixed(2) || '0.00'} TRX
                          </p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Active Wallets</p>
                          <p className="font-medium text-green-600">
                            {adminWalletInfo?.reusableWallets?.filter(w => w.isActive).length || 0} / {adminWalletInfo?.reusableWallets?.length || 0}
                          </p>
                        </div>
                        {adminWalletInfo?.reusableWallets && adminWalletInfo.reusableWallets.length > 0 && (
                          <div className="pt-2 border-t border-purple-100 max-h-32 overflow-y-auto">
                            <p className="text-gray-500 text-xs mb-1">Wallet List:</p>
                            {adminWalletInfo.reusableWallets.map((wallet, idx) => (
                              <div key={idx} className="text-xs py-1 border-b border-gray-100 last:border-0">
                                <p className="font-mono text-gray-600">{wallet.address?.slice(0, 6)}...{wallet.address?.slice(-4)}</p>
                                <p className="text-gray-500">${wallet.usdtBalance?.toFixed(2) || '0'} USDT • {wallet.trxBalance?.toFixed(2) || '0'} TRX</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Fuel Wallet */}
                    <div className="bg-white rounded-lg p-4 border border-orange-300 shadow-sm">
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-semibold text-orange-900">Fuel Wallet</h5>
                        <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">Gas Fees</span>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div>
                          <p className="text-gray-500 text-xs">Address</p>
                          <p className="font-mono text-xs break-all">{adminWalletInfo?.fuelWallet?.address || 'Not configured'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">TRX Balance</p>
                          <p className="font-bold text-lg text-orange-600">{adminWalletInfo?.fuelWallet?.trxBalance?.toFixed(2) || '0.00'} TRX</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Min Required</p>
                          <p className="font-medium text-gray-700">{adminWalletInfo?.fuelWallet?.minRequired || '50.00'} TRX</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-xs">Status</p>
                          <p className={`font-medium ${adminWalletInfo?.hasSufficientFuel ? 'text-green-600' : 'text-red-600'}`}>
                            {adminWalletInfo?.hasSufficientFuel ? '✓ Sufficient' : '✗ Low Fuel'}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Total System Summary */}
                  <div className="mt-4 pt-4 border-t border-indigo-200">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total USDT</p>
                        <p className="text-xl font-bold text-indigo-600">
                          ${((adminWalletInfo?.mainWallet?.usdtBalance || 0) + 
                             (adminWalletInfo?.reusableWallets?.reduce((sum, w) => sum + (w.usdtBalance || 0), 0) || 0)).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total TRX</p>
                        <p className="text-xl font-bold text-orange-600">
                          {((adminWalletInfo?.mainWallet?.trxBalance || 0) + 
                            (adminWalletInfo?.reusableWallets?.reduce((sum, w) => sum + (w.trxBalance || 0), 0) || 0) +
                            (adminWalletInfo?.fuelWallet?.trxBalance || 0)).toFixed(2)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Can Process</p>
                        <p className={`text-xl font-bold ${adminWalletInfo?.canProcessWithdrawal ? 'text-green-600' : 'text-red-600'}`}>
                          {adminWalletInfo?.canProcessWithdrawal ? '✓ Yes' : '✗ No'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-600 mb-1">Total Wallets</p>
                        <p className="text-xl font-bold text-purple-600">
                          {(adminWalletInfo?.reusableWallets?.length || 0) + 2}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Notes */}
                <div className="mt-6">
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

                {/* Warning Messages */}
                {!adminWalletInfo?.canProcessWithdrawal && (
                  <div className="mt-4 p-4 bg-red-100 border-l-4 border-red-500 rounded-md">
                    <p className="text-sm text-red-800 font-bold mb-2">
                      ⚠️ Cannot Process Withdrawal
                    </p>
                    {!adminWalletInfo?.hasSufficientFunds && (
                      <p className="text-sm text-red-700 mb-1">
                        • Insufficient USDT funds. Available: ${adminWalletInfo?.currentWallet?.balance?.toFixed(2) || '0.00'} | Required: {selectedWithdrawal?.requestedAmount}
                      </p>
                    )}
                    {!adminWalletInfo?.hasSufficientFuel && (
                      <p className="text-sm text-red-700 mb-1">
                        • Low fuel balance. Available: {adminWalletInfo?.fuelWallet?.trxBalance?.toFixed(2) || '0.00'} TRX | Minimum: {adminWalletInfo?.fuelWallet?.minRequired || '50.00'} TRX
                      </p>
                    )}
                    <p className="text-sm text-red-700 mt-2 font-medium">
                      Action Required: {!adminWalletInfo?.hasSufficientFunds ? 'Switch to a wallet with sufficient funds or add USDT. ' : ''}
                      {!adminWalletInfo?.hasSufficientFuel ? 'Add TRX to fuel wallet for transaction fees.' : ''}
                    </p>
                  </div>
                )}
                {adminWalletInfo?.canProcessWithdrawal && (
                  <div className="mt-4 p-4 bg-green-100 border-l-4 border-green-500 rounded-md">
                    <p className="text-sm text-green-800 font-bold mb-1">
                      ✓ Ready to Process Withdrawal
                    </p>
                    <p className="text-sm text-green-700">
                      All requirements met. System has sufficient USDT balance ({adminWalletInfo?.currentWallet?.balance?.toFixed(2)} USDT) and fuel ({adminWalletInfo?.fuelWallet?.trxBalance?.toFixed(2)} TRX) to process this withdrawal.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-4 p-6 border-t border-gray-200 bg-gray-50">
              <button 
                onClick={() => {
                  setShowApproveModal(false);
                  setWithdrawalDetails(null);
                  setAdminWalletInfo(null);
                }}
                className="flex-1 px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 bg-white"
                disabled={loadingDetails}
              >
                Cancel
              </button>
              <button 
                onClick={confirmApproval}
                className={`flex-1 px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed ${
                  loadingDetails || !adminWalletInfo?.canProcessWithdrawal
                    ? 'bg-gray-400'
                    : 'bg-green-500 hover:bg-green-600 focus:ring-green-500'
                }`}
                disabled={loadingDetails || !adminWalletInfo?.canProcessWithdrawal}
                title={!adminWalletInfo?.canProcessWithdrawal ? 'Insufficient funds or fuel to process withdrawal' : 'Process withdrawal now'}
              >
                {loadingDetails 
                  ? 'Loading Details...' 
                  : !adminWalletInfo?.canProcessWithdrawal
                  ? '⚠️ Cannot Process - Check Wallet Status'
                  : '✓ Confirm & Process Withdrawal'}
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