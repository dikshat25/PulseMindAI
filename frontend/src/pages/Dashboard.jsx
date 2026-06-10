import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, TrendingDown, TrendingUp, Zap, Moon, Activity } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, query, where, onSnapshot, doc } from 'firebase/firestore';
import { motion } from 'framer-motion';
import { db } from '../firebase/config';
export default function Dashboard() {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);

  const [checklistProgress, setChecklistProgress] = useState(0);

  useEffect(() => {
    if (!currentUser) return;
    const userId = currentUser.uid || 'mock_user_1';
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

    // 1. Listen to Wellness Entries
    const q = query(
      collection(db, 'wellness_entries'),
      where('userId', '==', userId)
    );

    const unsubscribeWellness = onSnapshot(q, async (snapshot) => {
      try {
        const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        const sortedEntries = docs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        setEntries(sortedEntries);

        if (sortedEntries.length > 0) {
          const analyzeRes = await fetch(`${apiUrl}/ai/analyze`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              currentEntry: sortedEntries[sortedEntries.length - 1],
              previousEntries: sortedEntries.slice(0, -1)
            })
          });
          const analysisData = await analyzeRes.json();
          setAiAnalysis(analysisData);
        } else {
          setAiAnalysis(null);
        }
      } catch (error) {
        console.error("Error fetching AI analysis:", error);
      } finally {
        setLoading(false);
      }
    }, (error) => {
      console.error("Firestore Error:", error);
      setLoading(false);
    });

    // 2. Listen to Today's Checklist
    const today = new Date().toLocaleDateString('en-CA');
    const docId = `${today}_${userId}`;
    
    // We import 'doc' at the top, so we can use it here
    const unsubscribeChecklist = onSnapshot(doc(db, 'daily_checklists', docId), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        let progress = 0;
        if (data.mood) progress += 25;
        if (data.sleep) progress += 25;
        if (data.stress) progress += 25;
        if (data.energy) progress += 25;
        setChecklistProgress(progress);
      } else {
        setChecklistProgress(0);
      }
    });

    return () => {
      unsubscribeWellness();
      unsubscribeChecklist();
    };
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Activity className="h-10 w-10 text-health-500 animate-heartbeat" />
      </div>
    );
  }

  // Format data for chart
  const chartData = entries.map(entry => ({
    date: new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric' }),
    mood: entry.mood,
    sleep: entry.sleepHours,
    stress: entry.stressLevel
  })).slice(-7); // Only show last 7 entries on chart

  let progressLabel = "Ready for today's tasks!";
  if (checklistProgress === 25) progressLabel = "Getting started";
  else if (checklistProgress === 50) progressLabel = "Halfway there";
  else if (checklistProgress === 75) progressLabel = "Almost done";
  else if (checklistProgress === 100) progressLabel = "Daily wellness completed 🎉";

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex justify-between items-center mb-6">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400"
        >
          Wellness Dashboard
        </motion.h1>
        <motion.div initial={{ x: 20 }} animate={{ x: 0 }}>
          <Link to="/check-in" className="px-6 py-2.5 bg-health-500 text-white rounded-full font-medium hover:bg-health-400 shadow-lg shadow-health-500/30 transition-all hover:-translate-y-0.5">
            + Daily Check-In
          </Link>
        </motion.div>
      </div>

      {/* Wellness Progress Bar (Always Visible) */}
      <motion.div 
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="mb-8 glass-card p-5 border-l-4 border-l-health-500"
      >
        <div className="flex justify-between items-center mb-2">
          <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center">
            <Zap className="h-5 w-5 mr-2 text-yellow-500" />
            Today's Progress: {progressLabel}
          </span>
          <span className="font-bold text-health-500">{checklistProgress}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-3 shadow-inner">
          <div 
            className="bg-gradient-to-r from-health-400 to-emerald-500 h-3 rounded-full transition-all duration-1000 ease-out shadow-[0_0_10px_rgba(20,184,166,0.5)]"
            style={{ width: `${checklistProgress}%` }}
          ></div>
        </div>
      </motion.div>

      {entries.length === 0 ? (
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="glass-card p-12 text-center"
        >
          <Activity className="h-16 w-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-xl font-medium text-slate-900 dark:text-white mb-2">No data yet</h3>
          <p className="text-slate-500 mb-6">Complete your first daily check-in to generate your wellness dashboard.</p>
          <Link to="/check-in" className="px-8 py-3 bg-health-500 text-white rounded-full font-medium hover:bg-health-600 shadow-md inline-block">
            Start Check-In
          </Link>
        </motion.div>
      ) : (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {/* Top Metric Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Wellness Score */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="glass-card p-6 flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Wellness Score</p>
                <h3 className="text-4xl font-extrabold text-slate-900 dark:text-white mt-1">
                  {aiAnalysis?.wellnessScore || '--'}
                </h3>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-emerald-100 dark:bg-emerald-900/50 flex items-center justify-center text-emerald-500 shadow-inner">
                <Activity className="h-7 w-7" />
              </div>
            </motion.div>

            {/* Burnout Risk */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className={`glass-card p-6 flex items-center justify-between border-l-4 ${
              aiAnalysis?.burnoutRisk === 'High' ? 'border-l-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]' :
              aiAnalysis?.burnoutRisk === 'Medium' ? 'border-l-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-l-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.2)]'
            }`}>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Burnout Risk</p>
                <h3 className={`text-2xl font-extrabold mt-1 ${
                  aiAnalysis?.burnoutRisk === 'High' ? 'text-red-500' :
                  aiAnalysis?.burnoutRisk === 'Medium' ? 'text-yellow-500' : 'text-emerald-500'
                }`}>
                  {aiAnalysis?.burnoutRisk || 'Low'}
                </h3>
              </div>
              <div className="h-14 w-14 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-inner">
                <AlertCircle className={`h-7 w-7 ${
                  aiAnalysis?.burnoutRisk === 'High' ? 'text-red-500 animate-pulse' :
                  aiAnalysis?.burnoutRisk === 'Medium' ? 'text-yellow-500' : 'text-emerald-500'
                }`} />
              </div>
            </motion.div>

            {/* AI Analysis Summary */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="glass-card p-6 md:col-span-1 max-h-48 overflow-y-auto">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400 mb-3 flex items-center">
                <Zap className="h-4 w-4 mr-1 text-health-500" /> AI Insights
              </p>
              <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                {aiAnalysis?.analysis || 'Loading insights...'}
              </p>
            </motion.div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Chart Section */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="glass-card p-6 lg:col-span-2">
              <h3 className="text-xl font-extrabold mb-6 text-slate-900 dark:text-white">7-Day Trends</h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                    <defs>
                      <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.15" />
                      </filter>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.5} />
                    <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dy={10} />
                    <YAxis yAxisId="left" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dx={-10} />
                    <YAxis yAxisId="right" orientation="right" tick={{ fill: '#64748b', fontSize: 12 }} axisLine={false} tickLine={false} dx={10} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.5)', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)', padding: '12px' }}
                      itemStyle={{ fontWeight: 600 }}
                    />
                    <Line yAxisId="left" type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 7 }} name="Mood" filter="url(#shadow)" />
                    <Line yAxisId="left" type="monotone" dataKey="stress" stroke="#ef4444" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 7 }} name="Stress" filter="url(#shadow)" />
                    <Line yAxisId="right" type="monotone" dataKey="sleep" stroke="#3b82f6" strokeWidth={4} dot={{ r: 5, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 7 }} name="Sleep (hrs)" filter="url(#shadow)" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </motion.div>

            {/* Recommendations */}
            <motion.div variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1 } }} className="glass-card p-6">
              <h3 className="text-xl font-extrabold mb-5 text-slate-900 dark:text-white flex items-center">
                <Zap className="h-5 w-5 mr-2 text-amber-500" />
                Personalized Advice
              </h3>
              <div className="space-y-4">
                {aiAnalysis?.recommendations?.map((rec, idx) => (
                  <motion.div 
                    whileHover={{ scale: 1.02 }}
                    key={idx} 
                    className="flex items-start space-x-3 bg-white/60 dark:bg-slate-800/60 p-4 rounded-2xl shadow-sm border border-white/50 dark:border-slate-700/50"
                  >
                    <div className="flex-shrink-0 mt-0.5">
                      <div className="h-2.5 w-2.5 rounded-full bg-gradient-to-br from-health-400 to-emerald-500 mt-1.5 shadow-sm" />
                    </div>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-200 leading-relaxed">{rec}</p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
