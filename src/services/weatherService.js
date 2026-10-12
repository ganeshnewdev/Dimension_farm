const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast';
const GEOCODE_URL = 'https://geocoding-api.open-meteo.com/v1/search';

const finite = (v) => (typeof v === 'number' && Number.isFinite(v) ? v : null);

// Throws on any failure so the UI can show an error + retry instead of inventing numbers.
export async function fetchWeather(lat, lon, signal) {
  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m',
    daily: 'weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max',
    forecast_days: '5',
    timezone: 'auto',
  });
  const res = await fetch(`${FORECAST_URL}?${params}`, { signal });
  if (!res.ok) throw new Error(`weather ${res.status}`);
  const data = await res.json();
  const c = data.current;
  if (!c || finite(c.temperature_2m) === null) throw new Error('weather payload');

  const d = data.daily ?? {};
  const days = (d.time ?? []).map((date, i) => ({
    date,
    max: finite(d.temperature_2m_max?.[i]),
    min: finite(d.temperature_2m_min?.[i]),
    rainProb: finite(d.precipitation_probability_max?.[i]) ?? 0,
    code: finite(d.weather_code?.[i]) ?? 0,
  }));

  return {
    temp: Math.round(c.temperature_2m),
    feelsLike: Math.round(finite(c.apparent_temperature) ?? c.temperature_2m),
    humidity: Math.round(finite(c.relative_humidity_2m) ?? 0),
    wind: Math.round((finite(c.wind_speed_10m) ?? 0) * 10) / 10,
    precipitation: finite(c.precipitation) ?? 0,
    code: finite(c.weather_code) ?? 0,
    observedAt: typeof c.time === 'string' ? c.time : null,
    // Today's range and rain probability come from the daily forecast.
    max: days[0]?.max ?? null,
    min: days[0]?.min ?? null,
    rainProb: days[0]?.rainProb ?? 0,
    days,
  };
}

export async function searchPlaces(query, lang = 'en', signal) {
  const params = new URLSearchParams({
    name: query,
    count: '8',
    language: lang === 'hi' ? 'hi' : 'en',
    format: 'json',
  });
  const res = await fetch(`${GEOCODE_URL}?${params}`, { signal });
  if (!res.ok) throw new Error(`geocode ${res.status}`);
  const data = await res.json();
  const places = (data.results ?? [])
    .filter((r) => finite(r.latitude) !== null && finite(r.longitude) !== null)
    .map((r) => ({
      id: r.id ?? `${r.latitude},${r.longitude}`,
      name: r.name,
      admin1: r.admin1 ?? '',
      country: r.country ?? '',
      countryCode: r.country_code ?? '',
      lat: r.latitude,
      lon: r.longitude,
    }));
  // Indian places first, since this is an India-focused app.
  return places.sort((a, b) => Number(b.countryCode === 'IN') - Number(a.countryCode === 'IN'));
}

export function placeLabel(place) {
  return [place.name, place.admin1].filter(Boolean).join(', ');
}
