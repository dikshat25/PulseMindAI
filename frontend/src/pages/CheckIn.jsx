import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Battery, Moon, Heart, Edit3 } from 'lucide-react';
import { collection, addDoc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';

export default function CheckIn() {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [mood, setMood] = useState(5);
  const [sleep, setSleep] = useState(7);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [journal, setJournal] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const payload = {
        userId: currentUser?.uid || 'mock_user_1',
        mood: Number(mood),
        sleepHours: Number(sleep),
        stressLevel: Number(stress),
        energyLevel: Number(energy),
        journalText: journal,
        timestamp: new Date().toISOString()
      };

      await addDoc(collection(db, 'wellness_entries'), payload);
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center mb-10">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-3"
        >
          Daily Check-In
        </motion.h1>
        <motion.p 
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-lg text-slate-600 dark:text-slate-400"
        >
          Take a moment for yourself. How are you doing today?
        </motion.p>
      </div>

      <motion.form 
        onSubmit={handleSubmit} 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8 glass-card p-8 md:p-10 shadow-2xl border border-white/60 dark:border-slate-700/60"
      >
        
        {/* Mood Slider */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-lg font-semibold flex items-center text-slate-800 dark:text-slate-200">
              <Heart className="h-6 w-6 mr-2 text-rose-500" /> Overall Mood
            </label>
            <span className="text-2xl font-black text-rose-500">{mood}<span className="text-sm font-medium text-slate-400">/10</span></span>
          </div>
          <input 
            type="range" min="1" max="10" value={mood} 
            onChange={(e) => setMood(e.target.value)}
            className="w-full accent-rose-500 hover:accent-rose-400 transition-all"
          />
          <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
            <span>Terrible</span>
            <span>Amazing</span>
          </div>
        </motion.div>

        {/* Stress Slider */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-lg font-semibold flex items-center text-slate-800 dark:text-slate-200">
              <Activity className="h-6 w-6 mr-2 text-orange-500" /> Stress Level
            </label>
            <span className="text-2xl font-black text-orange-500">{stress}<span className="text-sm font-medium text-slate-400">/10</span></span>
          </div>
          <input 
            type="range" min="1" max="10" value={stress} 
            onChange={(e) => setStress(e.target.value)}
            className="w-full accent-orange-500 hover:accent-orange-400 transition-all"
          />
          <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
            <span>Very Relaxed</span>
            <span>Overwhelmed</span>
          </div>
        </motion.div>

        {/* Energy Slider */}
        <motion.div variants={itemVariants} className="space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-lg font-semibold flex items-center text-slate-800 dark:text-slate-200">
              <Battery className="h-6 w-6 mr-2 text-yellow-500" /> Energy Level
            </label>
            <span className="text-2xl font-black text-yellow-500">{energy}<span className="text-sm font-medium text-slate-400">/10</span></span>
          </div>
          <input 
            type="range" min="1" max="10" value={energy} 
            onChange={(e) => setEnergy(e.target.value)}
            className="w-full accent-yellow-500 hover:accent-yellow-400 transition-all"
          />
          <div className="flex justify-between text-xs text-slate-500 font-medium px-1">
            <span>Exhausted</span>
            <span>Energized</span>
          </div>
        </motion.div>

        {/* Sleep Input */}
        <motion.div variants={itemVariants} className="space-y-4">
          <label className="text-lg font-semibold flex items-center text-slate-800 dark:text-slate-200">
            <Moon className="h-6 w-6 mr-2 text-blue-500" /> Hours of Sleep
          </label>
          <div className="flex items-center space-x-4 bg-white/40 dark:bg-slate-800/40 p-4 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm">
            <input 
              type="number" min="0" max="24" step="0.5" value={sleep} 
              onChange={(e) => setSleep(e.target.value)}
              className="w-24 px-4 py-3 text-center text-2xl font-black border-2 border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-900 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none dark:text-white transition-all shadow-inner"
            />
            <span className="text-slate-600 dark:text-slate-400 font-medium text-lg">hours last night</span>
          </div>
        </motion.div>

        {/* Journal */}
        <motion.div variants={itemVariants} className="space-y-3">
          <label className="text-lg font-semibold flex items-center text-slate-800 dark:text-slate-200">
            <Edit3 className="h-6 w-6 mr-2 text-purple-500" /> Journal (Optional)
          </label>
          <textarea 
            rows="4" value={journal}
            onChange={(e) => setJournal(e.target.value)}
            placeholder="How are you feeling? Any specific thoughts or worries?"
            className="w-full px-5 py-4 text-base border-2 border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none dark:text-white resize-none transition-all shadow-inner placeholder:text-slate-400"
          ></textarea>
        </motion.div>

        <motion.div variants={itemVariants} className="pt-4">
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit" disabled={loading}
            className="w-full py-5 bg-gradient-to-r from-health-500 to-emerald-400 text-white text-xl font-bold rounded-2xl shadow-[0_10px_25px_rgba(20,184,166,0.4)] hover:shadow-[0_15px_35px_rgba(20,184,166,0.6)] transition-all flex items-center justify-center disabled:opacity-70"
          >
            {loading ? (
              <span className="flex items-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Saving Entry...
              </span>
            ) : 'Complete Daily Check-In'}
          </motion.button>
        </motion.div>

      </motion.form>
    </motion.div>
  );
}
