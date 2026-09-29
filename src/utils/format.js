export function formatDate(value) {
  if (!value) return '';
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

export function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString('es-ES', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function formatShortDate(value) {
  if (!value) return '';
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
}

export function daysUntil(value) {
  if (!value) return null;
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return null;
  const diff = Math.ceil((date.getTime() - Date.now()) / 86_400_000);
  return diff;
}

export function relativeDay(value) {
  const diff = daysUntil(value);
  if (diff === null) return '';
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Manana';
  if (diff === -1) return 'Ayer';
  if (diff > 1 && diff <= 7) return `En ${diff} dias`;
  if (diff < -1) return `Hace ${Math.abs(diff)} dias`;
  return formatShortDate(value);
}

export function toLocalInputValue(value) {
  const date = value ? new Date(String(value).replace(' ', 'T')) : new Date();
  if (Number.isNaN(date.getTime())) return '';
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}
