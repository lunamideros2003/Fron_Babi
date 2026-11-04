/*
  Frases del tamaño del bebé.

  El campo `size_comparison` ya viene con artículo y en singular
  ("una sandía pequeña", "un melón"), así que aquí solo se compone la frase:
  no hace falta adivinar el género ni el número.
*/

export const SIZE_UNKNOWN = 'Tamaño por confirmar';

/** "una sandía pequeña" -> "Una sandía pequeña" */
export function capitalize(text) {
  const value = String(text ?? '').trim();
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

/** Texto completo para la tarjeta de inicio. */
export function sizeLabel(sizeComparison) {
  if (!sizeComparison) return SIZE_UNKNOWN;
  return `Del tamaño de ${sizeComparison}`;
}

/** Texto para el atributo accesible de la ilustración. */
export function sizeAriaLabel(sizeComparison) {
  if (!sizeComparison) return SIZE_UNKNOWN;
  return `Del tamaño de ${sizeComparison}`;
}
