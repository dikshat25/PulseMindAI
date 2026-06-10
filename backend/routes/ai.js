const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { predictBurnoutRisk } = require('../utils/burnoutPredictor');

// Initialize Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'dummy_key');

router.post('/analyze', async (req, res) => {
  try {
    const { currentEntry, previousEntries } = req.body;
    
    // Use rule-based predictor as fallback or primary if API key is dummy
    const fallbackRisk = predictBurnoutRisk([ ...previousEntries, currentEntry ]);
    
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_gemini_key') {
      // Mock response for testing without actual API key
      return res.status(200).json({
        wellnessScore: 78,
        burnoutRisk: fallbackRisk,
        analysis: "Based on your recent logs, you are maintaining a relatively stable mood, but sleep has been fluctuating. Keep an eye on your stress levels.",
        recommendations: [
          "Try to maintain a consistent sleep schedule.",
          "Consider a 5-minute breathing exercise when stress peaks.",
          "Your journaling shows positivity; keep it up!"
        ]
      });
    }

    let jsonResult;
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
      const prompt = `
        You are an expert AI mental health and wellness analyzer.
        Analyze the following wellness data for a user to predict burnout and provide insights.
        Current Entry: ${JSON.stringify(currentEntry)}
        Previous Entries (last 7 days): ${JSON.stringify(previousEntries)}
        
        Respond strictly in JSON format with the following structure:
        {
          "wellnessScore": <number 1-100>,
          "burnoutRisk": "<Low | Medium | High>",
          "analysis": "<short paragraph analyzing emotional trends and stress patterns>",
          "recommendations": ["<recommendation 1>", "<recommendation 2>", "<recommendation 3>"]
        }
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      jsonResult = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
    } catch (error) {
      console.error("Gemini API call failed, using fallback:", error.message);
      jsonResult = {
          wellnessScore: 75,
          burnoutRisk: fallbackRisk,
          analysis: "Unable to generate AI response. Using fallback analysis. Your stress seems manageable but monitor your sleep.",
          recommendations: ["Maintain regular sleep.", "Take breaks during work.", "Stay hydrated."]
      };
    }

    res.status(200).json(jsonResult);
  } catch (error) {
    console.error("AI Analysis Error:", error);
    res.status(500).json({ error: error.message });
  }
});

router.post('/chat', async (req, res) => {
    try {
        const { message, userHistory } = req.body;
        
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_gemini_key') {
            return res.status(200).json({ reply: "I am your mock AI Wellness Coach. Since my API key is a dummy, I'm just acknowledging your message: '" + message + "'. Remember to take deep breaths!" });
        }

        try {
          const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
          
          // Gemini requires history to start with 'user'. Find the first user message.
          let validHistory = userHistory.map(msg => ({
              role: msg.role === 'user' ? 'user' : 'model',
              parts: [{ text: msg.content }]
          }));
          
          // Remove any leading 'model' messages
          while (validHistory.length > 0 && validHistory[0].role === 'model') {
              validHistory.shift();
          }

          const chat = model.startChat({
              history: validHistory
          });

          const prompt = `As a compassionate and empathetic AI Wellness Coach, respond to the user: ${message}`;
          const result = await chat.sendMessage(prompt);
          const response = result.response.text();

          res.status(200).json({ reply: response });
        } catch (error) {
          console.error("Chat Error, falling back:", error.message);
          res.status(200).json({ reply: "I am your mock AI Wellness Coach. I couldn't connect to the AI model right now, but I hear you saying: '" + message + "'. How can I support you further?" });
        }
    } catch (error) {
        console.error("Chat Route Error:", error);
        res.status(500).json({ error: error.message });
    }
});

router.get('/weekly-report/:userId', async (req, res) => {
    // Mocking weekly report for now
    res.status(200).json({
        report: "Your sleep decreased by 10% this week. Stress increased slightly by 5%. Focus on winding down earlier.",
        burnoutRisk: "Medium",
        generatedAt: new Date().toISOString()
    });
});

router.post('/journal-analysis', async (req, res) => {
    try {
        const { journalText } = req.body;
        
        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'dummy_gemini_key') {
            return res.status(200).json({ 
                mood: "Neutral", 
                message: "Thank you for sharing your thoughts today. Writing is a great way to process your feelings." 
            });
        }

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-3.1-flash-lite" });
            const prompt = `
                You are an empathetic AI wellness coach. Read the following journal entry and determine the primary mood.
                Journal Entry: "${journalText}"
                
                Respond strictly in JSON format with exactly this structure:
                {
                  "mood": "<choose exactly one: Happy | Sad | Stressed | Neutral>",
                  "message": "<a short, supportive 1-2 sentence response validating their feelings>"
                }
            `;

            const result = await model.generateContent(prompt);
            const responseText = result.response.text();
            
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            const jsonResult = JSON.parse(jsonMatch ? jsonMatch[0] : responseText);
            
            res.status(200).json(jsonResult);
        } catch (error) {
            console.error("Gemini API call failed for journal, using fallback:", error.message);
            res.status(200).json({
                mood: "Neutral",
                message: "Thanks for checking in today. Keep up the good habit of journaling!"
            });
        }
    } catch (error) {
        console.error("Journal Analysis Error:", error);
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
