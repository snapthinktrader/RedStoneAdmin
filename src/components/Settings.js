import React, { useState, useEffect } from 'react';
import { Save, RefreshCw, Bell, Shield, DollarSign, Users, Settings as SettingsIcon, AlertTriangle, User, Key } from 'lucide-react';
import ApiService from '../services/api';

const Settings = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getSystemSettings();
      setSettings(data);
    } catch (err) {
      console.error('Settings fetch error:', err);
    } finally {
      setLoading(false);
    }
  };



  const [settings, setSettings] = useState({
    platform: {
      siteName: 'RedStone Trading',
      siteDescription: 'Advanced Cryptocurrency Trading Platform',
      maintenanceMode: false,
      registrationEnabled: true,
      emailVerificationRequired: true,
    },
    trading: {
      dailyReturnRate: 2.0,
      minimumDeposit: 10.0,
      maximumDeposit: 50000.0,
      minimumWithdrawal: 10.0,
      maximumWithdrawal: 10000.0,
      withdrawalFee: 0.5,
      autoApproveDeposits: false,
      autoApproveWithdrawals: false,
    },
    referral: {
      level1Commission: 5.0,
      level2Commission: 2.0,
      level3Commission: 1.0,
      referralBonusEnabled: true,
      milestoneBonus: 100.0,
      milestoneBonusTarget: 10,
    },
    notifications: {
      emailNotifications: true,
      smsNotifications: false,
      adminEmailAlerts: true,
      newUserNotification: true,
      withdrawalRequestNotification: true,
      largeTransactionAlert: true,
      largeTransactionThreshold: 1000.0,
    },
    security: {
      twoFactorRequired: false,
      sessionTimeout: 30,
      maxLoginAttempts: 5,
      passwordExpiryDays: 90,
      ipWhitelisting: false,
      allowedIPs: '',
    },
    profile: {
      adminName: 'Administrator',
      adminEmail: 'admin@redstone.com',
      adminPhone: '',
      timezone: 'UTC',
      language: 'en',
    },
    credentials: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    }
  });

  const [saveStatus, setSaveStatus] = useState('');
  const [activeTab, setActiveTab] = useState('platform');

  // Save settings to backend
  const saveSettings = async () => {
    try {
      setLoading(true);
      setSaveStatus('');
      
      await ApiService.updateSystemSettings(settings);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const updateSetting = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const tabs = [
    { id: 'platform', name: 'Platform', icon: SettingsIcon },
    { id: 'trading', name: 'Trading', icon: DollarSign },
    { id: 'referral', name: 'Referral', icon: Users },
    { id: 'notifications', name: 'Notifications', icon: Bell },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'profile', name: 'Profile', icon: User },
    { id: 'credentials', name: 'Admin Credentials', icon: Key },
  ];

  const renderPlatformSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Name</label>
        <input
          type="text"
          value={settings.platform.siteName}
          onChange={(e) => updateSetting('platform', 'siteName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Site Description</label>
        <textarea
          value={settings.platform.siteDescription}
          onChange={(e) => updateSetting('platform', 'siteDescription', e.target.value)}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Maintenance Mode</label>
          <p className="text-sm text-gray-500">Disable access to the platform for maintenance</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.platform.maintenanceMode}
            onChange={(e) => updateSetting('platform', 'maintenanceMode', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Registration Enabled</label>
          <p className="text-sm text-gray-500">Allow new users to register</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.platform.registrationEnabled}
            onChange={(e) => updateSetting('platform', 'registrationEnabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Verification Required</label>
          <p className="text-sm text-gray-500">Require email verification for new accounts</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.platform.emailVerificationRequired}
            onChange={(e) => updateSetting('platform', 'emailVerificationRequired', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
    </div>
  );

  const renderTradingSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Daily Return Rate (%)</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={settings.trading.dailyReturnRate}
          onChange={(e) => updateSetting('trading', 'dailyReturnRate', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Deposit ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.trading.minimumDeposit}
            onChange={(e) => updateSetting('trading', 'minimumDeposit', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Deposit ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.trading.maximumDeposit}
            onChange={(e) => updateSetting('trading', 'maximumDeposit', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Minimum Withdrawal ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.trading.minimumWithdrawal}
            onChange={(e) => updateSetting('trading', 'minimumWithdrawal', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Maximum Withdrawal ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.trading.maximumWithdrawal}
            onChange={(e) => updateSetting('trading', 'maximumWithdrawal', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Withdrawal Fee (%)</label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="10"
          value={settings.trading.withdrawalFee}
          onChange={(e) => updateSetting('trading', 'withdrawalFee', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Auto-Approve Deposits</label>
          <p className="text-sm text-gray-500">Automatically approve deposits without manual review</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.trading.autoApproveDeposits}
            onChange={(e) => updateSetting('trading', 'autoApproveDeposits', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Auto-Approve Withdrawals</label>
          <p className="text-sm text-gray-500">Automatically approve withdrawals without manual review</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.trading.autoApproveWithdrawals}
            onChange={(e) => updateSetting('trading', 'autoApproveWithdrawals', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
    </div>
  );

  const renderReferralSettings = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Level 1 Commission (%)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="50"
            value={settings.referral.level1Commission}
            onChange={(e) => updateSetting('referral', 'level1Commission', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Level 2 Commission (%)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="50"
            value={settings.referral.level2Commission}
            onChange={(e) => updateSetting('referral', 'level2Commission', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Level 3 Commission (%)</label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="50"
            value={settings.referral.level3Commission}
            onChange={(e) => updateSetting('referral', 'level3Commission', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Milestone Bonus ($)</label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={settings.referral.milestoneBonus}
            onChange={(e) => updateSetting('referral', 'milestoneBonus', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Milestone Target (Referrals)</label>
          <input
            type="number"
            min="1"
            value={settings.referral.milestoneBonusTarget}
            onChange={(e) => updateSetting('referral', 'milestoneBonusTarget', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Referral Bonus Enabled</label>
          <p className="text-sm text-gray-500">Enable referral commission system</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.referral.referralBonusEnabled}
            onChange={(e) => updateSetting('referral', 'referralBonusEnabled', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Email Notifications</label>
          <p className="text-sm text-gray-500">Send email notifications to users</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.emailNotifications}
            onChange={(e) => updateSetting('notifications', 'emailNotifications', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Admin Email Alerts</label>
          <p className="text-sm text-gray-500">Send email alerts to administrators</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.adminEmailAlerts}
            onChange={(e) => updateSetting('notifications', 'adminEmailAlerts', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">New User Notification</label>
          <p className="text-sm text-gray-500">Alert when new users register</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.newUserNotification}
            onChange={(e) => updateSetting('notifications', 'newUserNotification', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Withdrawal Request Notification</label>
          <p className="text-sm text-gray-500">Alert when users request withdrawals</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.withdrawalRequestNotification}
            onChange={(e) => updateSetting('notifications', 'withdrawalRequestNotification', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Large Transaction Alert</label>
          <p className="text-sm text-gray-500">Alert for transactions above threshold</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.notifications.largeTransactionAlert}
            onChange={(e) => updateSetting('notifications', 'largeTransactionAlert', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Large Transaction Threshold ($)</label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={settings.notifications.largeTransactionThreshold}
          onChange={(e) => updateSetting('notifications', 'largeTransactionThreshold', parseFloat(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">Two-Factor Authentication Required</label>
          <p className="text-sm text-gray-500">Require 2FA for all user accounts</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.twoFactorRequired}
            onChange={(e) => updateSetting('security', 'twoFactorRequired', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Session Timeout (minutes)</label>
          <input
            type="number"
            min="5"
            max="1440"
            value={settings.security.sessionTimeout}
            onChange={(e) => updateSetting('security', 'sessionTimeout', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Max Login Attempts</label>
          <input
            type="number"
            min="1"
            max="10"
            value={settings.security.maxLoginAttempts}
            onChange={(e) => updateSetting('security', 'maxLoginAttempts', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password Expiry (days)</label>
        <input
          type="number"
          min="30"
          max="365"
          value={settings.security.passwordExpiryDays}
          onChange={(e) => updateSetting('security', 'passwordExpiryDays', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-gray-700">IP Whitelisting</label>
          <p className="text-sm text-gray-500">Restrict access to specific IP addresses</p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={settings.security.ipWhitelisting}
            onChange={(e) => updateSetting('security', 'ipWhitelisting', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
        </label>
      </div>
      
      {settings.security.ipWhitelisting && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Allowed IP Addresses</label>
          <textarea
            value={settings.security.allowedIPs}
            onChange={(e) => updateSetting('security', 'allowedIPs', e.target.value)}
            rows={4}
            placeholder="Enter IP addresses, one per line"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
      )}
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Name</label>
        <input
          type="text"
          value={settings.profile.adminName}
          onChange={(e) => updateSetting('profile', 'adminName', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Email</label>
        <input
          type="email"
          value={settings.profile.adminEmail}
          onChange={(e) => updateSetting('profile', 'adminEmail', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Admin Phone</label>
        <input
          type="tel"
          value={settings.profile.adminPhone}
          onChange={(e) => updateSetting('profile', 'adminPhone', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
          <select
            value={settings.profile.timezone}
            onChange={(e) => updateSetting('profile', 'timezone', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="UTC">UTC</option>
            <option value="America/New_York">Eastern Time</option>
            <option value="America/Chicago">Central Time</option>
            <option value="America/Denver">Mountain Time</option>
            <option value="America/Los_Angeles">Pacific Time</option>
            <option value="Europe/London">London</option>
            <option value="Europe/Paris">Paris</option>
            <option value="Asia/Tokyo">Tokyo</option>
            <option value="Asia/Shanghai">Shanghai</option>
            <option value="Asia/Kolkata">Mumbai</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
          <select
            value={settings.profile.language}
            onChange={(e) => updateSetting('profile', 'language', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="en">English</option>
            <option value="es">Spanish</option>
            <option value="fr">French</option>
            <option value="de">German</option>
            <option value="it">Italian</option>
            <option value="pt">Portuguese</option>
            <option value="ru">Russian</option>
            <option value="zh">Chinese</option>
            <option value="ja">Japanese</option>
            <option value="ko">Korean</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderCredentialsSettings = () => (
    <div className="space-y-6">
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
          <div className="text-sm">
            <p className="text-yellow-800 font-medium">Security Notice</p>
            <p className="text-yellow-700 mt-1">
              Changing your password will log you out of all active sessions. Make sure to save your new password securely.
            </p>
          </div>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
        <input
          type="password"
          value={settings.credentials.currentPassword}
          onChange={(e) => updateSetting('credentials', 'currentPassword', e.target.value)}
          placeholder="Enter current password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
        <input
          type="password"
          value={settings.credentials.newPassword}
          onChange={(e) => updateSetting('credentials', 'newPassword', e.target.value)}
          placeholder="Enter new password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <p className="text-sm text-gray-500 mt-1">
          Password must be at least 8 characters long and contain uppercase, lowercase, numbers, and special characters.
        </p>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
        <input
          type="password"
          value={settings.credentials.confirmPassword}
          onChange={(e) => updateSetting('credentials', 'confirmPassword', e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        {settings.credentials.newPassword && settings.credentials.confirmPassword && 
         settings.credentials.newPassword !== settings.credentials.confirmPassword && (
          <p className="text-sm text-red-600 mt-1">Passwords do not match</p>
        )}
      </div>
      
      <div className="pt-4 border-t border-gray-200">
        <button
          onClick={() => {
            // Handle password change
            if (settings.credentials.newPassword === settings.credentials.confirmPassword) {
              console.log('Password change initiated');
              // Here you would call an API to change the password
            }
          }}
          disabled={
            !settings.credentials.currentPassword ||
            !settings.credentials.newPassword ||
            !settings.credentials.confirmPassword ||
            settings.credentials.newPassword !== settings.credentials.confirmPassword
          }
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
        >
          Update Password
        </button>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'platform':
        return renderPlatformSettings();
      case 'trading':
        return renderTradingSettings();
      case 'referral':
        return renderReferralSettings();
      case 'notifications':
        return renderNotificationSettings();
      case 'security':
        return renderSecuritySettings();
      case 'profile':
        return renderProfileSettings();
      case 'credentials':
        return renderCredentialsSettings();
      default:
        return renderPlatformSettings();
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600">Configure platform settings and preferences</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={fetchSettings}
            disabled={loading}
            className="flex items-center px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={saveSettings}
            disabled={loading}
            className="flex items-center px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>

      {/* Save Status */}
      {saveStatus && (
        <div className={`p-4 rounded-lg ${saveStatus === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {saveStatus === 'success' ? 'Settings saved successfully!' : 'Failed to save settings. Please try again.'}
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const IconComponent = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center ${
                  activeTab === tab.id
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <IconComponent className="w-4 h-4 mr-2" />
                {tab.name}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="bg-white rounded-lg shadow p-6">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        ) : (
          renderTabContent()
        )}
      </div>

      {/* Warning */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <AlertTriangle className="w-5 h-5 text-yellow-400 mr-3 mt-0.5" />
          <div className="text-sm">
            <p className="text-yellow-800 font-medium">Important Notice</p>
            <p className="text-yellow-700 mt-1">
              Changes to these settings will affect all users on the platform. Please review carefully before saving.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;