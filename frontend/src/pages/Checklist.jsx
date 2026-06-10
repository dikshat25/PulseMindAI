import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { CheckCircle, Heart, Moon, Activity, Battery, CheckSquare } from 'lucide-react';

export default function Checklist() {
  const { currentUser } = useAuth();
  const [checklist, setChecklist] = useState({
    mood: false,
    sleep: false,
    stress: false,
    energy: false
  });
  const [loading, setLoading] = useState(true);

  const getTodayDocId = () => {
    const today = new Date().toLocaleDateString('en-CA');
    const userId = currentUser?.uid || 'mock_user_1';
    return `${today}_${userId}`;
  };

  useEffect(() => {
    const fetchChecklist = async () => {
      if (!currentUser) return;
      try {
        const docRef = doc(db, 'daily_checklists', getTodayDocId());
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setChecklist(docSnap.data());
        }
      } catch (error) {
        console.error("Error fetching checklist:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChecklist();
  }, [currentUser]);

  const toggleTask = async (taskName) => {
    const newValue = !checklist[taskName];
    const newChecklist = { ...checklist, [taskName]: newValue };
    setChecklist(newChecklist);

    try {
      const docRef = doc(db, 'daily_checklists', getTodayDocId());
      await setDoc(docRef, { 
        ...newChecklist, 
        userId: currentUser?.uid || 'mock_user_1', 
        timestamp: new Date().toISOString() 
      }, { merge: true });
    } catch (error) {
      console.error("Error updating checklist:", error);
      setChecklist(checklist);
    }
  };

  const calculateProgress = () => {
    let progress = 0;
    if (checklist.mood) progress += 25;
    if (checklist.sleep) progress += 25;
    if (checklist.stress) progress += 25;
    if (checklist.energy) progress += 25;
    return progress;
  };

  const progressPercent = calculateProgress();

  if (loading) {
    return <div className="flex justify-center items-center h-64"><Activity className="animate-spin h-8 w-8 text-health-500" /></div>;
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
    >
      <div className="text-center mb-10">
        <motion.h1 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 mb-3 flex items-center justify-center"
        >
          <CheckSquare className="h-8 w-8 mr-3 text-health-500" />
          Daily Wellness Checklist
        </motion.h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Check off these quick tasks to build your daily progress.
        </p>
      </div>

      <div className="glass-card p-8 md:p-10 shadow-2xl border border-white/60 dark:border-slate-700/60 mb-8">
        
        {/* Progress Bar inside Checklist for immediate feedback */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-2">
            <span className="font-bold text-slate-800 dark:text-slate-200">Daily Progress</span>
            <span className="font-bold text-health-500">{progressPercent}%</span>
          </div>
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-4 shadow-inner">
            <div 
              className="bg-gradient-to-r from-health-400 to-emerald-500 h-4 rounded-full transition-all duration-700 ease-out shadow-[0_0_10px_rgba(20,184,166,0.5)]"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>
        </div>

        <div className="space-y-4">
          <TaskItem 
            id="mood" 
            title="Log Your Mood" 
            icon={<Heart className="h-6 w-6 text-rose-500" />} 
            checked={checklist.mood} 
            onChange={() => toggleTask('mood')} 
          />
          <TaskItem 
            id="sleep" 
            title="Log Your Sleep" 
            icon={<Moon className="h-6 w-6 text-blue-500" />} 
            checked={checklist.sleep} 
            onChange={() => toggleTask('sleep')} 
          />
          <TaskItem 
            id="stress" 
            title="Log Your Stress Level" 
            icon={<Activity className="h-6 w-6 text-orange-500" />} 
            checked={checklist.stress} 
            onChange={() => toggleTask('stress')} 
          />
          <TaskItem 
            id="energy" 
            title="Log Your Energy Level" 
            icon={<Battery className="h-6 w-6 text-yellow-500" />} 
            checked={checklist.energy} 
            onChange={() => toggleTask('energy')} 
          />
        </div>
      </div>
    </motion.div>
  );
}

function TaskItem({ id, title, icon, checked, onChange }) {
  return (
    <motion.div 
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onChange}
      className={`flex items-center p-4 rounded-2xl cursor-pointer border-2 transition-all shadow-sm ${
        checked 
          ? 'bg-health-50 dark:bg-health-900/20 border-health-500' 
          : 'bg-white/50 dark:bg-slate-800/50 border-transparent hover:border-slate-300 dark:hover:border-slate-600'
      }`}
    >
      <div className="flex-shrink-0 mr-4">
        {icon}
      </div>
      <div className="flex-grow">
        <h3 className={`text-lg font-bold transition-colors ${checked ? 'text-health-700 dark:text-health-400' : 'text-slate-800 dark:text-slate-200'}`}>
          {title}
        </h3>
      </div>
      <div className="flex-shrink-0">
        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors ${
          checked ? 'bg-health-500 border-health-500' : 'bg-transparent border-slate-300 dark:border-slate-600'
        }`}>
          {checked && <CheckCircle className="w-6 h-6 text-white" />}
        </div>
      </div>
    </motion.div>
  );
}
