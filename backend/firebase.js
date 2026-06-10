const { initializeApp, cert, getApps } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const dotenv = require('dotenv');
dotenv.config();

let db = null;

if (getApps().length === 0) {
  try {
    // Only attempt to initialize if we don't have dummy values
    if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_PROJECT_ID !== 'dummy_project_id') {
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      };

      initializeApp({
        credential: cert(serviceAccount)
      });
      console.log('Firebase Admin initialized successfully.');
      db = getFirestore();
    } else {
      console.log('Using dummy Firebase credentials. Real database operations will be mocked.');
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
  }
} else {
  db = getFirestore();
}

module.exports = { db };
