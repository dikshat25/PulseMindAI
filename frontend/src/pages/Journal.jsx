import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { collection, addDoc, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/config';
import { motion } from 'framer-motion';
import { Edit3, BookOpen, Clock, Heart, Smile, Frown, Zap } from 'lucide-react';

export default function Journal() {
  const { currentUser } = useAuth();
  const [entries, setEntries] = useState([]);
  const [newEntry, setNewEntry] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiFeedback, setAiFeedback] = useState(null);

  useEffect(() => {
    if (!currentUser) return;
    const userId = currentUser.uid || 'mock_user_1';

    const q = query(
      collection(db, 'journal_entries'),
      where('userId', '==', userId)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const sortedEntries = docs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setEntries(sortedEntries);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newEntry.trim()) return;

    setLoading(true);
    setAiFeedback(null);

    const textToSubmit = newEntry;
    setNewEntry('');

    try {
      const payload = {
        userId: currentUser?.uid || 'mock_user_1',
        text: textToSubmit,
        timestamp: new Date().toISOString()
      };

      // 1. Save to Firestore
      await addDoc(collection(db, 'journal_entries'), payload);

      // 2. Run AI Analysis
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
      const response = await fetch(`${apiUrl}/ai/journal-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ journalText: textToSubmit })
      });
      
      if (!response.ok) {
        throw new Error("Backend endpoint not found. Did you restart the server?");
      }

      const data = await response.json();
      setAiFeedback(data);

    } catch (error) {
      console.error("Journal Submission Error:", error);
      setAiFeedback({
        mood: "Neutral",
        message: "⚠️ Your entry was saved, but the AI couldn't analyze it. Please restart your backend server (npm start) to enable the AI."
      });
    } finally {
      setLoading(false);
    }
  };

  const getMoodIcon = (mood) => {
    switch(mood) {
      case 'Happy': return <Smile className="h-6 w-6 text-emerald-500" />;
      case 'Sad': return <Frown className="h-6 w-6 text-blue-500" />;
      case 'Stressed': return <Zap className="h-6 w-6 text-orange-500" />;
      default: return <Heart className="h-6 w-6 text-slate-500" />;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8"
    >
      <div className="flex justify-between items-center mb-8">
        <motion.h1 
          initial={{ x: -20 }}
          animate={{ x: 0 }}
          className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-400 flex items-center"
        >
          <BookOpen className="h-8 w-8 mr-3 text-purple-500" />
          My Journal
        </motion.h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Editor Section */}
        <div className="space-y-6">
          <motion.form 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            onSubmit={handleSubmit}
            className="glass-card p-6 shadow-xl"
          >
            <label className="text-lg font-semibold flex items-center text-slate-800 dark:text-slate-200 mb-4">
              <Edit3 className="h-5 w-5 mr-2 text-purple-500" /> 
              Write your thoughts...
            </label>
            <textarea
              rows="6"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="How are you really feeling today?"
              className="w-full px-5 py-4 text-base border-2 border-slate-200 dark:border-slate-600 bg-white/70 dark:bg-slate-800/70 rounded-2xl focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20 outline-none dark:text-white resize-none transition-all shadow-inner placeholder:text-slate-400 mb-4"
              disabled={loading}
            ></textarea>
            
            <button 
              type="submit" 
              disabled={loading || !newEntry.trim()}
              className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-lg font-bold rounded-2xl shadow-[0_10px_25px_rgba(168,85,247,0.4)] hover:shadow-[0_15px_35px_rgba(168,85,247,0.6)] transition-all flex items-center justify-center disabled:opacity-50"
            >
              {loading ? 'Reflecting...' : 'Save & Analyze Entry'}
            </button>
          </motion.form>

          {/* AI Feedback Section */}
          {aiFeedback && (
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`glass-card p-6 border-l-4 ${aiFeedback.message.includes('⚠️') ? 'border-l-yellow-500' : 'border-l-purple-500'}`}
            >
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-full">
                  {getMoodIcon(aiFeedback.mood)}
                </div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                  {aiFeedback.message.includes('⚠️') ? 'Analysis Failed' : `Mood Detected: ${aiFeedback.mood}`}
                </h3>
              </div>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed italic text-lg">
                "{aiFeedback.message}"
              </p>
            </motion.div>
          )}
        </div>

        {/* History Section */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="glass-card p-6 h-[800px] flex flex-col"
          >
            <h3 className="text-xl font-extrabold mb-4 text-slate-900 dark:text-white flex items-center shrink-0">
              <Clock className="h-6 w-6 mr-2 text-slate-500" />
              Past Thoughts
            </h3>
            
            <div className="space-y-4 overflow-y-auto pr-2 flex-grow custom-scrollbar">
              {entries.length === 0 ? (
                <p className="text-sm text-slate-500 text-center py-8">No entries yet. Start writing!</p>
              ) : (
                entries.map(entry => (
                  <div key={entry.id} className="bg-white/50 dark:bg-slate-800/50 p-5 rounded-2xl border border-white/50 dark:border-slate-700/50 shadow-sm">
                    <p className="text-sm font-bold text-purple-500 dark:text-purple-400 mb-3 border-b border-slate-200 dark:border-slate-700 pb-2">
                      {new Date(entry.timestamp).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })} at {new Date(entry.timestamp).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-base text-slate-700 dark:text-slate-200 whitespace-pre-wrap leading-relaxed">
                      {entry.text}
                    </p>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}
