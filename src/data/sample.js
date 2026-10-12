// Illustrative sample content. Everything here is shown with a "sample" badge in the UI;
// none of it is a live feed, and it carries no real vendor names or phone numbers.

// Indicative price ranges (₹ / quintal) for layout and demo only.
export const SAMPLE_MANDI = [
  { id: 'm-1', state: 'Maharashtra', district: 'Nashik', mandi: 'Lasalgaon', commodity: { hi: 'प्याज', en: 'Onion' }, min: 1850, max: 2850, modal: 2450 },
  { id: 'm-2', state: 'Madhya Pradesh', district: 'Indore', mandi: 'Indore', commodity: { hi: 'सोयाबीन', en: 'Soybean' }, min: 4200, max: 4850, modal: 4620 },
  { id: 'm-3', state: 'Punjab', district: 'Ludhiana', mandi: 'Khanna', commodity: { hi: 'बासमती धान (1509)', en: 'Basmati paddy (1509)' }, min: 3100, max: 3650, modal: 3480 },
  { id: 'm-4', state: 'Rajasthan', district: 'Kota', mandi: 'Kota', commodity: { hi: 'सरसों', en: 'Mustard' }, min: 5100, max: 5750, modal: 5520 },
  { id: 'm-5', state: 'Gujarat', district: 'Rajkot', mandi: 'Rajkot', commodity: { hi: 'कपास', en: 'Cotton' }, min: 6800, max: 7600, modal: 7350 },
  { id: 'm-6', state: 'Uttar Pradesh', district: 'Agra', mandi: 'Agra', commodity: { hi: 'आलू', en: 'Potato' }, min: 1350, max: 1750, modal: 1580 },
  { id: 'm-7', state: 'Haryana', district: 'Karnal', mandi: 'Karnal', commodity: { hi: 'गेहूं', en: 'Wheat' }, min: 2300, max: 2550, modal: 2425 },
];

export const SAMPLE_LISTINGS = [
  // (each row is flagged sample: true below)
  { id: 'prod-1', title: { hi: 'प्रमाणित गेहूं बीज (40 किग्रा)', en: 'Certified wheat seed (40 kg)' }, category: 'Seeds', price: 1450, unit: '40 kg bag', vendor: { hi: 'नमूना विक्रेता', en: 'Sample vendor' }, location: { hi: 'हरियाणा', en: 'Haryana' }, desc: { hi: 'रोगरोधी किस्म का नमूना उत्पाद विवरण।', en: 'Sample listing for a disease-tolerant variety.' } },
  { id: 'prod-2', title: { hi: 'नीम कोटेड यूरिया (45 किग्रा)', en: 'Neem-coated urea (45 kg)' }, category: 'Fertilizers', price: 267, unit: '45 kg bag', vendor: { hi: 'नमूना विक्रेता', en: 'Sample vendor' }, location: { hi: 'मध्य प्रदेश', en: 'Madhya Pradesh' }, desc: { hi: 'सरकारी नियंत्रित दर का नमूना; वास्तविक दर स्थानीय डीलर से पूछें।', en: 'Sample at a regulated rate; check the real rate with your local dealer.' } },
  { id: 'prod-3', title: { hi: 'ड्रिप सिंचाई किट (1 एकड़)', en: 'Drip irrigation kit (1 acre)' }, category: 'Irrigation', price: 6800, unit: 'set', vendor: { hi: 'नमूना विक्रेता', en: 'Sample vendor' }, location: { hi: 'महाराष्ट्र', en: 'Maharashtra' }, desc: { hi: 'पानी की बचत के लिए नमूना किट विवरण।', en: 'Sample kit description for water saving.' } },
  { id: 'prod-4', title: { hi: 'डिजिटल मृदा pH मीटर', en: 'Digital soil pH meter' }, category: 'Tools', price: 1850, unit: 'unit', vendor: { hi: 'नमूना विक्रेता', en: 'Sample vendor' }, location: { hi: 'महाराष्ट्र', en: 'Maharashtra' }, desc: { hi: 'खेत में मिट्टी के pH की जांच के लिए नमूना उपकरण।', en: 'Sample tool for checking soil pH in the field.' } },
].map((listing) => ({ ...listing, sample: true }));

// Sample farms and ledger rows the user can load from the empty state (dates relative to today).
export function buildSampleFarms(sownOffsets = { wheat: -40, soybean: -55, onion: -60 }) {
  return [
    { id: 'sample-farm-1', name: 'गंगा का मैदान', cropId: 'wheat', cropLabel: '', area: 4.5, location: 'कुरुक्षेत्र, हरियाणा', lat: 29.9695, lon: 76.8783, soil: 'loamy', soilTest: null, sownOffset: sownOffsets.wheat },
    { id: 'sample-farm-2', name: 'कृष्णा फार्म्स', cropId: 'soybean', cropLabel: '', area: 3.2, location: 'इंदौर, मध्य प्रदेश', lat: 22.7196, lon: 75.8577, soil: 'black', soilTest: null, sownOffset: sownOffsets.soybean },
    { id: 'sample-farm-3', name: 'सह्याद्री बाग', cropId: 'onion', cropLabel: '', area: 2.0, location: 'नासिक, महाराष्ट्र', lat: 19.9975, lon: 73.7898, soil: 'black', soilTest: null, sownOffset: sownOffsets.onion },
  ];
}

export const SAMPLE_EXPENSES = [
  { id: 'sample-exp-1', offset: -45, category: 'seed', crop: 'गेहूं', amount: 6525, description: '4.5 एकड़ हेतु प्रमाणित बीज 180 किग्रा' },
  { id: 'sample-exp-2', offset: -43, category: 'fertilizer', crop: 'गेहूं', amount: 8200, description: 'बेसल डोज़ हेतु DAP + पोटाश' },
  { id: 'sample-exp-3', offset: -58, category: 'machinery', crop: 'सोयाबीन', amount: 5400, description: 'रोटावेटर व सीड-ड्रिल से बुवाई किराया' },
  { id: 'sample-exp-4', offset: -60, category: 'labour', crop: 'प्याज', amount: 9600, description: 'पौध रोपाई हेतु 8 श्रमिकों की मजदूरी' },
];

export const SAMPLE_INCOME = [
  { id: 'sample-inc-1', offset: -120, crop: 'सोयाबीन', quantity: 36, ratePerUnit: 4650, mandi: 'इंदौर मंडी' },
  { id: 'sample-inc-2', offset: -200, crop: 'गेहूं', quantity: 98, ratePerUnit: 2600, mandi: 'स्थानीय मंडी' },
];
