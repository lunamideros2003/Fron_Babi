/*
  Etiqueta del trimestre.

  El backend ya expone `trimester_label` en el embarazo, pero varias vistas
  calculan la etiqueta a partir de la semana. Estaba duplicado en dos páginas y
  con un borde distinto: la semana 13 se mostraba como "Segundo trimestre"
  cuando el backend la considera del primero. Aquí vive la única versión.

  Cortes: 1-13 primer trimestre, 14-27 segundo, 28-40 tercero.
*/

export const TRIMESTER_LABELS = ['Primer trimestre', 'Segundo trimestre', 'Tercer trimestre'];

/** Número de trimestre (1-3) o null si la semana no es válida. */
export function trimesterNumber(week) {
  if (week === null || week === undefined || week === '') return null;

  const number = Number(week);
  if (!Number.isFinite(number) || number < 1) return null;
  if (number <= 13) return 1;
  if (number <= 27) return 2;
  return 3;
}

/** "Primer trimestre", etc.; null si la semana no es válida. */
export function trimesterOf(week) {
  const number = trimesterNumber(week);
  return number ? TRIMESTER_LABELS[number - 1] : null;
}
