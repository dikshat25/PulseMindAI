# PulseMind AI - Mental Wellness Platform

PulseMind AI is a comprehensive, AI-powered mental wellness and burnout prediction dashboard built in alignment with the United Nations Sustainable Development Goal 3 (Good Health and Well-being). 

It provides users with real-time gamified wellness tracking, deep emotional insights, a dedicated AI-powered journaling space, and an empathetic AI Wellness Coach, all wrapped in a premium, modern interface.

---

## Core Features

### 1. Gamified Daily Checklist
Instead of generic forms, users can check off their daily wellness milestones (Mood, Sleep, Stress, Energy) individually. As each milestone is hit, an always-visible Progress Bar on the Dashboard instantly updates in 25% increments to provide immediate gratification and encourage consistency.

### 2. AI Burnout & Wellness Prediction
By analyzing a 7-day trailing average of the user's stress, mood, and sleep data, our backend Gemini 3.1 Flash Lite model predicts Burnout Risk (Low, Medium, High) and generates highly personalized actionable insights.

### 3. Sentient AI Journal
A private, distraction-free environment for users to free-write their thoughts. Upon saving, the backend AI immediately analyzes the text, assigns an emotional categorization (Happy, Sad, Stressed, Neutral), and replies instantly with an empathetic, supportive message. 

### 4. AI Wellness Coach Chatbot
An always-available, floating AI chatbot that uses dynamic context (including the user's name) to provide immediate emotional support and grounding techniques.

---

## Tech Stack

**Frontend:**
- React (Vite)
- Tailwind CSS (Premium Glassmorphism & Animated Gradients)
- Framer Motion (Page Transitions & Micro-interactions)
- Recharts (Data Visualization)
- Firebase Auth & Firestore (Real-time onSnapshot listeners)

**Backend:**
- Node.js & Express
- Firebase Admin SDK
- Google Generative AI (gemini-3.1-flash-lite for all AI inference)

---

## Local Development Setup

### 1. Prerequisites
- Node.js (v18+)
- A Google Gemini API Key
- A Firebase Project (with Firestore and Authentication enabled)

### 2. Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   npm install
   ```
2. Create a .env file in the backend folder:
   ```env
   PORT=5000
   GEMINI_API_KEY=your_google_ai_studio_key
   FIREBASE_PROJECT_ID=your_project_id
   FIREBASE_CLIENT_EMAIL=your_service_account_email
   FIREBASE_PRIVATE_KEY="your_private_key"
   ```
3. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   npm install
   ```
2. Create a .env file in the frontend folder:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_firebase_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_firebase_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_firebase_messaging_sender_id
   VITE_FIREBASE_APP_ID=your_firebase_app_id
   VITE_API_URL=http://localhost:5000/api
   ```
3. Start the frontend:
   ```bash
   npm run dev
   ```

---
Built for SDG 3: Good Health and Well-being.
