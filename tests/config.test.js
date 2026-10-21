import test from 'node:test';
import assert from 'node:assert/strict';
import net from 'node:net';

import { describePortOwner } from '../vite.config.js';
import configFactory from '../vite.config.js';

function listenOn(port) {
  return new Promise((resolve, reject) => {
    const server = net.createServer();
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => resolve(server));
  });
}

test('detecta el puerto libre', () => {
  assert.equal(describePortOwner(5180), null);
});

test('detecta el proceso que ocupa el puerto', async () => {
  const port = 5199;
  const server = await listenOn(port);

  try {
    const owner = describePortOwner(port);
    assert.ok(owner, 'deberia encontrar al propietario del puerto');
    assert.match(owner, /PID \d+/);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
});

test('no falla cuando la herramienta no existe', () => {
  // En Linux sin lsof ni ss la comprobacion no debe romper nada.
  assert.doesNotThrow(() => describePortOwner(5180));
});

test('la comprobacion del puerto no se hace durante el build', () => {
  // En Vercel no hace falta comprobar nada: no hay otro proyecto local que
  // pueda estar usando el puerto y las herramientas pueden no existir.
  const config = configFactory({ mode: 'production', command: 'build' });

  assert.equal(config.plugins.length, 1);
  assert.ok(config.define['import.meta.env.VITE_BUILD_COMMIT']);
});

test('el commit del build se expone como version', () => {
  const previous = process.env.VERCEL_GIT_COMMIT_SHA;
  process.env.VERCEL_GIT_COMMIT_SHA = 'abcdef1234567890';

  try {
    const config = configFactory({ mode: 'production', command: 'build' });
    assert.equal(config.define['import.meta.env.VITE_BUILD_COMMIT'], '"abcdef1"');
  } finally {
    if (previous === undefined) delete process.env.VERCEL_GIT_COMMIT_SHA;
    else process.env.VERCEL_GIT_COMMIT_SHA = previous;
  }
});
