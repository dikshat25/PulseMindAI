import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, Heart, Shield, Mail } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="glass border-t border-slate-200 dark:border-slate-700/50 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand Col */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <Activity className="h-6 w-6 text-health-500 animate-heartbeat" />
              <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white">
                PulseMind <span className="text-health-500">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
              Predictive mental wellness powered by AI. Designed to prevent burnout and promote SDG 3: Good Health and Well-Being.
            </p>
          </div>

          {/* Links Col */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
              Platform
            </h3>
            <ul className="space-y-3">
              <li>
                <Link to="/about" className="text-sm text-slate-500 hover:text-health-500 transition-colors">About Us</Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-sm text-slate-500 hover:text-health-500 transition-colors">Dashboard</Link>
              </li>
              <li>
                <Link to="/check-in" className="text-sm text-slate-500 hover:text-health-500 transition-colors">Daily Check-In</Link>
              </li>
            </ul>
          </div>

          {/* Legal Col */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
              Legal
            </h3>
            <ul className="space-y-3">
              <li>
                <span className="text-sm text-slate-500 hover:text-health-500 transition-colors cursor-pointer">Privacy Policy</span>
              </li>
              <li>
                <span className="text-sm text-slate-500 hover:text-health-500 transition-colors cursor-pointer">Terms of Service</span>
              </li>
            </ul>
          </div>

          {/* Contact Col */}
          <div className="col-span-1">
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white tracking-wider uppercase mb-4">
              Connect
            </h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@pulsemind.ai" className="text-sm text-slate-500 hover:text-health-500 transition-colors flex items-center">
                  <Mail className="h-4 w-4 mr-2" /> support@pulsemind.ai
                </a>
              </li>
              <li className="flex items-center text-sm text-slate-500 mt-4">
                <Shield className="h-4 w-4 mr-2 text-health-500" /> Data is secure & encrypted
              </li>
            </ul>
          </div>

        </div>
        
        <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">
            &copy; {currentYear} PulseMind AI. All rights reserved.
          </p>
          <p className="text-sm text-slate-400 mt-4 md:mt-0 flex items-center">
            Made with <Heart className="h-4 w-4 text-rose-500 mx-1" /> for a healthier world.
          </p>
        </div>
      </div>
    </footer>
  );
}
