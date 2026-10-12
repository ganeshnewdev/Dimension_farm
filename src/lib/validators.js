// Returns a bare 10-digit Indian mobile number, or null if the input is not one.
export function normalizeIndianPhone(input) {
  let digits = String(input ?? '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) digits = digits.slice(2);
  else if (digits.length === 11 && digits.startsWith('0')) digits = digits.slice(1);
  return /^[6-9]\d{9}$/.test(digits) ? digits : null;
}

export function formatIndianPhone(tenDigits) {
  return `+91 ${tenDigits.slice(0, 5)} ${tenDigits.slice(5)}`;
}

export function cleanText(value, max = 200) {
  return String(value ?? '').replace(/\s+/g, ' ').trim().slice(0, max);
}
