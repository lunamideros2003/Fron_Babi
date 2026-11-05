/*
  Comprueba que los avisos que se quitaron no vuelven a aparecer en las
  pantallas donde estaban. Es una prueba de texto: si alguien restaura el
  bloque por error, falla.
*/

import test from 'node:test';
import assert from 'node:assert/strict';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');
const SRC = fileURLToPath(new URL('../src', import.meta.url));

function walk(dir) {
  return readdirSync(dir).flatMap((entry) => {
    const full = join(dir, entry);
    return statSync(full).isDirectory() ? walk(full) : [full];
  });
}

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

test('los avisos eliminados no reaparecen en ninguna pantalla', () => {
  const frases = [
    /no sustituye la valoración de un profesional de salud/,
    /llamar siempre es mejor que esperar/,
    /describe lo más habitual/,
    /Esta herramienta no evalúa tu situación clínica/,
  ];

  for (const file of walk(SRC)) {
    if (!/\.(jsx?|css)$/.test(file)) continue;
    const texto = readFileSync(file, 'utf8');

    for (const frase of frases) {
      assert.doesNotMatch(texto, frase, `aviso restaurado en ${file}`);
    }
  }
});

test('el inicio no vuelve a la formula "Como una fruta"', () => {
  const page = read('../src/pages/DashboardPage.jsx');

  assert.doesNotMatch(page, /Cómo \$\{/);
  assert.doesNotMatch(page, /conArticulo/);
  assert.match(page, /sizeLabel/);
});

