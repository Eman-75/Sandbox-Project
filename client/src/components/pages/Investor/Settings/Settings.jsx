import React, { useState } from 'react';
import { Bell, CreditCard, Globe, Lock, Mail, Moon, Shield, Sun, User, Users } from 'lucide-react';

function Settings() {
  const [darkMode, setDarkMode] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [investmentAlerts, setInvestmentAlerts] = useState(true);
  const [messageAlerts, setMessageAlerts] = useState(true);

  const settingsSections = [
    {
      id: 'profile',
      title: 'Profile Settings',
      icon: User,
      items: [
        { label: 'Full Name', value: 'Eman Shahid', type: 'text' },
        { label: 'Email Address', value: 'eman@investor.com', type: 'email' },
        { label: 'Phone Number', value: '+1 (555) 123-4567', type: 'tel' },
        { label: 'Company/Firm', value: 'Sandbox Capital', type: 'text' },
        { label: 'Job Title', value: 'Senior Investor', type: 'text' },
      ],
    },
    {
      id: 'security',
      title: 'Security & Privacy',
      icon: Shield,
      items: [
        { label: 'Two-Factor Authentication', value: 'Enabled', type: 'toggle', enabled: true },
        { label: 'Login Notifications', value: 'Enabled', type: 'toggle', enabled: true },
        { label: 'Session Timeout', value: '30 minutes', type: 'select' },
        { label: 'Password', value: '••••••••', type: 'password' },
      ],
    },
    {
      id: 'notifications',
      title: 'Notification Preferences',
      icon: Bell,
      items: [
        { label: 'Email Notifications', value: emailNotifications, type: 'toggle', onChange: setEmailNotifications },
        { label: 'Push Notifications', value: pushNotifications, type: 'toggle', onChange: setPushNotifications },
        { label: 'Investment Opportunities', value: investmentAlerts, type: 'toggle', onChange: setInvestmentAlerts },
        { label: 'New Messages', value: messageAlerts, type: 'toggle', onChange: setMessageAlerts },
        { label: 'Data Room Updates', value: true, type: 'toggle' },
        { label: 'Portfolio Milestones', value: true, type: 'toggle' },
      ],
    },
    {
      id: 'preferences',
      title: 'Investment Preferences',
      icon: CreditCard,
      items: [
        { label: 'Preferred Sectors', value: 'Fintech, Healthtech, Climate', type: 'text' },
        { label: 'Investment Stages', value: 'Seed to Series B', type: 'text' },
        { label: 'Geographic Focus', value: 'US, Remote-friendly', type: 'text' },
        { label: 'Minimum Ticket Size', value: '$50,000', type: 'text' },
        { label: 'Maximum Ticket Size', value: '$2,000,000', type: 'text' },
      ],
    },
    {
      id: 'appearance',
      title: 'Appearance',
      icon: Moon,
      items: [
        { label: 'Theme', value: darkMode ? 'Dark' : 'Light', type: 'toggle', onChange: setDarkMode },
        { label: 'Language', value: 'English', type: 'select' },
        { label: 'Time Zone', value: 'UTC-5 (Eastern Time)', type: 'select' },
        { label: 'Date Format', value: 'MM/DD/YYYY', type: 'select' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6">
        {settingsSections.map((section) => {
          const Icon = section.icon;
          return (
            <div
              key={section.id}
              className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-slate-200/50 dark:border-slate-700/50 overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200/50 dark:border-slate-700/50">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-[#e39622] to-[#ffb347] rounded-lg">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
                    {section.title}
                  </h2>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {section.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between py-3 border-b border-slate-200/50 dark:border-slate-700/50 last:border-0"
                  >
                    <div className="flex-1">
                      <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
                        {item.label}
                      </label>
                      {item.type !== 'toggle' && (
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                          {item.value}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-4">
                      {item.type === 'toggle' ? (
                        <button
                          onClick={() => item.onChange && item.onChange(!item.value)}
                          className={`relative w-12 h-6 rounded-full transition-colors ${
                            item.value
                              ? 'bg-gradient-to-r from-[#e39622] to-[#ffb347]'
                              : 'bg-slate-300 dark:bg-slate-700'
                          }`}
                        >
                          <span
                            className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                              item.value ? 'translate-x-6' : 'translate-x-0'
                            }`}
                          />
                        </button>
                      ) : item.type === 'select' ? (
                        <select className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-orange-500">
                          <option>{item.value}</option>
                        </select>
                      ) : (
                        <button className="px-4 py-2 text-sm font-medium text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300">
                          Edit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-red-900 dark:text-red-400 mb-2">
          Danger Zone
        </h2>
        <p className="text-sm text-red-700 dark:text-red-500 mb-4">
          These actions cannot be undone. Please be certain.
        </p>
        <div className="flex gap-4">
          <button className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium">
            Deactivate Account
          </button>
          <button className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors text-sm font-medium">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export default Settings;

