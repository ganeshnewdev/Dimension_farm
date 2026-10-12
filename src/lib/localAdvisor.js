// Offline agronomy answers used when the AI backend is not reachable (e.g. on static
// hosting). General guidance only; every chemical recommendation says to confirm locally.

const KVK_HI = '\n\n⚠️ रसायन प्रयोग से पहले लेबल पढ़ें और नजदीकी कृषि विज्ञान केंद्र (KVK) से पुष्टि करें।';
const KVK_EN = '\n\n⚠️ Read the label and confirm with your nearest Krishi Vigyan Kendra (KVK) before using any chemical.';

const ENTRIES = [
  {
    id: 'yellowRust',
    keywords: ['रतुआ', 'पीला रतुआ', 'rust', 'yellow rust', 'पीली धारियां', 'yellow stripe'],
    hi: 'गेहूं में पीला रतुआ: पत्तियों पर पीली धारियां बनती हैं और हाथ लगाने पर पीला चूर्ण चिपकता है। ठंडा व नम मौसम इसे बढ़ाता है।\n• प्रोपिकोनाज़ोल 25 EC @ 1 मिली/लीटर पानी का छिड़काव करें, 15 दिन बाद दोहराएं।\n• प्रतिरोधी किस्में लगाएं और खेत की नियमित निगरानी करें।',
    en: 'Yellow rust in wheat: yellow stripes on leaves and a yellow powder that rubs off. Cool, humid weather favours it.\n• Spray propiconazole 25 EC @ 1 ml/litre of water and repeat after 15 days.\n• Grow resistant varieties and scout the field regularly.',
    chem: true,
  },
  {
    id: 'fertilizer',
    keywords: ['dap', 'यूरिया', 'urea', 'खाद', 'उर्वरक', 'fertilizer', 'fertiliser', 'npk', 'पोटाश', 'mop'],
    hi: 'गेहूं के लिए प्रति एकड़ सामान्य अनुशंसा (मिट्टी जांच अनुसार बदलें):\n• बुवाई पर: 1 बैग DAP (50 किग्रा) + लगभग 25 किग्रा MOP (पोटाश)।\n• यूरिया: लगभग 45 किग्रा पहली सिंचाई (CRI) पर और 45 किग्रा कल्ले फूटते समय।\n• जिंक की कमी होने पर 5 किग्रा जिंक सल्फेट डालें। मिट्टी जांच (Soil Health Card) से मात्रा तय करना सबसे सही है।',
    en: 'General per-acre guidance for wheat (adjust with a soil test):\n• At sowing: 1 bag DAP (50 kg) + about 25 kg MOP (potash).\n• Urea: about 45 kg at the first irrigation (CRI) and 45 kg at tillering.\n• If zinc is deficient, add 5 kg zinc sulphate. A soil test (Soil Health Card) is the best way to fix quantities.',
  },
  {
    id: 'spray',
    keywords: ['स्प्रे', 'छिड़काव', 'spray', 'कीटनाशक', 'pesticide', 'मौसम', 'weather', 'हवा', 'wind'],
    hi: 'छिड़काव का सही समय: हवा 15 किमी/घंटा से कम, अगले 24 घंटे में बारिश की संभावना 20% से कम, और सुबह 8-11 बजे या शाम 4-6 बजे। तेज धूप व तेज हवा में छिड़काव न करें। ऊपर के मौसम कार्ड में "छिड़काव सलाह" देखें।',
    en: 'Best spraying conditions: wind below 15 km/h, rain chance under 20% in the next 24 hours, and between 8-11 am or 4-6 pm. Avoid strong sun and wind. See the "Spray advisory" card on the weather panel.',
  },
  {
    id: 'pest',
    keywords: ['कीट', 'इल्ली', 'सुंडी', 'रोग', 'pest', 'insect', 'fungus', 'फफूंद', 'disease', 'ipm'],
    hi: 'समन्वित कीट प्रबंधन (IPM):\n• शुरुआत में नीम तेल (10,000 PPM) @ 5 मिली/लीटर पानी का छिड़काव करें।\n• फेरोमोन/चिपचिपे ट्रैप लगाकर निगरानी करें।\n• आर्थिक हानि स्तर पार होने पर ही अनुशंसित रसायन प्रयोग करें।\n• फफूंद रोगों के लिए पत्तियों के लक्षण की फोटो "AI क्रॉप स्कैनर" में जांचें।',
    en: 'Integrated pest management (IPM):\n• Start with neem oil (10,000 PPM) @ 5 ml/litre of water.\n• Use pheromone / sticky traps for monitoring.\n• Use recommended chemicals only once the economic threshold is crossed.\n• For fungal problems, upload a leaf photo to the AI Crop Scanner.',
    chem: true,
  },
  {
    id: 'irrigation',
    keywords: ['सिंचाई', 'पानी', 'irrigation', 'water', 'ड्रिप', 'drip'],
    hi: 'सिंचाई की सामान्य सलाह:\n• गेहूं: पहली सिंचाई बुवाई के लगभग 21 दिन बाद (CRI), फिर कल्ले फूटने, गांठ बनने, बाली निकलने व दूधिया अवस्था पर।\n• सुबह या शाम को सिंचाई करें; बारिश की संभावना हो तो सिंचाई टाल दें।\n• ड्रिप/स्प्रिंकलर से 30-50% तक पानी की बचत होती है। "फसल सलाह" पेज पर फसल-वार चक्र देखें।',
    en: 'General irrigation guidance:\n• Wheat: first irrigation ~21 days after sowing (CRI), then at tillering, jointing, flowering and milking stage.\n• Irrigate in the morning or evening; postpone if rain is likely.\n• Drip / sprinkler can save 30-50% water. See crop-wise schedules on the Crop Advisory page.',
  },
  {
    id: 'onion',
    keywords: ['प्याज', 'onion', 'कंद', 'bulb'],
    hi: 'प्याज के कंद का आकार बढ़ाने के लिए:\n• रोपाई के 45 दिन बाद नाइट्रोजन कम करें; पोटाश व सल्फर संतुलित रखें।\n• कंद बनते समय 7-10 दिन पर नियमित हल्की सिंचाई करें, खुदाई से 15 दिन पहले बंद करें।\n• थ्रिप्स और बैंगनी धब्बा रोग की निगरानी करें।',
    en: 'To improve onion bulb size:\n• Reduce nitrogen after ~45 days of transplanting; keep potash and sulphur balanced.\n• Give steady light irrigation every 7-10 days at bulbing and stop 15 days before harvest.\n• Watch for thrips and purple blotch.',
    chem: true,
  },
  {
    id: 'mustard',
    keywords: ['सरसों', 'mustard', 'माहू', 'चेपा', 'aphid'],
    hi: 'सरसों में माहू (चेपा): फूल व फली अवस्था में पत्तियों के नीचे छोटे कीट दिखें तो शुरू में नीम तेल का छिड़काव करें। संख्या अधिक होने पर डाइमेथोएट 30 EC @ 1 मिली/लीटर पानी का छिड़काव शाम को करें (मधुमक्खियों की सुरक्षा हेतु)।',
    en: 'Aphids in mustard: if small insects cluster under leaves at flowering / podding, start with neem oil. If numbers are high, spray dimethoate 30 EC @ 1 ml/litre of water in the evening (to protect bees).',
    chem: true,
  },
  {
    id: 'soybean',
    keywords: ['सोयाबीन', 'soybean', 'soya', 'मोज़ेक', 'mosaic', 'ymv'],
    hi: 'सोयाबीन में पीला मोज़ेक वायरस सफेद मक्खी से फैलता है।\n• संक्रमित पौधों को शुरू में ही उखाड़कर नष्ट करें।\n• सफेद मक्खी की निगरानी के लिए पीले चिपचिपे ट्रैप लगाएं।\n• प्रतिरोधी किस्में चुनें और अनुशंसित कीटनाशक KVK की सलाह से प्रयोग करें।',
    en: 'Yellow mosaic virus in soybean is spread by whitefly.\n• Uproot and destroy infected plants early.\n• Use yellow sticky traps to monitor whitefly.\n• Choose resistant varieties and use recommended insecticides on KVK advice.',
    chem: true,
  },
  {
    id: 'paddy',
    keywords: ['धान', 'paddy', 'rice', 'चावल', 'झोंका', 'blast'],
    hi: 'धान में झोंका (ब्लास्ट) रोग: पत्तियों पर आंख जैसे धब्बे। ट्राइसाइक्लाज़ोल 75 WP @ 0.6 ग्राम/लीटर पानी का छिड़काव करें। नाइट्रोजन का अधिक प्रयोग न करें और संतुलित सिंचाई रखें।',
    en: 'Blast in paddy: eye-shaped spots on leaves. Spray tricyclazole 75 WP @ 0.6 g/litre of water. Avoid excess nitrogen and keep water management balanced.',
    chem: true,
  },
  {
    id: 'cotton',
    keywords: ['कपास', 'cotton', 'गुलाबी सुंडी', 'bollworm', 'pink bollworm'],
    hi: 'कपास में गुलाबी सुंडी: फेरोमोन ट्रैप से निगरानी करें, डोडी में छेद व रोसेट फूल देखें। फसल अवशेष हटाएं और आर्थिक हानि स्तर पर KVK द्वारा बताए कीटनाशक का ही प्रयोग करें।',
    en: 'Pink bollworm in cotton: monitor with pheromone traps and look for bored bolls and rosetted flowers. Remove crop residue and use only the insecticide your KVK recommends once the economic threshold is reached.',
    chem: true,
  },
  {
    id: 'soil',
    keywords: ['मिट्टी', 'soil', 'ph', 'सॉइल', 'soil health', 'मृदा'],
    hi: 'मिट्टी की जांच हर 2-3 वर्ष में कराएं (Soil Health Card योजना के तहत निःशुल्क)। pH 6.5-7.5 अधिकांश फसलों के लिए अच्छा है। अम्लीय मिट्टी में चूना और क्षारीय मिट्टी में जिप्सम/जैविक खाद सुधार में मदद करते हैं।',
    en: 'Test your soil every 2-3 years (free under the Soil Health Card scheme). A pH of 6.5-7.5 suits most crops. Lime helps acidic soils; gypsum and organic manure help alkaline soils.',
  },
  {
    id: 'mandi',
    keywords: ['मंडी', 'भाव', 'mandi', 'price', 'rate', 'बेच', 'sell'],
    hi: 'बेहतर भाव के लिए: अपनी फसल का ग्रेड/नमी जांचें, 2-3 मंडियों के भाव की तुलना करें, और MSP से कम भाव पर जल्दबाजी में न बेचें। यहां "मंडी भाव" के आंकड़े नमूना हैं; वास्तविक भाव के लिए e-NAM या अपनी मंडी समिति देखें।',
    en: 'For better prices: check grade and moisture, compare 2-3 mandis, and avoid distress sales below MSP. The Mandi page here shows sample figures; for real rates check e-NAM or your mandi board.',
  },
  {
    id: 'schemes',
    keywords: ['योजना', 'scheme', 'pm kisan', 'पीएम किसान', 'बीमा', 'insurance', 'kcc', 'किसान क्रेडिट', 'loan', 'ऋण'],
    hi: 'प्रमुख सरकारी योजनाएं:\n• PM-KISAN: पात्र किसानों को ₹6,000 प्रति वर्ष (3 किस्तें)।\n• PMFBY फसल बीमा: खरीफ में 2% और रबी में 1.5% तक प्रीमियम।\n• किसान क्रेडिट कार्ड (KCC): कम ब्याज पर फसल ऋण।\nपात्रता व आवेदन के लिए नजदीकी CSC / कृषि कार्यालय से संपर्क करें।',
    en: 'Key government schemes:\n• PM-KISAN: ₹6,000 per year (3 instalments) for eligible farmers.\n• PMFBY crop insurance: farmer premium up to 2% (Kharif) and 1.5% (Rabi).\n• Kisan Credit Card (KCC): crop loans at concessional interest.\nCheck eligibility and apply via your nearest CSC / agriculture office.',
  },
];

export const KEYWORD_MATCH_MIN = 1;

export function findAdvice(query) {
  const q = String(query ?? '').toLowerCase();
  let best = null;
  let bestScore = 0;
  for (const entry of ENTRIES) {
    const score = entry.keywords.reduce((s, k) => (q.includes(k.toLowerCase()) ? s + 1 : s), 0);
    if (score > bestScore) {
      best = entry;
      bestScore = score;
    }
  }
  return bestScore >= KEYWORD_MATCH_MIN ? best : null;
}

export function getOfflineAdvice(query, lang = 'hi') {
  const entry = findAdvice(query);
  if (!entry) {
    return lang === 'hi'
      ? 'नमस्ते किसान भाई! मैं डाइमेंशन्स फार्म एआई हूँ। आप फसल, रोग-कीट, खाद की मात्रा, सिंचाई, मंडी भाव या सरकारी योजनाओं के बारे में पूछ सकते हैं। (ऑफलाइन मोड में कुछ ही विषयों के उत्तर उपलब्ध हैं।)'
      : 'Hello! I am Dimensions Farm AI. Ask me about crops, pests and diseases, fertiliser quantities, irrigation, mandi prices or government schemes. (In offline mode only some topics are available.)';
  }
  const body = lang === 'hi' ? entry.hi : entry.en;
  return entry.chem ? body + (lang === 'hi' ? KVK_HI : KVK_EN) : body;
}
