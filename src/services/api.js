const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://redstonebackend.onrender.com/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('admin_token');
  }

  setAuthToken(token) {
    this.token = token;
    localStorage.setItem('admin_token', token);
  }

  getAuthHeaders() {
    return {
      'Content-Type': 'application/json',
      ...(this.token && { 'Authorization': `Bearer ${this.token}` })
    };
  }

  async makeRequest(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: this.getAuthHeaders(),
        ...options
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`);
      }

      return data;
    } catch (error) {
      console.error('API Request failed:', error);
      throw error;
    }
  }

  // Admin Authentication
  async adminLogin(credentials) {
    const response = await fetch(`${API_BASE_URL}/auth/admin/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(credentials)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Login failed');
    }

    if (data.success && data.token) {
      this.setAuthToken(data.token);
      return data;
    }

    throw new Error('Invalid response from server');
  }

  // Dashboard Statistics - ONLY REAL DATA
  async getDashboardStats() {
    const response = await this.makeRequest('/admin/stats');
    return response;
  }

  // Users Management - ONLY REAL DATA
  async getAllUsers() {
    const response = await this.makeRequest('/admin/users');
    return response.data || response;
  }

  async getUserById(userId) {
    const response = await this.makeRequest(`/admin/users/${userId}`);
    return response.data;
  }

  async updateUserStatus(userId, status) {
    return await this.makeRequest(`/admin/users/${userId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  async addManualCredit(userId, amount, reason, description) {
    return await this.makeRequest(`/admin/users/${userId}/credit`, {
      method: 'POST',
      body: JSON.stringify({ amount, reason, description })
    });
  }

  async addAdminDeposit(userId, amount, description) {
    return await this.makeRequest(`/admin/users/${userId}/deposit`, {
      method: 'POST',
      body: JSON.stringify({ amount, description })
    });
  }

  // Transactions Management - ONLY REAL DATA
  async getAllTransactions() {
    const response = await this.makeRequest('/admin/transactions');
    return response.data || response;
  }

  // Withdrawals Management - Filter transactions by type
  async getAllWithdrawals() {
    const transactions = await this.getAllTransactions();
    return transactions.filter(tx => tx.type === 'WITHDRAWAL');
  }

  async updateTransactionStatus(transactionId, status) {
    return await this.makeRequest(`/admin/transactions/${transactionId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // Withdrawal Management
  async approveWithdrawal(withdrawalId, adminNotes = '') {
    return await this.makeRequest(`/admin/payment/withdrawals/${withdrawalId}/approve`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes })
    });
  }

  async rejectWithdrawal(withdrawalId, adminNotes = '') {
    return await this.makeRequest(`/admin/payment/withdrawals/${withdrawalId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ adminNotes })
    });
  }

  async getPendingWithdrawals() {
    const response = await this.makeRequest('/admin/payment/withdrawals/pending');
    return response.data?.withdrawals || [];
  }

  async getTransactionById(transactionId) {
    const response = await this.makeRequest(`/admin/transactions/${transactionId}`);
    return response.data;
  }

  // Settings Management - ONLY REAL DATA
  async getSystemSettings() {
    const response = await this.makeRequest('/admin/settings');
    return response.data || response;
  }

  async updateSystemSettings(settings) {
    return await this.makeRequest('/admin/settings', {
      method: 'PUT',
      body: JSON.stringify({ settings })
    });
  }

  // Referrals Management - ONLY REAL DATA
  async getAllReferrals() {
    // Note: You need to create a referral endpoint in backend
    const response = await this.makeRequest('/admin/referrals');
    return response.data || [];
  }

  // Analytics - CALCULATED FROM REAL DATA
  async getAnalytics(period = '30d') {
    const [transactions, users] = await Promise.all([
      this.getAllTransactions(),
      this.getAllUsers()
    ]);
    
    // Calculate real analytics from actual data
    const deposits = transactions.filter(tx => tx.type === 'DEPOSIT' && tx.status === 'COMPLETED');
    
    return {
      userGrowth: this.calculateUserGrowth(users),
      revenueGrowth: this.calculateRevenueGrowth(transactions),
      transactionVolume: transactions.reduce((sum, tx) => sum + (tx.amount || 0), 0),
      averageDeposit: deposits.length > 0 
        ? deposits.reduce((sum, tx) => sum + tx.amount, 0) / deposits.length 
        : 0,
    };
  }

  // Helper methods for analytics
  calculateUserGrowth(users) {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const usersUpToDate = users.filter(user => 
        new Date(user.createdAt) <= date
      ).length;
      
      last7Days.push({
        date: dateStr,
        users: usersUpToDate
      });
    }
    return last7Days;
  }

  calculateRevenueGrowth(transactions) {
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      const dayRevenue = transactions
        .filter(tx => 
          tx.status === 'COMPLETED' && 
          tx.type === 'DEPOSIT' &&
          new Date(tx.createdAt).toDateString() === date.toDateString()
        )
        .reduce((sum, tx) => sum + (tx.amount * 0.1), 0); // 10% platform fee
      
      last7Days.push({
        date: dateStr,
        revenue: dayRevenue
      });
    }
    return last7Days;
  }
}

const apiService = new ApiService();
export default apiService;