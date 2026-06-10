import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Brain, Shield, TrendingUp, ArrowRight } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-health-300/30 dark:bg-health-900/30 rounded-full blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-300/30 dark:bg-emerald-900/30 rounded-full blur-3xl" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-32">
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="flex justify-center mb-6"
          >
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card text-health-600 dark:text-health-400 font-medium text-sm">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-health-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-health-500"></span>
              </span>
              <span>Predicting Burnout Before It Happens (SDG 3)</span>
            </div>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8"
          >
            Mental Wellness, <br />
            <span className="text-gradient">Redefined by AI.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-12"
          >
            Most apps ask how you feel today. PulseMind AI predicts how you'll feel next week. Stop burnout before it starts.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/signup" className="group flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-white bg-health-500 hover:bg-health-600 transition-all shadow-xl shadow-health-500/30 hover:shadow-health-500/50">
              Start Your Journey
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link to="/login" className="flex items-center justify-center px-8 py-4 text-lg font-medium rounded-full text-slate-700 dark:text-white glass hover:bg-white/50 dark:hover:bg-slate-800/50 transition-all">
              Sign In
            </Link>
          </motion.div>
        </div>

        {/* Feature Cards */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Brain className="h-8 w-8 text-health-500" />}
            title="Predictive AI"
            description="Our advanced Gemini AI analyzes your daily metrics to forecast burnout risk up to 7 days in advance."
            delay={0.4}
          />
          <FeatureCard 
            icon={<Activity className="h-8 w-8 text-emerald-500" />}
            title="Holistic Tracking"
            description="Log your sleep, stress, energy, and mood in seconds. The more you log, the smarter it gets."
            delay={0.5}
          />
          <FeatureCard 
            icon={<Shield className="h-8 w-8 text-blue-500" />}
            title="Private & Secure"
            description="Your mental health data is encrypted and securely stored. We prioritize your privacy above all."
            delay={0.6}
          />
        </div>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay }}
      className="glass-card p-8 hover:-translate-y-2 transition-transform duration-300"
    >
      <div className="h-14 w-14 rounded-2xl bg-slate-50 dark:bg-slate-800/50 flex items-center justify-center mb-6 shadow-inner">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-slate-600 dark:text-slate-400">{description}</p>
    </motion.div>
  );
}
