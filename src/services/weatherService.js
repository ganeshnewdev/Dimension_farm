export async function fetchLiveWeather(lat, lon) {
  try {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,rain,weather_code,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto`;
    const res = await fetch(url);
    if (!res.ok) throw new Error("Weather API error");
    const data = await res.json();
    return {
      temp: Math.round(data.current?.temperature_2m ?? 28),
      feelsLike: Math.round(data.current?.apparent_temperature ?? 30),
      humidity: data.current?.relative_humidity_2m ?? 65,
      wind: data.current?.wind_speed_10m ?? 12,
      precipitation: data.current?.precipitation ?? 0,
      weatherCode: data.current?.weather_code ?? 0,
      dailyMax: Math.round(data.daily?.temperature_2m_max?.[0] ?? 32),
      dailyMin: Math.round(data.daily?.temperature_2m_min?.[0] ?? 22),
      rainProb: data.daily?.precipitation_probability_max?.[0] ?? 10,
      timestamp: new Date().toLocaleTimeString("en-IN", { hour: '2-digit', minute: '2-digit' }),
      source: "Open-Meteo Satellite Data"
    };
  } catch (err) {
    console.error("Live weather fetch error:", err);
    return null;
  }
}

export async function searchGeocoding(query) {
  try {
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=6&language=en&format=json`;
    const res = await fetch(url);
    if (!res.ok) return [];
    const data = await res.json();
    if (data.results && data.results.length > 0) {
      return data.results.map(r => ({
        name: r.name,
        admin1: r.admin1 || "",
        country: r.country || "India",
        latitude: r.latitude,
        longitude: r.longitude
      }));
    }
    return [];
  } catch (err) {
    console.error("Geocoding error:", err);
    return [];
  }
}
