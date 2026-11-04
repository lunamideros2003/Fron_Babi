/*
  Comprobaciones de la burbuja del asistente.

  No monta React (el proyecto no trae un entorno de navegador simulado), pero
  revisa las piezas que mas facil se rompen en un refactor: que el widget use
  los endpoints correctos, que este montado en el layout y que la paleta
  morada y los estilos moviles sigan ahi.
*/

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

test('la burbuja esta montada en el layout privado', () => {
  assert.match(layout, /import ChatWidget from '\.\/chat\/ChatWidget\.jsx'/);
  assert.match(layout, /<ChatWidget \/>/);
});

test('la ventana carga los estilos propios', () => {
  assert.match(main, /import '\.\/styles\/chat-widget\.css'/);
});

test('el widget usa el saludo y el chat rapido', () => {
  assert.match(widget, /api\.chat\.welcome\(\)/);
  assert.match(widget, /api\.chat\.quick\(/);
  assert.match(widget, /Hazme preguntas sobre tu embarazo y resolvámoslas juntas/);
});

test('el cliente expone quick y welcome', () => {
  assert.match(client, /quick: \(message\) => request\('\/chat\/quick'/);
  assert.match(client, /welcome: \(\) => request\('\/chat\/welcome'\)/);
});

test('los botones tienen nombres accesibles', () => {
  assert.match(widget, /aria-label=\{open \? 'Cerrar el asistente' : 'Abrir el asistente'\}/);
  assert.match(composer, /aria-label="Enviar pregunta"/);
  assert.match(header, /aria-label="Cerrar el asistente"/);
  assert.match(header, /aria-label="Abrir el chat completo"/);
  assert.match(widget, /role="dialog"/);
});

test('el campo no pasa del maximo del endpoint', () => {
  assert.match(composer, /maxLength=\{maxLength\}/);
  assert.match(composer, /maxLength = 500/);
});

test('la paleta morada esta definida', () => {
  for (const token of ['--purple-50', '--purple-400', '--purple-600', '--purple-900']) {
    assert.ok(tokens.includes(`${token}:`), `falta ${token}`);
  }

  assert.match(styles, /var\(--purple-600\)/);
});

test('la ventana se adapta al movil', () => {
  assert.match(styles, /@media \(max-width: 640px\)/);
  assert.match(styles, /\.cw-panel/);
  assert.match(styles, /bottom: 148px/);
});

test('los mensajes especiales se marcan', () => {
  assert.match(message, /isEmergency \? 'Urgente' : 'Orientación'/);
  assert.match(message, /cw-msg-tag/);
});
