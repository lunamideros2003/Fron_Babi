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
  console.log('\nBabyTrack IA - frontend/backend integration\n');

  const index = await fetch(WEB);
  const html = await index.text();
  check('frontend serves the app', index.status === 200 && html.includes('root'));
  check('html in Spanish', html.includes('lang="es"'));
  check('BabyTrack title', html.includes('BabyTrack IA'));

  const health = await call('/api/health');
  check('/api proxy works', health.status === 200, JSON.stringify(health.json).slice(0, 120));
  check('AI available', ['openai', 'local'].includes(health.json.ai?.active), health.json.ai?.active);

  const email = `front${Date.now()}@babytrack.dev`;
  const register = await call('/api/auth/register', {
    method: 'POST',
    body: { name: 'Ana', email, password: 'clave123', currentWeek: 24 },
  });
  check('registration via proxy', register.status === 201, JSON.stringify(register.json).slice(0, 150));
  const token = register.json.token;

  const me = await call('/api/auth/me', { token });
  check('active session', me.json.pregnancy?.current_week === 24, JSON.stringify(me.json.pregnancy).slice(0, 100));

  const chat = await call('/api/chat', {
    method: 'POST',
    token,
    body: { message: 'Que controles necesito en el segundo trimestre?' },
  });
  check('chat responds', chat.status === 200);
  check('classified as checkups', chat.json.reply?.category === 'controles', chat.json.reply?.category);
  check('response in Spanish', /control|ecografia|trimestre/i.test(chat.json.reply?.content ?? ''));

  const welcome = await call('/api/chat/welcome', { token });
  check(
    'bubble greeting',
    welcome.status === 200 && welcome.json.greeting?.includes('Hazme preguntas'),
    JSON.stringify(welcome.json).slice(0, 150),
  );
  check('greeting with the name', welcome.json.greeting?.includes('Ana'), welcome.json.greeting);
  check('four suggestions', welcome.json.suggestions?.length === 4);

  const quick = await call('/api/chat/quick', {
    method: 'POST',
    token,
    body: { message: 'Que puedo comer?' },
  });
  check('quick chat responds', quick.status === 200 && quick.json.quick === true);
  check('quick chat with provider', Boolean(quick.json.reply?.provider), quick.json.reply?.provider);

  const quickShort = await call('/api/chat/quick', {
    method: 'POST',
    token,
    body: { message: 'x' },
  });
  check('quick chat validates the question', quickShort.status === 422, String(quickShort.status));

  const weeks = await call('/api/weeks/24');
  check('week 24 detail', weeks.json.week?.week_number === 24);

  const week37 = await call('/api/weeks/37');
  check(
    'week 37 with a small watermelon',
    week37.json.week?.size_comparison === 'una sandía pequeña',
    week37.json.week?.size_comparison,
  );
  check(
    'week 37 in the third trimester',
    week37.json.trimester === 'Tercer trimestre',
    week37.json.trimester,
  );
  check('week 37 weighs 2859 g', week37.json.week?.typical_weight === '2859 g');

  const outOfRange = await call('/api/weeks/41');
  check('out-of-range week returns 404', outOfRange.status === 404, String(outOfRange.status));

  const list = await call('/api/weeks');
  check('list of 37 weeks', list.json.total === 37, String(list.json.total));
  check(
    'the list includes the trimester',
    list.json.weeks?.[0]?.trimester === 'Primer trimestre',
    list.json.weeks?.[0]?.trimester,
  );

  const gen = await call('/api/reminders/generate', { method: 'POST', token, body: { count: 3 } });
  check('reminders generated', gen.json.reminders?.length === 3);

  const timeline = await call('/api/tracking/timeline', { token });
  check('complete timeline', Boolean(timeline.json.week && timeline.json.pregnancy));

  console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
  process.exit(failed === 0 ? 0 : 1);
};

run().catch((error) => {
  console.error('Error:', error.message);
  process.exit(1);
});
