import test from 'node:test';
import assert from 'node:assert/strict';

import { ALIASES, fruitLabel, normalizeComparison, resolveFruitKey } from '../src/utils/fruit.js';

test('normaliza tildes, mayusculas y articulo', () => {
  assert.equal(normalizeComparison('Una Sandía Pequeña'), 'sandia pequena');
  assert.equal(normalizeComparison('  un melón  '), 'melon');
  assert.equal(normalizeComparison('una naranja'), 'naranja');
  assert.equal(normalizeComparison(null), '');
});

test('reconoce cada fruta del calendario', () => {
  const esperado = {
    'una semilla de amapola': 'semilla',
    'una lenteja': 'semilla',
    'un arándano': 'arandano',
    'una frambuesa': 'frambuesa',
    'una uva': 'uva',
    'una fresa': 'fresa',
    'un higo': 'higo',
    'una lima': 'lima',
    'un limón': 'lima',
    'un melocotón': 'melocoton',
    'una manzana': 'manzana',
    'un aguacate': 'aguacate',
    'una pera': 'pera',
    'un pimiento': 'pimiento',
    'un mango': 'mango',
    'una papaya': 'papaya',
    'un plátano': 'platano',
    'una zanahoria grande': 'zanahoria',
    'un pomelo': 'pomelo',
    'una mazorca de maíz': 'maiz',
    'una coliflor': 'coliflor',
    'un calabacín': 'calabacin',
    'un repollo': 'repollo',
    'una berenjena': 'berenjena',
    'una calabaza butternut': 'calabaza',
    'un coco': 'coco',
    'una piña': 'pina',
    'un melón': 'melon',
    'una lechuga romana': 'lechuga',
    'una sandía pequeña': 'sandia',
  };

  for (const [comparacion, clave] of Object.entries(esperado)) {
    assert.equal(resolveFruitKey(comparacion), clave, comparacion);
  }
});

test('las variantes con adjetivo caen en la misma forma', () => {
  assert.equal(resolveFruitKey('una sandía mediana'), 'sandia');
  assert.equal(resolveFruitKey('una sandía muy grande'), 'sandia');
  assert.equal(resolveFruitKey('una lechuga romana grande'), 'lechuga');
  assert.equal(resolveFruitKey('un repollo grande'), 'repollo');
});

test('sin dato o con texto raro dibuja una semilla', () => {
  assert.equal(resolveFruitKey(null), 'semilla');
  assert.equal(resolveFruitKey(''), 'semilla');
  assert.equal(resolveFruitKey('algo que no es una fruta'), 'semilla');
});

test('todas las claves de los alias existen como forma', () => {
  const formas = new Set([
    'semilla', 'fresa', 'uva', 'lima', 'mandarina', 'platano', 'aguacate', 'pera',
    'mango', 'zanahoria', 'coco', 'naranja', 'maiz', 'berenjena', 'calabaza',
    'repollo', 'pina', 'melon', 'coliflor', 'lechuga', 'sandia', 'manzana',
    'arandano', 'frambuesa', 'higo', 'melocoton', 'pimiento', 'papaya', 'pomelo',
    'calabacin',
  ]);

  for (const [alias, forma] of Object.entries(ALIASES)) {
    assert.ok(formas.has(forma), `${alias} apunta a ${forma}, que no tiene dibujo`);
  }
});

test('la etiqueta accesible describe el tamano', () => {
  assert.equal(fruitLabel('una sandía pequeña'), 'Del tamaño de una sandía pequeña');
  assert.equal(fruitLabel(null), 'Tamaño por confirmar');
});
