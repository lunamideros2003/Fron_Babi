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

test('safety has no educational banner', () => {
  const page = read('../src/pages/SafetyPage.jsx');

  assert.doesNotMatch(page, /safety-banner/);
  assert.doesNotMatch(page, /no sustituye la valoración de un profesional de salud/);
});

test('the week page has no note about what is usual', () => {
  const page = read('../src/pages/WeekPage.jsx');

  assert.doesNotMatch(page, /week-note/);
  assert.doesNotMatch(page, /describe lo más habitual/);
});

test('the chat has no clinical notice in the side panel', () => {
  const page = read('../src/pages/ChatPage.jsx');

  assert.doesNotMatch(page, /Esta herramienta no evalúa tu situación clínica/);
  assert.doesNotMatch(page, /contacta de inmediato a tu equipo médico\. Esta herramienta/);
});

test('the guide does not repeat the notice in the intro', () => {
  const page = read('../src/pages/GuidePage.jsx');

  assert.doesNotMatch(page, /Contenido educativo: no sustituye/);
});

test('removed notices do not reappear on any screen', () => {
  const phrases = [
    /no sustituye la valoración de un profesional de salud/,
    /llamar siempre es mejor que esperar/,
    /describe lo más habitual/,
    /Esta herramienta no evalúa tu situación clínica/,
  ];

  for (const file of walk(SRC)) {
    if (!/\.(jsx?|css)$/.test(file)) continue;
    const text = readFileSync(file, 'utf8');

    for (const phrase of phrases) {
      assert.doesNotMatch(text, phrase, `notice restored in ${file}`);
    }
  }
});

test('the home page does not return to the "Like a fruit" wording', () => {
  const page = read('../src/pages/DashboardPage.jsx');

  assert.doesNotMatch(page, /Cómo \$\{/);
  assert.doesNotMatch(page, /conArticulo/);
  assert.match(page, /sizeLabel/);
});

