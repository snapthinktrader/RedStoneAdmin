import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Wallet, Shield, Settings, Mail, Eye, EyeOff, CheckCircle, AlertTriangle } from 'lucide-react';

const AdminSettings = () => {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [showPasswords, setShowPasswords] = useState(false);
  const [walletTest, setWalletTest] = useState(null);

  // Form states
  const [walletForm, setWalletForm] = useState({
    newWalletAddress: '',
    confirmPassword: ''
  });

  const [credentialsForm, setCredentialsForm] = useState({
    currentPassword: '',
    newEmail: '',
    newPassword: '',
    confirmNewPassword: ''
  });

  const [systemForm, setSystemForm] = useState({
    enableDepositMonitoring: true,
    autoConfirmDeposits: false,
    requireManualWithdrawalApproval: true,
    maxDailyWithdrawalUSD: 10000,
    tronApiKey: '',
    ethScanApiKey: ''
  });

  const [emailForm, setEmailForm] = useState({
    smtpHost: '',
    smtpPort: 587,
    smtpUser: '',
    smtpPassword: ''
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSettings(data.data);
        
        // Initialize forms with current settings
        setWalletForm(prev => ({
          ...prev,
          newWalletAddress: data.data.mainWalletAddress || ''
        }));
        
        setCredentialsForm(prev => ({
          ...prev,
          newEmail: data.data.adminEmail || ''
        }));
        
        setSystemForm({
          enableDepositMonitoring: data.data.enableDepositMonitoring ?? true,
          autoConfirmDeposits: data.data.autoConfirmDeposits ?? false,
          requireManualWithdrawalApproval: data.data.requireManualWithdrawalApproval ?? true,
          maxDailyWithdrawalUSD: data.data.maxDailyWithdrawalUSD || 10000,
          tronApiKey: data.data.tronApiKey || '',
          ethScanApiKey: data.data.ethScanApiKey || ''
        });
        
        setEmailForm({
          smtpHost: data.data.smtpHost || '',
          smtpPort: data.data.smtpPort || 587,
          smtpUser: data.data.smtpUser || '',
          smtpPassword: '' // Never pre-fill password
        });
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to load settings' });
    } finally {
      setLoading(false);
    }
  };

  const updateMainWallet = async () => {
    if (!walletForm.newWalletAddress || !walletForm.confirmPassword) {
      setMessage({ type: 'error', text: 'Please fill in all fields' });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings/main-wallet', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(walletForm)
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Main wallet updated successfully' });
        setWalletForm(prev => ({ ...prev, confirmPassword: '' }));
        loadSettings();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update main wallet' });
    } finally {
      setSaving(false);
    }
  };

  const updateCredentials = async () => {
    if (!credentialsForm.currentPassword) {
      setMessage({ type: 'error', text: 'Current password is required' });
      return;
    }

    if (credentialsForm.newPassword && credentialsForm.newPassword !== credentialsForm.confirmNewPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' });
      return;
    }

    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings/credentials', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({
          currentPassword: credentialsForm.currentPassword,
          newEmail: credentialsForm.newEmail,
          newPassword: credentialsForm.newPassword
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Credentials updated successfully' });
        setCredentialsForm(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        }));
        loadSettings();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update credentials' });
    } finally {
      setSaving(false);
    }
  };

  const updateSystemSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings/system', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(systemForm)
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'System settings updated successfully' });
        loadSettings();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update system settings' });
    } finally {
      setSaving(false);
    }
  };

  const updateEmailSettings = async () => {
    setSaving(true);
    try {
      const response = await fetch('/api/admin/settings/email', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(emailForm)
      });

      const data = await response.json();
      
      if (data.success) {
        setMessage({ type: 'success', text: 'Email settings updated successfully' });
        setEmailForm(prev => ({ ...prev, smtpPassword: '' }));
        loadSettings();
      } else {
        setMessage({ type: 'error', text: data.message });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update email settings' });
    } finally {
      setSaving(false);
    }
  };

  const testMainWallet = async () => {
    setWalletTest({ status: 'testing' });
    try {
      const response = await fetch('/api/admin/settings/test-wallet', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      const data = await response.json();
      setWalletTest({
        status: data.success ? 'success' : 'error',
        data: data.data,
        message: data.message
      });
    } catch (error) {
      setWalletTest({
        status: 'error',
        message: 'Failed to test wallet connection'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Settings</h1>
        <p className="text-gray-600">Manage system configuration and admin preferences</p>
      </div>

      {message && (
        <Alert className={message.type === 'error' ? 'border-red-500 bg-red-50' : 'border-green-500 bg-green-50'}>
          {message.type === 'error' ? <AlertTriangle className="h-4 w-4" /> : <CheckCircle className="h-4 w-4" />}
          <AlertDescription>{message.text}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="wallet" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="wallet">
            <Wallet className="w-4 h-4 mr-2" />
            Wallet
          </TabsTrigger>
          <TabsTrigger value="credentials">
            <Shield className="w-4 h-4 mr-2" />
            Credentials
          </TabsTrigger>
          <TabsTrigger value="system">
            <Settings className="w-4 h-4 mr-2" />
            System
          </TabsTrigger>
          <TabsTrigger value="email">
            <Mail className="w-4 h-4 mr-2" />
            Email
          </TabsTrigger>
        </TabsList>

        <TabsContent value="wallet">
          <Card>
            <CardHeader>
              <CardTitle>Main Wallet Configuration</CardTitle>
              <p className="text-sm text-gray-600">
                Configure the main wallet address where all funds will be swept
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentWallet">Current Main Wallet</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <Input
                    id="currentWallet"
                    value={settings?.mainWalletAddress || ''}
                    readOnly
                    className="font-mono text-sm"
                  />
                  <Button onClick={testMainWallet} variant="outline" size="sm">
                    Test
                  </Button>
                </div>
                {walletTest && (
                  <div className={`mt-2 p-2 rounded text-sm ${
                    walletTest.status === 'success' ? 'bg-green-50 text-green-700' :
                    walletTest.status === 'error' ? 'bg-red-50 text-red-700' :
                    'bg-blue-50 text-blue-700'
                  }`}>
                    {walletTest.status === 'testing' && 'Testing wallet connection...'}
                    {walletTest.status === 'success' && (
                      <div>
                        <div>✅ Wallet connected successfully</div>
                        <div>TRX Balance: {walletTest.data?.trxBalance || 0}</div>
                        <div>USDT Balance: {walletTest.data?.usdtBalance || 0}</div>
                      </div>
                    )}
                    {walletTest.status === 'error' && `❌ ${walletTest.message}`}
                  </div>
                )}
              </div>

              <div>
                <Label htmlFor="newWallet">New Wallet Address</Label>
                <Input
                  id="newWallet"
                  placeholder="TXyz123... (34 characters starting with T)"
                  value={walletForm.newWalletAddress}
                  onChange={(e) => setWalletForm(prev => ({ ...prev, newWalletAddress: e.target.value }))}
                  className="font-mono"
                />
              </div>

              <div>
                <Label htmlFor="walletPassword">Confirm Password</Label>
                <div className="relative">
                  <Input
                    id="walletPassword"
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Enter your admin password to confirm"
                    value={walletForm.confirmPassword}
                    onChange={(e) => setWalletForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3"
                    onClick={() => setShowPasswords(!showPasswords)}
                  >
                    {showPasswords ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              <Button onClick={updateMainWallet} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Main Wallet
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="credentials">
          <Card>
            <CardHeader>
              <CardTitle>Admin Credentials</CardTitle>
              <p className="text-sm text-gray-600">
                Update your admin email and password
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="currentPassword">Current Password</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={credentialsForm.currentPassword}
                    onChange={(e) => setCredentialsForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="newEmail">Email Address</Label>
                <Input
                  id="newEmail"
                  type="email"
                  placeholder="admin@redstone.com"
                  value={credentialsForm.newEmail}
                  onChange={(e) => setCredentialsForm(prev => ({ ...prev, newEmail: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="newPassword">New Password (optional)</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Leave empty to keep current password"
                    value={credentialsForm.newPassword}
                    onChange={(e) => setCredentialsForm(prev => ({ ...prev, newPassword: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
                <div className="relative">
                  <Input
                    id="confirmNewPassword"
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="Confirm new password"
                    value={credentialsForm.confirmNewPassword}
                    onChange={(e) => setCredentialsForm(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={updateCredentials} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Credentials
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
              <p className="text-sm text-gray-600">
                Configure system behavior and API settings
              </p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Deposit Monitoring</Label>
                    <p className="text-sm text-gray-600">Automatically monitor and process deposits</p>
                  </div>
                  <Switch
                    checked={systemForm.enableDepositMonitoring}
                    onCheckedChange={(checked) => setSystemForm(prev => ({ ...prev, enableDepositMonitoring: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Auto-Confirm Deposits</Label>
                    <p className="text-sm text-gray-600">Automatically confirm deposits without manual approval</p>
                  </div>
                  <Switch
                    checked={systemForm.autoConfirmDeposits}
                    onCheckedChange={(checked) => setSystemForm(prev => ({ ...prev, autoConfirmDeposits: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Manual Withdrawal Approval</Label>
                    <p className="text-sm text-gray-600">All withdrawals need admin approval</p>
                  </div>
                  <Switch
                    checked={systemForm.requireManualWithdrawalApproval}
                    onCheckedChange={(checked) => setSystemForm(prev => ({ ...prev, requireManualWithdrawalApproval: checked }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="maxWithdrawal">Maximum Daily Withdrawal (USD)</Label>
                <Input
                  id="maxWithdrawal"
                  type="number"
                  min="0"
                  value={systemForm.maxDailyWithdrawalUSD}
                  onChange={(e) => setSystemForm(prev => ({ ...prev, maxDailyWithdrawalUSD: parseInt(e.target.value) || 0 }))}
                />
              </div>

              <div>
                <Label htmlFor="tronApi">Tron API Key</Label>
                <Input
                  id="tronApi"
                  placeholder="Your Tron Grid API key"
                  value={systemForm.tronApiKey}
                  onChange={(e) => setSystemForm(prev => ({ ...prev, tronApiKey: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="ethApi">EtherScan API Key</Label>
                <Input
                  id="ethApi"
                  placeholder="Your EtherScan API key"
                  value={systemForm.ethScanApiKey}
                  onChange={(e) => setSystemForm(prev => ({ ...prev, ethScanApiKey: e.target.value }))}
                />
              </div>

              <Button onClick={updateSystemSettings} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update System Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Email Configuration</CardTitle>
              <p className="text-sm text-gray-600">
                Configure SMTP settings for email notifications
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="smtpHost">SMTP Host</Label>
                <Input
                  id="smtpHost"
                  placeholder="smtp.gmail.com"
                  value={emailForm.smtpHost}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, smtpHost: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="smtpPort">SMTP Port</Label>
                <Input
                  id="smtpPort"
                  type="number"
                  placeholder="587"
                  value={emailForm.smtpPort}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, smtpPort: parseInt(e.target.value) || 587 }))}
                />
              </div>

              <div>
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  placeholder="your-email@gmail.com"
                  value={emailForm.smtpUser}
                  onChange={(e) => setEmailForm(prev => ({ ...prev, smtpUser: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <div className="relative">
                  <Input
                    id="smtpPassword"
                    type={showPasswords ? 'text' : 'password'}
                    placeholder="App password or SMTP password"
                    value={emailForm.smtpPassword}
                    onChange={(e) => setEmailForm(prev => ({ ...prev, smtpPassword: e.target.value }))}
                  />
                </div>
              </div>

              <Button onClick={updateEmailSettings} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Update Email Settings
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {settings && (
        <Card>
          <CardHeader>
            <CardTitle>Settings Info</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Last Updated:</span>
                <span className="ml-2">{new Date(settings.lastUpdatedAt).toLocaleString()}</span>
              </div>
              <div>
                <span className="font-medium">Updated By:</span>
                <span className="ml-2">{settings.lastUpdatedBy}</span>
              </div>
              <div>
                <span className="font-medium">Version:</span>
                <span className="ml-2">{settings.version}</span>
              </div>
              <div>
                <span className="font-medium">Created:</span>
                <span className="ml-2">{new Date(settings.createdAt).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AdminSettings;