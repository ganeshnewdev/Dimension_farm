import { addDays, clamp, diffDays, isValidISODate } from './format.js';

// Derive the crop stage from sowing date and crop duration instead of storing a
// hard-coded (and soon stale) stage string.
export function cropProgress({ sownDate, durationDays, today }) {
  if (!isValidISODate(sownDate) || !(durationDays > 0) || !isValidISODate(today)) return null;
  const elapsed = diffDays(sownDate, today);
  const harvestDate = addDays(sownDate, durationDays);
  const daysToHarvest = durationDays - elapsed;
  const progress = clamp(elapsed / durationDays, 0, 1);

  let stage;
  if (elapsed < 0) stage = 'notSown';
  else if (elapsed >= durationDays) stage = 'harvestDue';
  else if (progress < 0.15) stage = 'sowing';
  else if (progress < 0.5) stage = 'vegetative';
  else if (progress < 0.75) stage = 'flowering';
  else stage = 'maturity';

  return { stage, elapsed, daysToHarvest, harvestDate, progress };
}
