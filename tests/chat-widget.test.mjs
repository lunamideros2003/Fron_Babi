import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

const widget = read('../src/components/chat/ChatWidget.jsx');
const header = read('../src/components/chat/ChatHeader.jsx');
const composer = read('../src/components/chat/ChatComposer.jsx');
const message = read('../src/components/chat/ChatMessage.jsx');
const layout = read('../src/components/Layout.jsx');
const client = read('../src/api/client.js');
const tokens = read('../src/styles/tokens.css');
const styles = read('../src/styles/chat-widget.css');
const main = read('../src/main.jsx');

test('the bubble is mounted in the private layout', () => {
  assert.match(layout, /import ChatWidget from '\.\/chat\/ChatWidget\.jsx'/);
  assert.match(layout, /<ChatWidget \/>/);
});

test('the window loads its own styles', () => {
  assert.match(main, /import '\.\/styles\/chat-widget\.css'/);
});

test('the widget uses the greeting and quick chat', () => {
  assert.match(widget, /api\.chat\.welcome\(\)/);
  assert.match(widget, /api\.chat\.quick\(/);
  assert.match(widget, /Hazme preguntas sobre tu embarazo y resolvámoslas juntas/);
});

test('the client exposes quick and welcome', () => {
  assert.match(client, /quick: \(message\) => request\('\/chat\/quick'/);
  assert.match(client, /welcome: \(\) => request\('\/chat\/welcome'\)/);
});

test('the buttons have accessible names', () => {
  assert.match(widget, /aria-label=\{open \? 'Cerrar el asistente' : 'Abrir el asistente'\}/);
  assert.match(composer, /aria-label="Enviar pregunta"/);
  assert.match(header, /aria-label="Cerrar el asistente"/);
  assert.match(header, /aria-label="Abrir el chat completo"/);
  assert.match(widget, /role="dialog"/);
});

test('the field does not exceed the endpoint maximum', () => {
  assert.match(composer, /maxLength=\{maxLength\}/);
  assert.match(composer, /maxLength = 500/);
});

test('the purple palette is defined', () => {
  for (const token of ['--purple-50', '--purple-400', '--purple-600', '--purple-900']) {
    assert.ok(tokens.includes(`${token}:`), `falta ${token}`);
  }

  assert.match(styles, /var\(--purple-600\)/);
});

test('the window adapts to mobile', () => {
  assert.match(styles, /@media \(max-width: 640px\)/);
  assert.match(styles, /\.cw-panel/);
  assert.match(styles, /bottom: 148px/);
});

test('special messages are flagged', () => {
  assert.match(message, /isEmergency \? 'Urgente' : 'Orientación'/);
  assert.match(message, /cw-msg-tag/);
});
