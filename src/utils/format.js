const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 0,
});

export function formatMoney(value) {
  return currencyFormatter.format(Number(value ?? 0));
}

export function formatSignedMoney(value) {
  const n = Number(value ?? 0);
  const formatted = currencyFormatter.format(Math.abs(n));
  if (n > 0) return `+${formatted}`;
  if (n < 0) return `\u2212${formatted}`;
  return formatted;
}

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
});
const timeFormatter = new Intl.DateTimeFormat("en-IN", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
});

export function formatDate(iso) {
  if (!iso) return "";
  return dateFormatter.format(new Date(iso));
}

export function formatDateTime(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return `${dateFormatter.format(d)} \u00B7 ${timeFormatter.format(d)}`;
}

export function initials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export function toIsoFromLocalInput(localValue) {
  if (!localValue) return null;
  return new Date(localValue).toISOString();
}
