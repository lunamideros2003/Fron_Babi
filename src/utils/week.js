export const FIRST_WEEK = 4;
export const LAST_WEEK = 40;
export const DEFAULT_WEEK = 20;

export function parseWeekParam(value) {
  if (value === null || value === undefined || value === '') return null;

  const number = Number(value);
  if (!Number.isInteger(number)) return null;

  return Math.min(LAST_WEEK, Math.max(FIRST_WEEK, number));
}

export function resolveWeek({ param, currentWeek, fallback = DEFAULT_WEEK } = {}) {
  return parseWeekParam(param) ?? parseWeekParam(currentWeek) ?? fallback;
}
