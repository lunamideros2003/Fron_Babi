export const TRIMESTER_LABELS = ['Primer trimestre', 'Segundo trimestre', 'Tercer trimestre'];

export function trimesterNumber(week) {
  if (week === null || week === undefined || week === '') return null;

  const number = Number(week);
  if (!Number.isFinite(number) || number < 1) return null;
  if (number <= 13) return 1;
  if (number <= 27) return 2;
  return 3;
}

export function trimesterOf(week) {
  const number = trimesterNumber(week);
  return number ? TRIMESTER_LABELS[number - 1] : null;
}
