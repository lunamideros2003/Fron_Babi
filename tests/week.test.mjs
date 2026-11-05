import test from 'node:test';
import assert from 'node:assert/strict';

import { DEFAULT_WEEK, FIRST_WEEK, LAST_WEEK, parseWeekParam, resolveWeek } from '../src/utils/week.js';

test('acepta semanas dentro del rango', () => {
  assert.equal(parseWeekParam('37'), 37);
  assert.equal(parseWeekParam(4), 4);
  assert.equal(parseWeekParam(40), 40);
});

test('recorta las semanas fuera de rango', () => {
  assert.equal(parseWeekParam('999'), LAST_WEEK);
  assert.equal(parseWeekParam(0), FIRST_WEEK);
  assert.equal(parseWeekParam('-3'), FIRST_WEEK);
  assert.equal(parseWeekParam('41'), LAST_WEEK);
});

test('rechaza valores que no son enteros', () => {
  assert.equal(parseWeekParam(null), null);
  assert.equal(parseWeekParam(undefined), null);
  assert.equal(parseWeekParam(''), null);
  assert.equal(parseWeekParam('abc'), null);
  assert.equal(parseWeekParam('37.5'), null);
});

test('prioriza la URL sobre la semana actual', () => {
  assert.equal(resolveWeek({ param: '37', currentWeek: 20 }), 37);
  assert.equal(resolveWeek({ param: null, currentWeek: 24 }), 24);
  assert.equal(resolveWeek({ param: 'abc', currentWeek: 24 }), 24);
});

test('sin datos usa la semana 20', () => {
  assert.equal(resolveWeek(), DEFAULT_WEEK);
  assert.equal(resolveWeek({ param: null, currentWeek: null }), DEFAULT_WEEK);
  assert.equal(DEFAULT_WEEK, 20);
});
