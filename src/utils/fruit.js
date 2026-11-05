/*
  Resolución de la comparación de tamaño a una forma dibujable.

  Vive fuera de `components/Fruit.jsx` para poder probarla sin React: la
  ilustración solo necesita saber qué clave de `SHAPES` dibujar.
*/

/** Quita tildes, mayúsculas y el artículo inicial ("una sandía" -> "sandia"). */
export function normalizeComparison(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^(un|una)\s+/, '');
}

/*
  Cada alias apunta a una forma de `Fruit.jsx`. Se aceptan las variantes que
  usan las semanas ("piña", "sandía pequeña", "mazorca de maíz"...).
*/
export const ALIASES = {
  'semilla de amapola': 'semilla',
  'semilla de sesamo': 'semilla',
  'grano de sal': 'semilla',
  'grano de arena': 'semilla',
  lenteja: 'semilla',
  arroz: 'semilla',
  'mano cerrada': 'semilla',
  'papa dulce': 'semilla',
  'mano pequena': 'semilla',
  arandano: 'arandano',
  frambuesa: 'frambuesa',
  uva: 'uva',
  fresa: 'fresa',
  higo: 'higo',
  lima: 'lima',
  limon: 'lima',
  melocoton: 'melocoton',
  manzana: 'manzana',
  aguacate: 'aguacate',
  pera: 'pera',
  pimiento: 'pimiento',
  mango: 'mango',
  papaya: 'papaya',
  platano: 'platano',
  banana: 'platano',
  zanahoria: 'zanahoria',
  pomelo: 'pomelo',
  naranja: 'naranja',
  'mazorca de maiz': 'maiz',
  'maiz dulce': 'maiz',
  coliflor: 'coliflor',
  calabacin: 'calabacin',
  repollo: 'repollo',
  berenjena: 'berenjena',
  calabaza: 'calabaza',
  coco: 'coco',
  pina: 'pina',
  melon: 'melon',
  lechuga: 'lechuga',
  sandia: 'sandia',
};

/** Clave de forma para una comparación; `semilla` cuando no se reconoce. */
export function resolveFruitKey(sizeComparison) {
  if (!sizeComparison) return 'semilla';

  const key = normalizeComparison(sizeComparison);
  if (ALIASES[key]) return ALIASES[key];

  // "sandía muy grande", "lechuga romana grande"...: se busca el alias dentro
  // del texto, del más largo al más corto para que "maiz dulce" gane a "maiz".
  const nombres = Object.keys(ALIASES).sort((a, b) => b.length - a.length);
  for (const alias of nombres) {
    if (key.includes(alias)) return ALIASES[alias];
  }

  return 'semilla';
}

/** Texto accesible de la ilustración. */
export function fruitLabel(sizeComparison) {
  if (!sizeComparison) return 'Tamaño por confirmar';
  return `Del tamaño de ${sizeComparison}`;
}
