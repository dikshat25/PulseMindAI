const express = require('express');
const router = express.Router();
const { db } = require('../firebase');

// Save a new wellness entry
router.post('/wellness-entry', async (req, res) => {
  try {
    const { userId, mood, sleepHours, stressLevel, energyLevel, journalText, timestamp } = req.body;
    
    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    const entry = {
      userId,
      mood: Number(mood),
      sleepHours: Number(sleepHours),
      stressLevel: Number(stressLevel),
      energyLevel: Number(energyLevel),
      journalText,
      timestamp: timestamp || new Date().toISOString()
    };

    if (db) {
      await db.collection('wellness_entries').add(entry);
    } else {
      console.log('Mock saving entry:', entry);
    }
    
    res.status(201).json({ message: 'Wellness entry saved successfully', entry });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get all entries for a user
router.get('/entries/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (db) {
      const snapshot = await db.collection('wellness_entries')
                               .where('userId', '==', userId)
                               .get();
      
      const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const entries = docs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      res.status(200).json({ entries });
    } else {
      // Return mock data for testing UI before Firebase is fully configured
      res.status(200).json({
        entries: [
          { id: '1', mood: 7, sleepHours: 7, stressLevel: 4, energyLevel: 6, timestamp: new Date().toISOString(), journalText: 'Good day' },
          { id: '2', mood: 5, sleepHours: 4, stressLevel: 8, energyLevel: 3, timestamp: new Date(Date.now() - 86400000).toISOString(), journalText: 'Tired and stressed' }
        ]
      });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
