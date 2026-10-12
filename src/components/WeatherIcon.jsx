import React from 'react';
import { Cloud, CloudDrizzle, CloudFog, CloudLightning, CloudRain, CloudSun, Snowflake, Sun } from 'lucide-react';
import { weatherKind } from '../lib/weatherCodes.js';

const ICONS = {
  clear: Sun,
  partly: CloudSun,
  overcast: Cloud,
  fog: CloudFog,
  drizzle: CloudDrizzle,
  rain: CloudRain,
  snow: Snowflake,
  thunder: CloudLightning,
  unknown: Cloud,
};

export default function WeatherIcon({ code, className = 'w-6 h-6' }) {
  const Icon = ICONS[weatherKind(code)] ?? Cloud;
  return <Icon className={className} aria-hidden="true" />;
}
