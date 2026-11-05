import test from 'node:test';
import assert from 'node:assert/strict';

import { TRIMESTER_LABELS, trimesterNumber, trimesterOf } from '../src/utils/trimester.js';

test('los cortes coinciden con el backend', () => {
  assert.equal(trimesterNumber(1), 1);
  assert.equal(trimesterNumber(13), 1);
  assert.equal(trimesterNumber(14), 2);
  assert.equal(trimesterNumber(27), 2);
  assert.equal(trimesterNumber(28), 3);
  assert.equal(trimesterNumber(40), 3);
});

test('la semana 13 sigue en el primer trimestre', () => {
  assert.equal(trimesterOf(13), 'Primer trimestre');
  assert.equal(trimesterOf(14), 'Segundo trimestre');
});

test('devuelve las tres etiquetas', () => {
  assert.deepEqual(TRIMESTER_LABELS, [
    'Primer trimestre',
    'Segundo trimestre',
    'Tercer trimestre',
  ]);
  assert.equal(trimesterOf(37), 'Tercer trimestre');
});

test('una semana invalida no inventa trimestre', () => {
  assert.equal(trimesterNumber(null), null);
  assert.equal(trimesterNumber(''), null);
  assert.equal(trimesterNumber('abc'), null);
  assert.equal(trimesterNumber(0), null);
  assert.equal(trimesterOf(undefined), null);
});
