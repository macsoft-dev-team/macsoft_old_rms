
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Settings as SettingsIcon, Save, Bell, Shield, Database, Wifi } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import Input from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Label } from '../components/ui/label';
import { Separator } from '../components/ui/separator';
import { useToast } from '../hooks/use-toast';
import TitleHead from '../components/TitleHead';

const Settings = () => {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      smsAlerts: false,
      browserNotifications: true,
      faultAlerts: true,
      maintenanceAlerts: true
    },
    system: {
      dataRetentionDays: 60,
      maxDevices: 100000,
      mqttKeepAlive: 60,
      autoReconnect: true,
      dataBackup: true
    },
    security: {
      sessionTimeout: 30,
      passwordExpiry: 90,
      twoFactorAuth: false,
      apiRateLimit: 1000
    }
  });

  const handleSettingChange = (category, key, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value
      }
    }));
  };

  const handleSaveSettings = () => {
    // Simulate saving settings
    toast({
      title: "Settings Saved",
      description: "Your settings have been saved successfully",
    });
  };

  return (
    <div className="space-y-6">
      <TitleHead title="Settings" description="Configure system preferences and security" >
        <Button onClick={handleSaveSettings}>
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </TitleHead>

      {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Bell className="w-5 h-5" />
              <span>Notifications</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts">Email Alerts</Label>
              <Switch
                id="email-alerts"
                checked={settings.notifications.emailAlerts}
                onCheckedChange={(value) => handleSettingChange('notifications', 'emailAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="sms-alerts">SMS Alerts</Label>
              <Switch
                id="sms-alerts"
                checked={settings.notifications.smsAlerts}
                onCheckedChange={(value) => handleSettingChange('notifications', 'smsAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="browser-notifications">Browser Notifications</Label>
              <Switch
                id="browser-notifications"
                checked={settings.notifications.browserNotifications}
                onCheckedChange={(value) => handleSettingChange('notifications', 'browserNotifications', value)}
              />
            </div>

            <Separator />

            <div className="flex items-center justify-between">
              <Label htmlFor="fault-alerts">Fault Alerts</Label>
              <Switch
                id="fault-alerts"
                checked={settings.notifications.faultAlerts}
                onCheckedChange={(value) => handleSettingChange('notifications', 'faultAlerts', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-alerts">Maintenance Alerts</Label>
              <Switch
                id="maintenance-alerts"
                checked={settings.notifications.maintenanceAlerts}
                onCheckedChange={(value) => handleSettingChange('notifications', 'maintenanceAlerts', value)}
              />
            </div>
          </CardContent>
        </Card> 
        <Card >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Database className="w-5 h-5" />
              <span>System Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className='flex gap-2 w-full *:flex-1 *:w-full'>
              <div>
                <Label htmlFor="data-retention">Data Retention (days)</Label>
                <Input
                  id="data-retention"
                  type="number"
                  value={settings.system.dataRetentionDays}
                  onChange={(e) => handleSettingChange('system', 'dataRetentionDays', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="max-devices">Maximum Devices</Label>
                <Input
                  id="max-devices"
                  type="number"
                  value={settings.system.maxDevices}
                  onChange={(e) => handleSettingChange('system', 'maxDevices', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="mqtt-keepalive">MQTT Keep Alive (seconds)</Label>
                <Input
                  id="mqtt-keepalive"
                  type="number"
                  value={settings.system.mqttKeepAlive}
                  onChange={(e) => handleSettingChange('system', 'mqttKeepAlive', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-reconnect">Auto Reconnect</Label>
              <Switch
                id="auto-reconnect"
                checked={settings.system.autoReconnect}
                onCheckedChange={(value) => handleSettingChange('system', 'autoReconnect', value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="data-backup">Automatic Data Backup</Label>
              <Switch
                id="data-backup"
                checked={settings.system.dataBackup}
                onCheckedChange={(value) => handleSettingChange('system', 'dataBackup', value)}
              />
            </div>
          </CardContent>
        </Card> 
        <Card className="row-span-2">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Wifi className="w-5 h-5" />
              <span>MQTT Configuration</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className='flex gap-2 w-full *:flex-1 *:w-full'>
              <div>
                <Label htmlFor="broker-url">Primary Broker URL</Label>
                <Input
                  id="broker-url"
                  value="mqtt.solarpump.com"
                  className="mt-1"
                  readOnly
                />
              </div>
              <div>
                <Label htmlFor="broker-port">Broker Port</Label>
                <Input
                  id="broker-port"
                  value="1883"
                  className="mt-1"
                  readOnly
                />
              </div>
            </div>
            <div>
              <Label htmlFor="topics-config">Topics Configuration</Label>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Publish:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">data/pub</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Command Subscribe:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">cmd/sub</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Command Publish:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">cmd/pub</code>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> MQTT configuration changes require system restart to take effect.
              </p>
            </div>
          </CardContent>
        </Card> 
        <Card >
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Security</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 ">
            <div className='flex gap-2 w-full *:flex-1 *:w-full'>
              <div>
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input
                  id="password-expiry"
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={(e) => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="api-rate-limit">API Rate Limit (requests/hour)</Label>
                <Input
                  id="api-rate-limit"
                  type="number"
                  value={settings.security.apiRateLimit}
                  onChange={(e) => handleSettingChange('security', 'apiRateLimit', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <Switch
                id="two-factor"
                checked={settings.security.twoFactorAuth}
                onCheckedChange={(value) => handleSettingChange('security', 'twoFactorAuth', value)}
              />
            </div>
          </CardContent>
        </Card>
      </div> */}

      <div className="
        grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-0 
        w-full min-h-[600px] bg-gray-50 rounded-lg overflow-hidden
      ">
        {/* Top Left: Notifications */}
        <div className="p-6 border-b border-r border-gray-200">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Notifications
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="email-alerts">Email Alerts</Label>
              <Switch
                id="email-alerts"
                checked={settings.notifications.emailAlerts}
                onCheckedChange={value => handleSettingChange('notifications', 'emailAlerts', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms-alerts">SMS Alerts</Label>
              <Switch
                id="sms-alerts"
                checked={settings.notifications.smsAlerts}
                onCheckedChange={value => handleSettingChange('notifications', 'smsAlerts', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="browser-notifications">Browser Notifications</Label>
              <Switch
                id="browser-notifications"
                checked={settings.notifications.browserNotifications}
                onCheckedChange={value => handleSettingChange('notifications', 'browserNotifications', value)}
              />
            </div>
            <hr className="my-2 border-gray-100" />
            <div className="flex items-center justify-between">
              <Label htmlFor="fault-alerts">Fault Alerts</Label>
              <Switch
                id="fault-alerts"
                checked={settings.notifications.faultAlerts}
                onCheckedChange={value => handleSettingChange('notifications', 'faultAlerts', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="maintenance-alerts">Maintenance Alerts</Label>
              <Switch
                id="maintenance-alerts"
                checked={settings.notifications.maintenanceAlerts}
                onCheckedChange={value => handleSettingChange('notifications', 'maintenanceAlerts', value)}
              />
            </div>
          </div>
        </div>

        {/* Top Right: System Configuration */}
        <div className="p-6 border-b border-gray-200">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Database className="w-5 h-5" />
            System Configuration
          </h2>
          <div className="space-y-4">
            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <Label htmlFor="data-retention">Data Retention (days)</Label>
                <Input
                  id="data-retention"
                  type="number"
                  value={settings.system.dataRetentionDays}
                  onChange={e => handleSettingChange('system', 'dataRetentionDays', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="max-devices">Maximum Devices</Label>
                <Input
                  id="max-devices"
                  type="number"
                  value={settings.system.maxDevices}
                  onChange={e => handleSettingChange('system', 'maxDevices', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="mqtt-keepalive">MQTT Keep Alive (seconds)</Label>
                <Input
                  id="mqtt-keepalive"
                  type="number"
                  value={settings.system.mqttKeepAlive}
                  onChange={e => handleSettingChange('system', 'mqttKeepAlive', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-reconnect">Auto Reconnect</Label>
              <Switch
                id="auto-reconnect"
                checked={settings.system.autoReconnect}
                onCheckedChange={value => handleSettingChange('system', 'autoReconnect', value)}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="data-backup">Automatic Data Backup</Label>
              <Switch
                id="data-backup"
                checked={settings.system.dataBackup}
                onCheckedChange={value => handleSettingChange('system', 'dataBackup', value)}
              />
            </div>
          </div>
        </div>

        {/* Bottom Left: Security */}
        <div className="p-6 border-r border-gray-200">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Security
          </h2>
          <div className="space-y-4">
            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={settings.security.sessionTimeout}
                  onChange={e => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="password-expiry">Password Expiry (days)</Label>
                <Input
                  id="password-expiry"
                  type="number"
                  value={settings.security.passwordExpiry}
                  onChange={e => handleSettingChange('security', 'passwordExpiry', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="api-rate-limit">API Rate Limit (requests/hour)</Label>
                <Input
                  id="api-rate-limit"
                  type="number"
                  value={settings.security.apiRateLimit}
                  onChange={e => handleSettingChange('security', 'apiRateLimit', parseInt(e.target.value))}
                  className="mt-1"
                />
              </div>
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="two-factor">Two-Factor Authentication</Label>
              <Switch
                id="two-factor"
                checked={settings.security.twoFactorAuth}
                onCheckedChange={value => handleSettingChange('security', 'twoFactorAuth', value)}
              />
            </div>
          </div>
        </div>

        {/* Bottom Right: MQTT Configuration */}
        <div className="p-6 ">
          <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
            <Wifi className="w-5 h-5" />
            MQTT Configuration
          </h2>
          <div className="space-y-4">
            <div className="flex gap-2 w-full">
              <div className="flex-1">
                <Label htmlFor="broker-url">Primary Broker URL</Label>
                <Input
                  id="broker-url"
                  value="mqtt.solarpump.com"
                  className="mt-1"
                  readOnly
                />
              </div>
              <div className="flex-1">
                <Label htmlFor="broker-port">Broker Port</Label>
                <Input
                  id="broker-port"
                  value="1883"
                  className="mt-1"
                  readOnly
                />
              </div>
            </div>
            <div>
              <Label htmlFor="topics-config">Topics Configuration</Label>
              <div className="mt-2 space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Data Publish:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">data/pub</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Command Subscribe:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">cmd/sub</code>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Command Publish:</span>
                  <code className="bg-gray-100 px-2 py-1 rounded">cmd/pub</code>
                </div>
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> MQTT configuration changes require system restart to take effect.
              </p>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Settings;
