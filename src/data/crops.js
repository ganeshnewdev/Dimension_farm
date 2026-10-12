// Approximate package-of-practice values based on ICAR / state agriculture university
// recommendations. They vary by variety, region and soil: always confirm with the local KVK.
// Text fields are { hi, en }.

export const CROPS = [
  {
    id: 'wheat',
    name: { hi: 'गेहूं', en: 'Wheat' },
    season: { hi: 'रबी', en: 'Rabi' },
    durationDays: 140,
    sowing: { hi: '15 अक्टूबर - 15 नवंबर', en: '15 Oct - 15 Nov' },
    soil: { hi: 'बलुई दोमट से चिकनी दोमट मिट्टी (pH 6.5 - 7.5)', en: 'Sandy loam to clay loam (pH 6.5 - 7.5)' },
    seedRate: { hi: '40-45 किग्रा / एकड़', en: '40-45 kg / acre' },
    spacing: { hi: 'पंक्ति से पंक्ति 20-22.5 सेमी', en: 'Row to row 20-22.5 cm' },
    npk: { hi: '120:60:40 किग्रा/हेक्टेयर (N:P:K)', en: '120:60:40 kg/ha (N:P:K)' },
    irrigation: [
      { hi: 'CRI अवस्था - बुवाई के 21 दिन बाद (अति आवश्यक)', en: 'CRI stage - 21 days after sowing (most critical)' },
      { hi: 'कल्ले फूटने के समय - 40-45 दिन बाद', en: 'Tillering - 40-45 days' },
      { hi: 'गांठ बनने की अवस्था - 60-65 दिन बाद', en: 'Jointing - 60-65 days' },
      { hi: 'फूल व बाली निकलते समय - 80-85 दिन बाद', en: 'Flowering / ear emergence - 80-85 days' },
      { hi: 'दूधिया अवस्था - 100-105 दिन बाद', en: 'Milking stage - 100-105 days' },
    ],
    diseases: [
      { hi: 'पीला रतुआ', en: 'Yellow rust' },
      { hi: 'करनाल बंट', en: 'Karnal bunt' },
      { hi: 'दीमक', en: 'Termites' },
    ],
    yield: { hi: '20-24 क्विंटल / एकड़', en: '20-24 quintal / acre' },
  },
  {
    id: 'rice',
    name: { hi: 'धान', en: 'Paddy (Rice)' },
    season: { hi: 'खरीफ', en: 'Kharif' },
    durationDays: 130,
    sowing: { hi: 'नर्सरी: मई-जून | रोपाई: जून-जुलाई', en: 'Nursery: May-Jun | Transplanting: Jun-Jul' },
    soil: { hi: 'चिकनी या चिकनी दोमट मिट्टी, जल रोकने वाली (pH 5.5 - 7.5)', en: 'Clay or clay loam that holds water (pH 5.5 - 7.5)' },
    seedRate: { hi: '8-10 किग्रा नर्सरी बीज / एकड़', en: '8-10 kg nursery seed / acre' },
    spacing: { hi: '20 x 15 सेमी (रोपाई)', en: '20 x 15 cm (transplanting)' },
    npk: { hi: '120:60:40 किग्रा/हेक्टेयर (N:P:K)', en: '120:60:40 kg/ha (N:P:K)' },
    irrigation: [
      { hi: 'रोपाई के बाद 2-5 सेमी पानी बनाए रखें', en: 'Keep 2-5 cm standing water after transplanting' },
      { hi: 'कल्ले फूटने व गोभ (पैनिकल) बनने पर पानी की कमी न होने दें', en: 'No water stress at tillering and panicle initiation' },
      { hi: 'फूल आते समय खेत में नमी/पानी रखें', en: 'Keep field moist / flooded at flowering' },
      { hi: 'कटाई से 10-15 दिन पहले पानी निकाल दें', en: 'Drain the field 10-15 days before harvest' },
    ],
    diseases: [
      { hi: 'झोंका रोग (Blast)', en: 'Blast' },
      { hi: 'जीवाणु पत्ती झुलसा', en: 'Bacterial leaf blight' },
      { hi: 'तना छेदक', en: 'Stem borer' },
    ],
    yield: { hi: '18-25 क्विंटल / एकड़', en: '18-25 quintal / acre' },
  },
  {
    id: 'soybean',
    name: { hi: 'सोयाबीन', en: 'Soybean' },
    season: { hi: 'खरीफ', en: 'Kharif' },
    durationDays: 100,
    sowing: { hi: '20 जून - 10 जुलाई (मानसून आगमन पर)', en: '20 Jun - 10 Jul (on monsoon onset)' },
    soil: { hi: 'मध्यम से गहरी काली उपजाऊ मिट्टी (pH 6.5 - 7.5)', en: 'Medium to deep fertile black soil (pH 6.5 - 7.5)' },
    seedRate: { hi: '25-30 किग्रा / एकड़ (बीजोपचार आवश्यक)', en: '25-30 kg / acre (seed treatment needed)' },
    spacing: { hi: 'पंक्ति से पंक्ति 45 सेमी, पौधे से पौधा 5-7 सेमी', en: 'Row 45 cm, plant 5-7 cm' },
    npk: { hi: '20:60:40 किग्रा/हेक्टेयर + 20 किग्रा सल्फर', en: '20:60:40 kg/ha + 20 kg sulphur' },
    irrigation: [
      { hi: 'फूल आते समय (जल भराव न होने दें)', en: 'At flowering (avoid waterlogging)' },
      { hi: 'फलियों में दाना भरते समय (नमी आवश्यक)', en: 'At pod filling (moisture is essential)' },
    ],
    diseases: [
      { hi: 'पीला मोज़ेक वायरस (YMV)', en: 'Yellow mosaic virus (YMV)' },
      { hi: 'गर्डल बीटल', en: 'Girdle beetle' },
      { hi: 'तना मक्खी', en: 'Stem fly' },
    ],
    yield: { hi: '10-12 क्विंटल / एकड़', en: '10-12 quintal / acre' },
  },
  {
    id: 'mustard',
    name: { hi: 'सरसों / राई', en: 'Mustard' },
    season: { hi: 'रबी', en: 'Rabi' },
    durationDays: 130,
    sowing: { hi: '1 अक्टूबर - 25 अक्टूबर', en: '1 Oct - 25 Oct' },
    soil: { hi: 'दोमट एवं हल्की दोमट मिट्टी (pH 6.0 - 7.5)', en: 'Loam and light loam (pH 6.0 - 7.5)' },
    seedRate: { hi: '1.5 - 2 किग्रा / एकड़', en: '1.5 - 2 kg / acre' },
    spacing: { hi: 'पंक्ति से पंक्ति 30 सेमी, पौधे से पौधा 10 सेमी', en: 'Row 30 cm, plant 10 cm' },
    npk: { hi: '80:40:40 किग्रा/हेक्टेयर + 40 किग्रा सल्फर', en: '80:40:40 kg/ha + 40 kg sulphur' },
    irrigation: [
      { hi: 'पहली सिंचाई - बुवाई के 30-35 दिन बाद (शाखाएं निकलते समय)', en: 'First - 30-35 days after sowing (branching)' },
      { hi: 'दूसरी सिंचाई - फलियां बनते समय (60-70 दिन बाद)', en: 'Second - pod formation (60-70 days)' },
    ],
    diseases: [
      { hi: 'माहू / चेपा (Aphid)', en: 'Aphids' },
      { hi: 'सफेद रतुआ', en: 'White rust' },
      { hi: 'आर्द्र विगलन', en: 'Damping off' },
    ],
    yield: { hi: '8-11 क्विंटल / एकड़', en: '8-11 quintal / acre' },
  },
  {
    id: 'cotton',
    name: { hi: 'कपास', en: 'Cotton' },
    season: { hi: 'खरीफ', en: 'Kharif' },
    durationDays: 180,
    sowing: { hi: 'अप्रैल-मई (सिंचित) | जून (वर्षा आधारित)', en: 'Apr-May (irrigated) | Jun (rain-fed)' },
    soil: { hi: 'गहरी काली या दोमट मिट्टी, अच्छा जल निकास (pH 6.0 - 8.0)', en: 'Deep black or loamy soil, well drained (pH 6.0 - 8.0)' },
    seedRate: { hi: 'हाइब्रिड: लगभग 0.9 किग्रा / एकड़ (2 पैकेट)', en: 'Hybrid: about 0.9 kg / acre (2 packets)' },
    spacing: { hi: '90-108 सेमी x 60 सेमी (किस्म अनुसार)', en: '90-108 cm x 60 cm (varies by hybrid)' },
    npk: { hi: '150:60:60 किग्रा/हेक्टेयर (संकर किस्में)', en: '150:60:60 kg/ha (hybrids)' },
    irrigation: [
      { hi: 'बुवाई के बाद हल्की सिंचाई, फिर 15-20 दिन अंतराल पर', en: 'Light irrigation after sowing, then every 15-20 days' },
      { hi: 'फूल व डोडी (बोल) बनने पर नमी की कमी न होने दें', en: 'No moisture stress at flowering and boll formation' },
    ],
    diseases: [
      { hi: 'गुलाबी सुंडी (Pink bollworm)', en: 'Pink bollworm' },
      { hi: 'सफेद मक्खी व पर्ण कुंचन वायरस', en: 'Whitefly and leaf curl virus' },
      { hi: 'जड़ गलन', en: 'Root rot' },
    ],
    yield: { hi: '8-12 क्विंटल (बीज कपास) / एकड़', en: '8-12 quintal (seed cotton) / acre' },
  },
  {
    id: 'potato',
    name: { hi: 'आलू', en: 'Potato' },
    season: { hi: 'रबी', en: 'Rabi' },
    durationDays: 100,
    sowing: { hi: 'मध्य अक्टूबर - मध्य नवंबर (उत्तर भारत)', en: 'Mid Oct - mid Nov (north India)' },
    soil: { hi: 'भुरभुरी, अच्छे जल निकास वाली दोमट मिट्टी (pH 5.5 - 6.5)', en: 'Loose, well-drained loam (pH 5.5 - 6.5)' },
    seedRate: { hi: '10-12 क्विंटल कंद / एकड़', en: '10-12 quintal tubers / acre' },
    spacing: { hi: 'पंक्ति से पंक्ति 60 सेमी, कंद से कंद 20 सेमी', en: 'Row 60 cm, tuber 20 cm' },
    npk: { hi: '180:80:100 किग्रा/हेक्टेयर (N:P:K)', en: '180:80:100 kg/ha (N:P:K)' },
    irrigation: [
      { hi: 'बुवाई के 7-10 दिन बाद पहली हल्की सिंचाई', en: 'First light irrigation 7-10 days after planting' },
      { hi: 'कंद बनते समय 10-12 दिन के अंतराल पर', en: 'Every 10-12 days during tuber formation' },
      { hi: 'खुदाई से 10-15 दिन पहले सिंचाई बंद करें', en: 'Stop irrigation 10-15 days before digging' },
    ],
    diseases: [
      { hi: 'पछेती झुलसा (Late blight)', en: 'Late blight' },
      { hi: 'अगेती झुलसा', en: 'Early blight' },
      { hi: 'काली रूसी (Black scurf)', en: 'Black scurf' },
    ],
    yield: { hi: '80-100 क्विंटल / एकड़', en: '80-100 quintal / acre' },
  },
  {
    id: 'onion',
    name: { hi: 'प्याज', en: 'Onion' },
    season: { hi: 'रबी / खरीफ', en: 'Rabi / Kharif' },
    durationDays: 130,
    sowing: { hi: 'रबी रोपाई: दिसंबर - जनवरी | खरीफ: अगस्त', en: 'Rabi transplant: Dec - Jan | Kharif: Aug' },
    soil: { hi: 'अच्छे जल निकास वाली बलुई दोमट (pH 6.5 - 7.5)', en: 'Well-drained sandy loam (pH 6.5 - 7.5)' },
    seedRate: { hi: '3.5 - 4 किग्रा बीज (नर्सरी) / एकड़', en: '3.5 - 4 kg seed (nursery) / acre' },
    spacing: { hi: '15 सेमी x 10 सेमी', en: '15 cm x 10 cm' },
    npk: { hi: '100:50:50 किग्रा/हेक्टेयर + 30 किग्रा सल्फर', en: '100:50:50 kg/ha + 30 kg sulphur' },
    irrigation: [
      { hi: 'रोपाई के तुरंत बाद हल्की सिंचाई', en: 'Light irrigation right after transplanting' },
      { hi: 'कंद बनते समय 7-10 दिन के अंतराल पर निरंतर नमी', en: 'Steady moisture every 7-10 days at bulbing' },
      { hi: 'खुदाई से 15 दिन पूर्व सिंचाई बंद करें', en: 'Stop irrigation 15 days before harvest' },
    ],
    diseases: [
      { hi: 'बैंगनी धब्बा रोग', en: 'Purple blotch' },
      { hi: 'थ्रिप्स', en: 'Thrips' },
      { hi: 'जड़ सड़न', en: 'Basal rot' },
    ],
    yield: { hi: '120-150 क्विंटल / एकड़', en: '120-150 quintal / acre' },
  },
];

export function findCrop(id) {
  return CROPS.find((c) => c.id === id) ?? null;
}

// { hi, en } | legacy string -> string
export function pick(value, lang) {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[lang] ?? value.en ?? value.hi ?? '';
}
