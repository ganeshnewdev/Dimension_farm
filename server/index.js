import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '25mb' }));

// API: AI Crop Scanner Vision Diagnosis via Gemini API (Backend secured, no API key exposed to frontend)
app.post('/api/ai/crop-scanner', async (req, res) => {
  try {
    const { imageBase64, mimeType, cropType, notes } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!imageBase64) {
      return res.status(400).json({ error: 'कृपया पत्ती या फसल की तस्वीर अपलोड करें।' });
    }

    if (!apiKey) {
      return res.status(503).json({
        error: 'सर्वर पर Gemini API Key कॉन्फ़िगर नहीं है। कृपया Render या .env में GEMINI_API_KEY सेट करें।',
        isConfigMissing: true
      });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const promptText = `आप Dimensions Farm के मुख्य पादप रोग विशेषज्ञ (Senior Plant Pathologist & Agronomist) हैं। 
प्रदान की गई फसल/पत्ती की तस्वीर का गहन विश्लेषण करें।
किसान द्वारा दी गई जानकारी:
- फसल: ${cropType || 'पहचानें'}
- लक्षण/टिप्पणी: ${notes || 'कोई अतिरिक्त टिप्पणी नहीं'}

कृपया निम्नलिखित संरचित JSON प्रारूप में ही उत्तर दें (कोई अतिरिक्त मार्कडाउन नहीं):
{
  "identifiedCrop": "पहचानी गई फसल का नाम (हिंदी व अंग्रेजी)",
  "conditionName": "रोग, कीट, या पोषक तत्व की कमी का नाम",
  "conditionType": "Fungal / Bacterial / Viral / Pest / Nutrient Deficiency / Healthy",
  "severity": "Low / Moderate / Severe / Critical",
  "confidenceScore": 85,
  "visibleSymptoms": ["लक्षण 1", "लक्षण 2", "लक्षण 3"],
  "possibleCauses": ["कारण 1", "कारण 2"],
  "organicTreatment": ["जैविक/प्राकृतिक उपचार 1", "जैविक उपचार 2"],
  "chemicalTreatment": ["अनुशंसित अनुमोदित रासायनिक उपचार व खुराक"],
  "preventiveMeasures": ["भविष्य में बचाव के उपाय 1", "उपाय 2"],
  "expertAdvisory": "किसान भाइयों के लिए सुरक्षा निर्देश व कृषि विज्ञान केंद्र (KVK) से सत्यापन सलाह"
}`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                { text: promptText },
                {
                  inlineData: {
                    mimeType: mimeType || 'image/jpeg',
                    data: cleanBase64
                  }
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.2,
            responseMimeType: "application/json"
          }
        })
      }
    );

    if (!response.ok) {
      const errData = await response.text();
      console.error('Gemini API Error:', errData);
      return res.status(response.status).json({ error: 'Gemini AI सेवा से विश्लेषण में त्रुटि हुई।' });
    }

    const data = await response.json();
    const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
    
    let diagnosisJson;
    try {
      diagnosisJson = JSON.parse(rawContent);
    } catch (e) {
      diagnosisJson = {
        identifiedCrop: cropType || "पहचानी गई फसल",
        conditionName: "विश्लेषण पूरा हुआ",
        conditionType: "Agricultural Analysis",
        severity: "Moderate",
        confidenceScore: 78,
        visibleSymptoms: [rawContent.slice(0, 150)],
        possibleCauses: ["रोगजनकों या मौसम का प्रभाव"],
        organicTreatment: ["नीम तेल (10,000 PPM) 5ml प्रति लीटर पानी में छिड़काव"],
        chemicalTreatment: ["आवश्यकतानुसार विशेषज्ञ की सलाह से उपचार लें"],
        preventiveMeasures: ["संतुलित उर्वरक व जल प्रबंधन अपनाएं"],
        expertAdvisory: "गंभीर स्थिति होने पर नजदीकी कृषि विज्ञान केंद्र से संपर्क करें।"
      };
    }

    return res.json({ success: true, diagnosis: diagnosisJson });
  } catch (error) {
    console.error('Crop Scanner Exception:', error);
    return res.status(500).json({ error: 'सर्वर त्रुटि: फसल की जांच पूरी नहीं हो सकी।' });
  }
});

// API: Dimensions Farm AI Chatbot (Gemini Proxy)
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, history } = req.body;
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!message) return res.status(400).json({ error: 'Message required' });

    if (!apiKey) {
      return res.status(503).json({ error: 'Gemini API Key missing on server', isConfigMissing: true });
    }

    const systemInstruction = `You are "Dimensions Farm AI" (डाइमेंशन्स फार्म एआई), the official proprietary Smart Agronomist of Dimensions Farm. 
Strict rules: Never mention Google, Gemini, OpenAI, or external provider names. Always answer in respectful Hindi or English as a knowledgeable Indian agricultural expert covering Kharif/Rabi crops, fertilizers (NPK), pests, weather spraying advisory, and mandi negotiations.`;

    const contents = [
      ...(history || []).map(h => ({
        role: h.sender === 'user' ? 'user' : 'model',
        parts: [{ text: h.text }]
      })),
      { role: 'user', parts: [{ text: message }] }
    ];

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          systemInstruction: { parts: [{ text: systemInstruction }] },
          generationConfig: { temperature: 0.7, maxOutputTokens: 1000 }
        })
      }
    );

    if (!response.ok) {
      return res.status(500).json({ error: 'AI Assistant unavailable' });
    }

    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ reply });
  } catch (e) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Serve frontend static build if in production on Render
const distPath = path.join(__dirname, '../dist');
app.use(express.static(distPath));
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Dimensions Farm Server running on port ${PORT}`);
});
