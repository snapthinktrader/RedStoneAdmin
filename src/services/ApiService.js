const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

class ApiService {
  // Helper method for making API calls
  static async apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'API call failed');
      }
      
      return data;
    } catch (error) {
      console.error(`API call failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Dashboard Stats
  static async getDashboardStats() {
    try {
      const response = await this.apiCall('/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  }

  // Users Management
  static async getUsers() {
    try {
      const response = await this.apiCall('/admin/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  static async getUserById(userId) {
    try {
      const response = await this.apiCall(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  static async updateUserStatus(userId, status) {
    try {
      const response = await this.apiCall(`/admin/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Transactions Management
  static async getTransactions() {
    try {
      const response = await this.apiCall('/admin/transactions');
      return response.data;
    } catch (error) {
      console.error('Error fetching transactions:', error);
      throw error;
    }
  }

  static async getTransactionById(transactionId) {
    try {
      const response = await this.apiCall(`/admin/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  }

  static async updateTransactionStatus(transactionId, status) {
    try {
      const response = await this.apiCall(`/admin/transactions/${transactionId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating transaction status:', error);
      throw error;
    }
  }

  // System Settings
  static async getSystemSettings() {
    try {
      const response = await this.apiCall('/admin/settings');
      return response.data;
    } catch (error) {
      console.error('Error fetching system settings:', error);
      throw error;
    }
  }

  static async updateSystemSettings(settings) {
    try {
      const response = await this.apiCall('/admin/settings', {
        method: 'PUT',
        body: JSON.stringify({ settings }),
      });
      return response.data;
    } catch (error) {
      console.error('Error updating system settings:', error);
      throw error;
    }
  }
}

export default ApiService;