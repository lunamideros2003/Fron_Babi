export function normalizeComparison(value) {
  return String(value ?? '')
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/^(un|una)\s+/, '');
}

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

export function resolveFruitKey(sizeComparison) {
  if (!sizeComparison) return 'semilla';

  const key = normalizeComparison(sizeComparison);
  if (ALIASES[key]) return ALIASES[key];

  const names = Object.keys(ALIASES).sort((a, b) => b.length - a.length);
  for (const alias of names) {
    if (key.includes(alias)) return ALIASES[alias];
  }

  return 'semilla';
}

export function fruitLabel(sizeComparison) {
  if (!sizeComparison) return 'Tamaño por confirmar';
  return `Del tamaño de ${sizeComparison}`;
}
