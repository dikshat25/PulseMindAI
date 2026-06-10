import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Activity } from 'lucide-react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setMessage('');
      setError('');
      setLoading(true);
      await resetPassword(email);
      setMessage('Check your inbox for further instructions');
    } catch (err) {
      setError('Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 glass-card p-10">
        <div>
          <div className="flex justify-center">
            <Activity className="h-12 w-12 text-health-500" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-slate-900 dark:text-white">
            Reset Password
          </h2>
        </div>
        
        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-xl text-sm text-center">
            {error}
          </div>
        )}
        {message && (
          <div className="bg-emerald-50 text-emerald-500 p-3 rounded-xl text-sm text-center">
            {message}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email Address
              </label>
              <input
                type="email"
                required
                className="appearance-none relative block w-full px-4 py-3 border border-slate-300 dark:border-slate-600 placeholder-slate-400 text-slate-900 dark:text-white bg-white/50 dark:bg-slate-800/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-health-500 focus:border-health-500 transition-colors"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-xl text-white bg-health-500 hover:bg-health-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-health-500 transition-colors shadow-lg shadow-health-500/30"
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
          </div>
        </form>
        
        <div className="text-center mt-4">
          <Link to="/login" className="font-medium text-health-600 hover:text-health-500 dark:text-health-400 text-sm">
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}
