// Spray advisory from current conditions. Thresholds follow common extension guidance:
// avoid spraying in wind above ~20 km/h or when rain is likely, prefer calm, cool, dry hours.
export function sprayAdvice({ wind, rainProb, temp, precipitation }) {
  const reasons = [];
  if (precipitation > 0) reasons.push('raining');
  if (rainProb >= 50) reasons.push('rainLikely');
  else if (rainProb >= 20) reasons.push('rainPossible');
  if (wind > 20) reasons.push('windStrong');
  else if (wind >= 15) reasons.push('windModerate');
  if (temp >= 38) reasons.push('hot');

  const avoid = precipitation > 0 || rainProb >= 50 || wind > 20;
  const caution = !avoid && (wind >= 15 || rainProb >= 20 || temp >= 38);
  return { level: avoid ? 'avoid' : caution ? 'caution' : 'safe', reasons };
}

export function humidityBand(humidity) {
  if (humidity < 35) return 'dry';
  if (humidity <= 70) return 'balanced';
  return 'humid';
}

export function windBand(wind) {
  if (wind > 20) return 'strong';
  if (wind >= 15) return 'moderate';
  return 'calm';
}
