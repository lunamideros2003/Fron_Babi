/*
  Comprueba que los avisos que se quitaron no vuelven a aparecer en las
  pantallas donde estaban. Es una prueba de texto: si alguien restaura el
  bloque por error, falla.
*/

import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

test('seguridad no tiene el cartel educativo', () => {
  const page = read('../src/pages/SafetyPage.jsx');

  assert.doesNotMatch(page, /safety-banner/);
  assert.doesNotMatch(page, /no sustituye la valoración de un profesional de salud/);
});

test('la semana no tiene la nota sobre lo habitual', () => {
  const page = read('../src/pages/WeekPage.jsx');

  assert.doesNotMatch(page, /week-note/);
  assert.doesNotMatch(page, /describe lo más habitual/);
});

test('el chat no tiene el aviso clinico del panel lateral', () => {
  const page = read('../src/pages/ChatPage.jsx');

  assert.doesNotMatch(page, /Esta herramienta no evalúa tu situación clínica/);
  assert.doesNotMatch(page, /contacta de inmediato a tu equipo médico\. Esta herramienta/);
});

test('la guia no repite el aviso en la introduccion', () => {
  const page = read('../src/pages/GuidePage.jsx');

  assert.doesNotMatch(page, /Contenido educativo: no sustituye/);
});
