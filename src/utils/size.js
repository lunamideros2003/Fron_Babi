export const SIZE_UNKNOWN = 'Tamaño por confirmar';

export function capitalize(text) {
  const value = String(text ?? '').trim();
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function sizeLabel(sizeComparison) {
  if (!sizeComparison) return SIZE_UNKNOWN;
  return `Del tamaño de ${sizeComparison}`;
}

export function sizeAriaLabel(sizeComparison) {
  if (!sizeComparison) return SIZE_UNKNOWN;
  return `Del tamaño de ${sizeComparison}`;
}
