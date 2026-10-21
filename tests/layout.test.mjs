/*
  Comprueba que la pagina de Inicio no necesita scroll vertical en pantalla.

  Se abre la aplicacion con un navegador sin interfaz, se inicia sesion y se
  mide la altura del documento en varios tamaños de pantalla. Si el contenido
  no cabe, la prueba falla.

  Si el navegador no esta disponible, la prueba se salta en lugar de
  romper: en un entorno de integracion continua puede no haber ninguno.
*/

import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';
import { existsSync } from 'node:fs';
import { spawn } from 'node:child_process';
import path from 'node:path';

const CHROME_PATHS = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
];

const WEB = process.env.WEB_URL ?? 'http://localhost:5180';
const API = process.env.API_URL ?? 'http://localhost:4001/api';
const PORT = 9333;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function findChrome() {
  return CHROME_PATHS.find((candidate) => existsSync(candidate)) ?? null;
}

async function isUp(url) {
  try {
    await fetch(url, { signal: AbortSignal.timeout(5000) });
    return true;
  } catch {
    return false;
  }
}

/** Crea una cuenta de prueba y devuelve su token. */
async function createSession() {
  const email = `layout-${Date.now()}@ejemplo.com`;
  const password = 'Test1234!.';

  await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Prueba Layout', email, password, dueDate: '2026-11-20' }),
  });

  const response = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const body = await response.json();
  return body.token ?? null;
}

/** Abre Chrome sin interfaz y devuelve una funcion para evaluar en la pagina. */
async function openBrowser(token) {
  const chromePath = findChrome();
  const profile = path.join(process.env.TEMP ?? '.', `babytrack-layout-${Date.now()}`);

  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${PORT}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--hide-scrollbars',
    '--window-size=1440,900',
    `--user-data-dir=${profile}`,
    'about:blank',
  ], { stdio: 'ignore' });

  let target = null;
  for (let attempt = 0; attempt < 40 && !target; attempt += 1) {
    await wait(500);
    try {
      const list = await (await fetch(`http://127.0.0.1:${PORT}/json/list`)).json();
      target = list.find((item) => item.type === 'page');
    } catch {
      /* el navegador aun no escucha */
    }
  }

  if (!target) {
    chrome.kill();
    throw new Error('el navegador no arranco');
  }

  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve) => { socket.onopen = resolve; });

  let id = 0;
  const pending = new Map();
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.id && pending.has(message.id)) {
      pending.get(message.id)(message);
      pending.delete(message.id);
    }
  };

  const send = (method, params = {}) => new Promise((resolve) => {
    id += 1;
    pending.set(id, resolve);
    socket.send(JSON.stringify({ id, method, params }));
  });

  const evaluate = async (expression) => {
    const result = await send('Runtime.evaluate', { expression, returnByValue: true, awaitPromise: true });
    const error = result?.result?.exceptionDetails;
    if (error) throw new Error(error.exception?.description ?? error.text);
    return result?.result?.result?.value;
  };

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.addScriptToEvaluateOnNewDocument', {
    source: `try { localStorage.setItem('babytrack_token', ${JSON.stringify(token)}); } catch (error) {}`,
  });
  await send('Page.navigate', { url: WEB });
  await wait(3500);

  return {
    evaluate,
    async viewport(width, height) {
      await send('Emulation.setDeviceMetricsOverride', {
        width, height, deviceScaleFactor: 1, mobile: width < 700,
      });
      await wait(900);
    },
    close() {
      socket.close();
      chrome.kill();
    },
  };
}

test('la pagina de Inicio cabe sin scroll en escritorio', async (t) => {
  if (!findChrome()) {
    t.skip('no hay navegador disponible en esta maquina');
    return;
  }

  if (!(await isUp(WEB)) || !(await isUp(`${API}/health`))) {
    t.skip('hacen falta la app y el backend levantados');
    return;
  }

  const token = await createSession();
  assert.ok(token, 'se necesita una sesion para medir la pagina');

  const browser = await openBrowser(token);

  try {
    for (const [nombre, width, height] of [
      ['portatil grande', 1440, 900],
      ['portatil pequeno', 1280, 720],
      ['tablet', 820, 1180],
    ]) {
      await browser.viewport(width, height);

      const medida = await browser.evaluate(`(function () {
        var documento = document.documentElement;
        var main = document.querySelector('.app-main');
        return {
          alto: documento.scrollHeight,
          visible: window.innerHeight,
          anchoMain: main ? Math.round(main.getBoundingClientRect().width) : 0,
          tieneHome: !!document.querySelector('.home'),
        };
      })()`);

      assert.ok(medida.tieneHome, `${nombre}: la pagina de Inicio no se renderizo`);
      assert.ok(
        medida.alto <= medida.visible + 2,
        `${nombre}: la pagina mide ${medida.alto}px y solo se ven ${medida.visible}px`,
      );
    }
  } finally {
    browser.close();
  }
});
