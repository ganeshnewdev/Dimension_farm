// Weather-driven field alerts for the Crop Advisory page. Returns alert ids; the UI
// translates them (key: adv.alert.<id>).
export function weatherAlerts({ temp, humidity, wind, rainProb, precipitation }) {
  const alerts = [];
  if (precipitation > 0 || rainProb >= 60) alerts.push({ id: 'rain', level: 'warn' });
  if (temp >= 38) alerts.push({ id: 'heat', level: 'warn' });
  if (temp <= 5) alerts.push({ id: 'cold', level: 'warn' });
  if (wind > 20) alerts.push({ id: 'wind', level: 'warn' });
  if (humidity > 85 && temp >= 15 && temp <= 30) alerts.push({ id: 'fungal', level: 'warn' });
  if (alerts.length === 0) alerts.push({ id: 'ok', level: 'ok' });
  return alerts;
}

export const ADVISORY_STAGES = ['sowing', 'vegetative', 'flowering', 'maturity'];
export const SOIL_TYPES = ['loamy', 'black', 'sandy', 'clay'];
