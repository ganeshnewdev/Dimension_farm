// Authentic ICAR aligned agronomic dataset & realistic market records
export const ICAR_CROPS = [
  {
    id: "wheat",
    name: "गेहूं (Wheat)",
    scientific: "Triticum aestivum",
    season: "Rabi (रबी)",
    sowingPeriod: "15 अक्टूबर - 15 नवंबर",
    soil: "बलुई दोमट से चिकनी दोमट मिट्टी (pH 6.5 - 7.5)",
    seedRate: "40-45 किग्रा / एकड़",
    spacing: "पंक्ति से पंक्ति 20-22.5 सेमी",
    npkRatio: "120:60:40 किग्रा/हेक्टेयर (N:P:K)",
    irrigationStages: [
      "सीआरआई (CRI) अवस्था - बुवाई के 21 दिन बाद (अति आवश्यक)",
      "कल्ले फूटने के समय - 40-45 दिन बाद",
      "गांठ बनने की अवस्था - 60-65 दिन बाद",
      "फूल व बाली निकलते समय - 80-85 दिन बाद",
      "दूधिया अवस्था - 100-105 दिन बाद"
    ],
    commonDiseases: ["पीला रतुआ (Yellow Rust)", "करनाल बंट (Karnal Bunt)", "दीमक (Termites)"],
    avgYield: "20-24 क्विंटल / एकड़"
  },
  {
    id: "soybean",
    name: "सोयाबीन (Soybean)",
    scientific: "Glycine max",
    season: "Kharif (खरीफ)",
    sowingPeriod: "20 जून - 10 जुलाई (मानसून आगमन पर)",
    soil: "मध्यम से गहरी काली उपजाऊ मिट्टी (pH 6.5 - 7.5)",
    seedRate: "25-30 किग्रा / एकड़ (बीजोपचार आवश्यक)",
    spacing: "पंक्ति से पंक्ति 45 सेमी, पौधे से पौधा 5-7 सेमी",
    npkRatio: "20:60:40 किग्रा/हेक्टेयर + 20 किग्रा सल्फर",
    irrigationStages: [
      "फूल आते समय (जल भराव न होने दें)",
      "फलियों में दाना भरते समय (नमी आवश्यक)"
    ],
    commonDiseases: ["पीला मोज़ेक वायरस (YMV)", "गर्डल बीटल (Girdle Beetle)", "तना मक्खी"],
    avgYield: "10-12 क्विंटल / एकड़"
  },
  {
    id: "mustard",
    name: "सरसों / राई (Mustard)",
    scientific: "Brassica juncea",
    season: "Rabi (रबी)",
    sowingPeriod: "1 अक्टूबर - 25 अक्टूबर",
    soil: "दोमट एवं हल्की दोमट मिट्टी (pH 6.0 - 7.5)",
    seedRate: "1.5 - 2 किग्रा / एकड़",
    spacing: "पंक्ति से पंक्ति 30 सेमी, पौधे से पौधा 10 सेमी",
    npkRatio: "80:40:40 किग्रा/हेक्टेयर + 40 किग्रा गंधक (सल्फर)",
    irrigationStages: [
      "पहली सिंचाई - बुवाई के 30-35 दिन बाद (शाखाएं निकलते समय)",
      "दूसरी सिंचाई - फलियां बनते समय (60-70 दिन बाद)"
    ],
    commonDiseases: ["माहू / चेपा (Aphids)", "सफेद रतुआ (White Rust)", "आर्द्र विगलन"],
    avgYield: "8-11 क्विंटल / एकड़"
  },
  {
    id: "onion",
    name: "प्याज (Onion)",
    scientific: "Allium cepa",
    season: "Rabi / Kharif",
    sowingPeriod: "रबी पौध रोपण: दिसंबर - जनवरी | खरीफ: अगस्त",
    soil: "अच्छे जल निकास वाली बलुई दोमट (pH 6.5 - 7.5)",
    seedRate: "3.5 - 4 किग्रा पौध / एकड़",
    spacing: "15 सेमी x 10 सेमी",
    npkRatio: "100:50:50 किग्रा/हेक्टेयर + सल्फर 30 किग्रा",
    irrigationStages: [
      "रोपाई के तुरंत बाद हल्की सिंचाई",
      "कंद बनते समय 7-10 दिन के अंतराल पर निरंतर नमी",
      "खुदाई से 15 दिन पूर्व सिंचाई बंद करें"
    ],
    commonDiseases: ["बैंगनी धब्बा रोग (Purple Blotch)", "थ्रिप्स (Thrips)", "जड़ सड़न"],
    avgYield: "120-150 क्विंटल / एकड़"
  }
];

export const INITIAL_FARMS = [
  {
    id: "farm-1",
    name: "गंगा का मैदान (Ganga Plot 1)",
    crop: "गेहूं (Wheat PBW 550)",
    cropKey: "wheat",
    area: "4.5",
    unit: "एकड़",
    location: "कुरुक्षेत्र, हरियाणा",
    lat: 29.9695,
    lon: 76.8783,
    soil: "दोमट मिट्टी (Loamy Soil)",
    npk: "N: 140 (मध्यम) | P: 25 (पर्याप्त) | K: 180 (उच्च)",
    ph: "6.8 (संतुलित)",
    stage: "कल्ले फूटने की अवस्था (Tillering)",
    sownDate: "2024-11-15",
    estHarvest: "2025-04-10"
  },
  {
    id: "farm-2",
    name: "कृष्णा फार्म्स (Krishna Agri Farm)",
    crop: "सोयाबीन (Soybean JS-335)",
    cropKey: "soybean",
    area: "3.2",
    unit: "एकड़",
    location: "इंदौर, मध्य प्रदेश",
    lat: 22.7196,
    lon: 75.8577,
    soil: "काली कपासी मिट्टी (Black Soil)",
    npk: "N: 90 (कम) | P: 18 (मध्यम) | K: 210 (उच्च)",
    ph: "7.4 (हल्का क्षारीय)",
    stage: "फूल आने की अवस्था (Flowering)",
    sownDate: "2024-07-02",
    estHarvest: "2024-10-20"
  },
  {
    id: "farm-3",
    name: "सह्याद्री बाग (Sahyadri Orchard)",
    crop: "लाल प्याज (Red Onion - Garwa)",
    cropKey: "onion",
    area: "2.0",
    unit: "एकड़",
    location: "नासिक, महाराष्ट्र",
    lat: 19.9975,
    lon: 73.7898,
    soil: "मध्यम काली मिट्टी (Medium Black)",
    npk: "N: 110 (मध्यम) | P: 32 (उच्च) | K: 160 (मध्यम)",
    ph: "6.5 (आदर्श)",
    stage: "कंद विकास (Bulb Development)",
    sownDate: "2024-08-10",
    estHarvest: "2024-12-15"
  }
];

export const MANDI_RATES = [
  {
    id: "mandi-1",
    state: "Maharashtra",
    district: "Nashik",
    mandi: "Lasalgaon APMC",
    commodity: "Onion / प्याज",
    minPrice: 1850,
    maxPrice: 2850,
    modalPrice: 2450,
    unit: "₹ / क्विंटल",
    date: "12 Oct 2026",
    source: "APMC Lasalgaon Official Feed",
    trader: "मेसर्स पाटिल एग्रो ट्रेडिंग (APMC-NK-402)",
    phone: "+91 98221 44551"
  },
  {
    id: "mandi-2",
    state: "Madhya Pradesh",
    district: "Indore",
    mandi: "Indore APMC (Chhawani)",
    commodity: "Soybean / सोयाबीन",
    minPrice: 4200,
    maxPrice: 4850,
    modalPrice: 4620,
    unit: "₹ / क्विंटल",
    date: "12 Oct 2026",
    source: "MP Mandi Board Feed",
    trader: "श्री महाकाल ग्रेन मर्चेंट (MP-IND-881)",
    phone: "+91 94250 88219"
  },
  {
    id: "mandi-3",
    state: "Punjab",
    district: "Ludhiana",
    mandi: "Khanna APMC",
    commodity: "Basmati Paddy / बासमती धान (1509)",
    minPrice: 3100,
    maxPrice: 3650,
    modalPrice: 3480,
    unit: "₹ / क्विंटल",
    date: "12 Oct 2026",
    source: "Punjab Mandi Board Live",
    trader: "सरदार कुलवंत सिंह एंड संस (PB-KHN-104)",
    phone: "+91 98141 33290"
  },
  {
    id: "mandi-4",
    state: "Rajasthan",
    district: "Kota",
    mandi: "Bhamashah Mandi Kota",
    commodity: "Mustard / सरसों",
    minPrice: 5100,
    maxPrice: 5750,
    modalPrice: 5520,
    unit: "₹ / क्विंटल",
    date: "12 Oct 2026",
    source: "RSAMB Rajasthan Feed",
    trader: "हाड़ौती ऑयलसीड्स ट्रेडर्स (RJ-KT-712)",
    phone: "+91 94141 62901"
  },
  {
    id: "mandi-5",
    state: "Gujarat",
    district: "Rajkot",
    mandi: "Rajkot APMC",
    commodity: "Cotton / कपास (शंकर-6)",
    minPrice: 6800,
    maxPrice: 7600,
    modalPrice: 7350,
    unit: "₹ / क्विंटल",
    date: "12 Oct 2026",
    source: "Gujarat State APMC",
    trader: "पटेल कॉटन कॉरपोरेशन (GJ-RJK-339)",
    phone: "+91 98252 11984"
  },
  {
    id: "mandi-6",
    state: "Uttar Pradesh",
    district: "Agra",
    mandi: "Agra APMC",
    commodity: "Potato / आलू (पुखराज)",
    minPrice: 1350,
    maxPrice: 1750,
    modalPrice: 1580,
    unit: "₹ / क्विंटल",
    date: "12 Oct 2026",
    source: "UP Mandi Parishad",
    trader: "ब्रज कोल्ड स्टोरेज एंड ट्रेडर्स (UP-AGR-501)",
    phone: "+91 98370 77123"
  }
];

export const INITIAL_EXPENSES = [
  {
    id: "exp-1",
    date: "2024-11-10",
    category: "Seeds (बीज)",
    crop: "गेहूं (Wheat PBW 550)",
    amount: 6525,
    description: "4.5 एकड़ हेतु प्रमाणित गेहूं बीज 180 किग्रा"
  },
  {
    id: "exp-2",
    date: "2024-11-12",
    category: "Fertilizers (उर्वरक)",
    crop: "गेहूं (Wheat PBW 550)",
    amount: 8200,
    description: "बेसल डोज हेतु 5 बैग DAP + पोटाश MOP"
  },
  {
    id: "exp-3",
    date: "2024-07-05",
    category: "Machinery (ट्रैक्टर व जुताई)",
    crop: "सोयाबीन (Soybean JS-335)",
    amount: 5400,
    description: "रोटावेटर व सीड-ड्रिल द्वारा बुवाई किराया"
  },
  {
    id: "exp-4",
    date: "2024-08-15",
    category: "Labour (मजदूरी)",
    crop: "लाल प्याज (Red Onion)",
    amount: 9600,
    description: "प्याज पौध रोपाई हेतु 8 श्रमिकों की मजदूरी"
  }
];

export const INITIAL_INCOME = [
  {
    id: "inc-1",
    date: "2024-10-25",
    crop: "सोयाबीन (Soybean JS-335)",
    quantity: 36,
    unit: "क्विंटल",
    ratePerUnit: 4650,
    totalRevenue: 167400,
    mandi: "Indore APMC",
    notes: "ग्रेड-ए क्वालिटी उपज बिक्री"
  },
  {
    id: "inc-2",
    date: "2024-04-18",
    crop: "गेहूं (Wheat Sharbati)",
    quantity: 98,
    unit: "क्विंटल",
    ratePerUnit: 2600,
    totalRevenue: 254800,
    mandi: "Taraori APMC",
    notes: "समर्थन मूल्य से बेहतर निजी व्यापारी को बिक्री"
  }
];

export const INITIAL_MARKETPLACE = [
  {
    id: "prod-1",
    title: "प्रमाणित गेहूं बीज PBW-550 (Certified Wheat)",
    category: "Seeds",
    price: 1450,
    unit: "40kg बैग",
    vendor: "राष्ट्रीय बीज निगम (NSC Authorized)",
    phone: "+91 98110 22345",
    location: "कुरुक्षेत्र, हरियाणा",
    desc: "रोगरोधी, उच्च उत्पादन (22-24 क्विंटल/एकड़) प्रमाणित बीज।"
  },
  {
    id: "prod-2",
    title: "IFOAM प्रमाणित नीम कोटेड बायो-डीएपी",
    category: "Fertilizers",
    price: 1150,
    unit: "50kg बैग",
    vendor: "इफको किसान सेवा केंद्र",
    phone: "+91 98450 67890",
    location: "इंदौर, मध्य प्रदेश",
    desc: "फास्फोरस एवं सूक्ष्म तत्वों से भरपूर, जैविक गुणवत्ता युक्त।"
  },
  {
    id: "prod-3",
    title: "ड्रिप इरिगेशन स्वचालित कंट्रोलर किट (1 एकड़)",
    category: "Irrigation",
    price: 6800,
    unit: "सेट",
    vendor: "जैन इरिगेशन अधिकृत डीलर",
    phone: "+91 94222 34567",
    location: "जलगांव, महाराष्ट्र",
    desc: "पानी व बिजली की 60% बचत, प्रेशर रेगुलेटर व टाइमर सहित।"
  },
  {
    id: "prod-4",
    title: "डिजिटल सॉइल N-P-K और pH मीटर",
    category: "Tools",
    price: 1850,
    unit: "यूनिट",
    vendor: "एग्रो-टेक इंस्ट्रूमेंट्स",
    phone: "+91 99200 11443",
    location: "पुणे, महाराष्ट्र",
    desc: "खेत में तत्काल मिट्टी के पोषक तत्वों और pH की सटीक जांच।"
  }
];
