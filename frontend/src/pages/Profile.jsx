import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Bell, CheckCircle } from 'lucide-react';

export default function Profile() {
  const { currentUser, updateUserProfile } = useAuth();
  const [name, setName] = useState(currentUser?.displayName || '');
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateUserProfile(name);
      setSuccessMsg('Profile updated successfully!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (error) {
      console.error(error);
    }
    setSaving(false);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-8">Your Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Column: Avatar & Basic Info */}
        <div className="md:col-span-1 space-y-6">
          <div className="glass-card p-6 text-center">
            <div className="w-24 h-24 rounded-full bg-health-100 dark:bg-health-900/30 flex items-center justify-center mx-auto mb-4 border-4 border-white dark:border-slate-800 shadow-lg">
              <User className="h-12 w-12 text-health-500" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white truncate">
              {currentUser?.displayName || 'Wellness User'}
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 truncate">
              {currentUser?.email || 'user@example.com'}
            </p>
            <div className="mt-6 flex justify-center">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400">
                <Shield className="h-3 w-3 mr-1" /> Verified Account
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Settings */}
        <div className="md:col-span-2 space-y-6">
          
          <div className="glass-card p-6 md:p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <User className="h-5 w-5 mr-2 text-health-500" /> Personal Information
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Full Name
                </label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800/50 rounded-lg focus:ring-2 focus:ring-health-500 focus:outline-none dark:text-white transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Email Address
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-500">
                    <Mail className="h-4 w-4" />
                  </span>
                  <input 
                    type="email" 
                    disabled
                    value={currentUser?.email || 'user@example.com'}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800/50 rounded-r-lg text-slate-500 dark:text-slate-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between">
                <button 
                  onClick={handleSave}
                  disabled={saving || name === currentUser?.displayName}
                  className="px-6 py-2 bg-health-500 text-white font-medium rounded-lg hover:bg-health-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {saving ? 'Saving...' : 'Save Profile'}
                </button>
                {successMsg && (
                  <span className="text-sm text-emerald-500 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-1" /> {successMsg}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="glass-card p-6 md:p-8">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-6 flex items-center">
              <Bell className="h-5 w-5 mr-2 text-health-500" /> Preferences
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">Daily Check-In Reminders</p>
                  <p className="text-xs text-slate-500">Get an email reminding you to log your daily wellness.</p>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-health-500 focus:ring-offset-2 bg-health-500">
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900 dark:text-white">AI Burnout Alerts</p>
                  <p className="text-xs text-slate-500">Receive critical alerts if your burnout risk becomes High.</p>
                </div>
                <button className="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-health-500 focus:ring-offset-2 bg-health-500">
                  <span className="translate-x-5 pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out"></span>
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
