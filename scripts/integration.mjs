// Verifies the frontend dev server proxies /api to the backend correctly.
// Run with the frontend dev server active: node scripts/integration.mjs
const WEB = process.env.WEB_URL ?? `http://localhost:${process.env.VITE_PORT ?? 5180}`;

let passed = 0;
let failed = 0;

function check(label, condition, extra = '') {
  if (condition) {
    passed += 1;
    console.log(`  OK   ${label}`);
  } else {
    failed += 1;
    console.log(`  FAIL ${label} ${extra}`);
  }
}

async function call(path, { method = 'GET', body, token } = {}) {
  const response = await fetch(`${WEB}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  return { status: response.status, json: await response.json().catch(() => ({})) };
}

const run = async () => {
  console.log('\nBabyTrack IA - integracion frontend/backend\n');

  const index = await fetch(WEB);
  const html = await index.text();
  check('frontend sirve la app', index.status === 200 && html.includes('root'));
  check('html en espanol', html.includes('lang="es"'));
  check('titulo de BabyTrack', html.includes('BabyTrack IA'));

  const health = await call('/api/health');
  check('proxy /api funciona', health.status === 200, JSON.stringify(health.json).slice(0, 120));
  check('IA disponible', ['openai', 'local'].includes(health.json.ai?.active), health.json.ai?.active);

  const email = `front${Date.now()}@babytrack.dev`;
  const register = await call('/api/auth/register', {
    method: 'POST',
    body: { name: 'Ana', email, password: 'clave123', currentWeek: 24 },
  });
  check('registro via proxy', register.status === 201, JSON.stringify(register.json).slice(0, 150));
  const token = register.json.token;

  const me = await call('/api/auth/me', { token });
  check('sesion activa', me.json.pregnancy?.current_week === 24, JSON.stringify(me.json.pregnancy).slice(0, 100));

  const chat = await call('/api/chat', {
    method: 'POST',
    token,
    body: { message: 'Que controles necesito en el segundo trimestre?' },
  });
  check('chat responde', chat.status === 200);
  check('clasifico como controles', chat.json.reply?.category === 'controles', chat.json.reply?.category);
  check('respuesta en espanol', /control|ecografia|trimestre/i.test(chat.json.reply?.content ?? ''));

  const weeks = await call('/api/weeks/24');
  check('detalle de semana 24', weeks.json.week?.week_number === 24);

  const gen = await call('/api/reminders/generate', { method: 'POST', token, body: { count: 3 } });
  check('recordatorios generados', gen.json.reminders?.length === 3);

  const timeline = await call('/api/tracking/timeline', { token });
  check('timeline completo', Boolean(timeline.json.week && timeline.json.pregnancy));

  console.log(`\nResultado: ${passed} correctos, ${failed} fallidos\n`);
  process.exit(failed === 0 ? 0 : 1);
};

run().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
