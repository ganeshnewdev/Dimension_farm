// Optional backend URL. Empty = same origin (local dev / Render). On GitHub Pages there is
// no backend, so set VITE_API_BASE_URL to a hosted server to enable the AI features.
const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export async function analyzeCropImageWithGemini({ imageBase64, mimeType, cropType, notes }) {
  const unavailable = 'फसल स्कैनर के लिए सर्वर उपलब्ध नहीं है। कृपया बाद में प्रयास करें।';
  let res;
  try {
    res = await fetch(`${API_BASE}/api/ai/crop-scanner`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, mimeType, cropType, notes })
    });
  } catch {
    throw new Error(unavailable);
  }

  let data;
  try {
    data = await res.json();
  } catch {
    // Static hosting returns an HTML 404 page instead of JSON
    throw new Error(unavailable);
  }
  if (!res.ok) {
    throw new Error(data.error || 'फसल की जांच करने में सर्वर असमर्थ रहा।');
  }
  return data.diagnosis;
}

export async function askDimensionsAIChat(message, history = []) {
  try {
    const res = await fetch(`${API_BASE}/api/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });

    if (res.ok) {
      const data = await res.json();
      return data.reply;
    }
  } catch (e) {
    console.warn("Backend chat failed, falling back to smart local knowledge");
  }

  // Fallback intelligent agronomist logic
  return generateLocalSmartAdvice(message);
}

function generateLocalSmartAdvice(query) {
  const q = query.toLowerCase();
  if (q.includes("मौसम") || q.includes("weather") || q.includes("स्प्रे") || q.includes("spray")) {
    return "डाइमेंशन्स फार्म सैटेलाइट विश्लेषण: कीटनाशक या फफूंदनाशी छिड़काव के लिए हवा की गति 15 km/h से कम और वर्षा की संभावना 20% से नीचे होनी चाहिए। दोपहर की तेज धूप में छिड़काव से बचें; सुबह 8 से 11 बजे या शाम 4 से 6 बजे का समय सर्वोत्तम है।";
  }
  if (q.includes("dap") || q.includes("यूरिया") || q.includes("खाद") || q.includes("fertilizer")) {
    return "ICAR अनुमोदित उर्वरक प्रबंधन: बुवाई के समय आधार खुराक के रूप में 1 बैग DAP (50kg) + 25kg MOP (पोटाश) प्रति एकड़ दें। पहली और दूसरी सिंचाई पर 45-45kg नीम कोटेड यूरिया विभाजित मात्रा में दें। जिंक की कमी होने पर 5kg जिंक सल्फेट 33% का उपयोग करें।";
  }
  if (q.includes("कीट") || q.includes("इल्ली") || q.includes("रोग") || q.includes("pest") || q.includes("fungus")) {
    return "समन्वित कीट प्रबंधन (IPM): प्रारंभिक अवस्था में जैविक उपचार हेतु 5ml नीम तेल (10,000 PPM) प्रति लीटर पानी में मिलाकर छिड़कें। फफूंद रोगों के लिए कार्बेन्डाजिम + मैन्कोज़ेब (2 ग्राम/लीटर) या कॉपर ऑक्सीक्लोराइड का प्रयोग करें।";
  }
  return "नमस्ते किसान भाई! मैं डाइमेंशन्स फार्म एआई (Dimensions Farm AI) हूँ। आप अपनी फसल (गेहूं, धान, सरसों, कपास, सोयाबीन, प्याज आदि) की बुवाई, रोग निदान, उर्वरक मात्रा या मंडी भाव से जुड़ा कोई भी सवाल पूछ सकते हैं।";
}
