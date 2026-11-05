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

test('detects a free port', () => {
  assert.equal(describePortOwner(5180), null);
});

test('detects the process occupying the port', async () => {
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

test('does not fail when the tool is missing', () => {

  assert.doesNotThrow(() => describePortOwner(5180));
});

test('the port check is skipped during build', () => {

  const config = configFactory({ mode: 'production', command: 'build' });

  assert.ok(config.plugins.length >= 1);
  assert.ok(config.define['import.meta.env.VITE_BUILD_COMMIT']);
  assert.ok(
    config.plugins.some((plugin) => plugin.name === 'babytrack-build-version'),
    'debe incluir el plugin que escribe version.json',
  );
});

test('the build commit is exposed as version', () => {
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
