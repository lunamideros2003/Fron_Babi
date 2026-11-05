/*
  Semana seleccionada en `/semana?w=37`.

  El parámetro de la URL lo escribe cualquiera: puede faltar, venir como texto
  o salirse del rango. Antes se usaba tal cual y una semana como 999 dejaba la
  vista mostrando la semana 4 mientras la URL seguía diciendo 999.
*/

export const FIRST_WEEK = 4;
export const LAST_WEEK = 40;
export const DEFAULT_WEEK = 20;

/**
 * Entero entre 4 y 40, o null si no es un número utilizable.
 * Los valores fuera de rango se recortan al extremo más cercano.
 */
export function parseWeekParam(value) {
  if (value === null || value === undefined || value === '') return null;

  const number = Number(value);
  if (!Number.isInteger(number)) return null;

  return Math.min(LAST_WEEK, Math.max(FIRST_WEEK, number));
}

/** Prioriza la semana pedida, luego la actual del embarazo, luego 20. */
export function resolveWeek({ param, currentWeek, fallback = DEFAULT_WEEK } = {}) {
  return parseWeekParam(param) ?? parseWeekParam(currentWeek) ?? fallback;
}
