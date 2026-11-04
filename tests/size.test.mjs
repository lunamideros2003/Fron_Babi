import test from 'node:test';
import assert from 'node:assert/strict';

import { capitalize, sizeAriaLabel, sizeLabel } from '../src/utils/size.js';

test('compone la frase sin repetir el articulo', () => {
  assert.equal(sizeLabel('una sandía pequeña'), 'Del tamaño de una sandía pequeña');
  assert.equal(sizeLabel('un melón'), 'Del tamaño de un melón');
  assert.equal(sizeLabel('una lenteja'), 'Del tamaño de una lenteja');
});

test('sin dato muestra un texto neutro', () => {
  assert.equal(sizeLabel(null), 'Tamaño por confirmar');
  assert.equal(sizeLabel(''), 'Tamaño por confirmar');
  assert.equal(sizeAriaLabel(undefined), 'Tamaño por confirmar');
});

test('capitaliza solo la primera letra', () => {
  assert.equal(capitalize('una sandía pequeña'), 'Una sandía pequeña');
  assert.equal(capitalize('  un melón  '), 'Un melón');
  assert.equal(capitalize(''), '');
});

test('el texto accesible describe el tamano', () => {
  assert.equal(
    sizeAriaLabel('una sandía pequeña'),
    'Del tamaño de una sandía pequeña',
  );
});
