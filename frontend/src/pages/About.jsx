import React from 'react';
import { Activity, Shield, BrainCircuit, Heart, BarChart3, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function About() {
  const { currentUser } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <Activity className="h-16 w-16 text-health-500 mx-auto mb-6 animate-heartbeat" />
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 dark:text-white mb-6">
          Predicting Burnout Before It Happens
        </h1>
        <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400">
          PulseMind AI is dedicated to <strong className="text-health-500 font-semibold">SDG 3: Good Health and Well-Being</strong>. 
          We believe mental health shouldn't be reactive. By leveraging Google's Gemini AI, we help you understand your emotional patterns and predict burnout.
        </p>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
        
        <div className="glass-card p-8 rounded-3xl hover:shadow-xl transition-all duration-300">
          <div className="h-14 w-14 rounded-2xl bg-health-100 dark:bg-health-900/30 flex items-center justify-center mb-6">
            <BrainCircuit className="h-7 w-7 text-health-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">AI-Powered Insights</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Our platform analyzes your daily check-ins using advanced AI models to find hidden patterns in your sleep, stress, and mood.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl hover:shadow-xl transition-all duration-300">
          <div className="h-14 w-14 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-6">
            <BarChart3 className="h-7 w-7 text-blue-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Holistic Tracking</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Log everything from sleep hours to journal entries in a seamless, Apple-inspired interface designed for tranquility.
          </p>
        </div>

        <div className="glass-card p-8 rounded-3xl hover:shadow-xl transition-all duration-300">
          <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mb-6">
            <Shield className="h-7 w-7 text-emerald-500" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">Privacy First</h3>
          <p className="text-slate-600 dark:text-slate-400">
            Your mental health data is highly sensitive. We use secure Firebase authentication and ensure your journal entries remain private.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-gradient-to-r from-health-500 to-health-600 rounded-3xl p-8 md:p-12 text-white shadow-xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
            <p className="text-health-50 text-lg mb-6 leading-relaxed">
              In today's fast-paced world, burnout is an epidemic. Traditional apps ask how you feel right now. We ask how you're trending over time. 
              By predicting emotional decline, we empower individuals to take preventative action, whether that's taking a day off, doing a breathing exercise, or speaking to a professional.
            </p>
            <div className="flex space-x-4">
              {currentUser ? (
                <Link to="/dashboard" className="px-6 py-3 bg-white text-health-600 font-bold rounded-full hover:bg-slate-50 transition-colors shadow-lg">
                  Go to Dashboard
                </Link>
              ) : (
                <Link to="/signup" className="px-6 py-3 bg-white text-health-600 font-bold rounded-full hover:bg-slate-50 transition-colors shadow-lg">
                  Join the Movement
                </Link>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center border border-white/20">
              <Heart className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">SDG 3</div>
              <div className="text-health-100 text-sm">Focus Area</div>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-2xl text-center border border-white/20">
              <Users className="h-8 w-8 text-white mx-auto mb-2" />
              <div className="text-3xl font-bold mb-1">100%</div>
              <div className="text-health-100 text-sm">User Centric</div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
