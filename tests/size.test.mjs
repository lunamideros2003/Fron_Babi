import test from 'node:test';
import assert from 'node:assert/strict';

import { capitalize, sizeAriaLabel, sizeLabel } from '../src/utils/size.js';

test('builds the phrase without repeating the article', () => {
  assert.equal(sizeLabel('una sandía pequeña'), 'Del tamaño de una sandía pequeña');
  assert.equal(sizeLabel('un melón'), 'Del tamaño de un melón');
  assert.equal(sizeLabel('una lenteja'), 'Del tamaño de una lenteja');
});

test('without data it shows neutral text', () => {
  assert.equal(sizeLabel(null), 'Tamaño por confirmar');
  assert.equal(sizeLabel(''), 'Tamaño por confirmar');
  assert.equal(sizeAriaLabel(undefined), 'Tamaño por confirmar');
});

test('capitalizes only the first letter', () => {
  assert.equal(capitalize('una sandía pequeña'), 'Una sandía pequeña');
  assert.equal(capitalize('  un melón  '), 'Un melón');
  assert.equal(capitalize(''), '');
});

test('the accessible text describes the size', () => {
  assert.equal(
    sizeAriaLabel('una sandía pequeña'),
    'Del tamaño de una sandía pequeña',
  );
});
