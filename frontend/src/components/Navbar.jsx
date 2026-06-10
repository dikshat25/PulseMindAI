import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Activity, Moon, Sun, User, LogOut } from 'lucide-react';

export default function Navbar() {
  const { currentUser, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="sticky top-4 z-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="glass rounded-full px-6 py-2 shadow-2xl border border-white/50 dark:border-slate-700/50">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Activity className="h-8 w-8 text-health-500 animate-heartbeat" />
              <span className="font-bold text-xl tracking-tight text-slate-900 dark:text-white">
                PulseMind <span className="text-health-500">AI</span>
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/about" className="text-sm font-medium hover:text-health-500 transition-colors hidden sm:block">
              About
            </Link>
            <button 
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              {isDarkMode ? <Sun className="h-5 w-5 text-yellow-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
            </button>

            {currentUser ? (
              <>
                <Link to="/dashboard" className="text-sm font-medium hover:text-health-500 transition-colors">
                  Dashboard
                </Link>
                <Link to="/check-in" className="text-sm font-medium hover:text-health-500 transition-colors">
                  Check-In
                </Link>
                <Link to="/checklist" className="text-sm font-medium hover:text-health-500 transition-colors">
                  Checklist
                </Link>
                <Link to="/journal" className="text-sm font-medium hover:text-health-500 transition-colors">
                  Journal
                </Link>
                <div className="relative group ml-2">
                  <button className="flex items-center space-x-1 p-2 rounded-full bg-slate-100 dark:bg-slate-800">
                    <User className="h-5 w-5" />
                  </button>
                  <div className="absolute right-0 w-48 mt-2 py-2 bg-white dark:bg-slate-800 rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-slate-200 dark:border-slate-700">
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-700">
                      <p className="text-sm font-medium truncate">{currentUser.email}</p>
                    </div>
                    <Link to="/profile" className="block w-full text-left px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50">
                      Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center space-x-2"
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-sm font-medium hover:text-health-500 transition-colors">
                  Log in
                </Link>
                <Link to="/signup" className="ml-4 px-4 py-2 rounded-full bg-health-500 text-white text-sm font-medium hover:bg-health-600 transition-colors shadow-lg shadow-health-500/30">
                  Sign up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
