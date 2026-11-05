const WEB = process.env.WEB_URL ?? `http://localhost:${process.env.VITE_PORT ?? 5180}`;
const API = process.env.API_URL ?? 'http://localhost:4001/api';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.log('\nBrowser bot test skipped: Playwright is not installed.');
  console.log('Install it with:');
  console.log('  npm i -D playwright');
  console.log('  npx playwright install chromium\n');
  process.exit(0);
}

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

const email = `uibot${Date.now()}@babytrack.dev`;

const register = await fetch(`${API}/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ name: 'Ana', email, password: 'secreta123', currentWeek: 20 }),
}).then((r) => r.json());

const token = register.token;

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });

await page.addInitScript((value) => {
  localStorage.setItem('babytrack_token', value);
}, token);

console.log('\nBabyTrack IA - browser bot test\n');

await page.goto(`${WEB}/bot`, { waitUntil: 'networkidle' });
check('/bot route loads', await page.locator('h1').first().textContent().then((t) => t.includes('Consulta guiada')));
check('Bot link in navigation', (await page.locator('nav a', { hasText: 'Bot' }).count()) > 0);
check('start screen visible', (await page.getByText('Empezar la consulta').count()) > 0);

await page.getByRole('button', { name: 'Empezar la consulta' }).click();
await page.waitForTimeout(700);

check('opens the first question', (await page.getByText('A que semana estas ahora mismo?').count()) > 0);
check('shows progress', (await page.getByText('Pregunta 1 de 10').count()) > 0);
check('progress bar', (await page.locator('.progress-bar').count()) > 0);

await page.getByRole('button', { name: /Segundo trimestre/ }).click();
await page.waitForTimeout(700);
check('answers and advances', (await page.getByText('Es tu primer embarazo?').count()) > 0);
check('shows bot feedback', (await page.locator('.bot-feedback').count()) > 0);

await page.getByRole('button', { name: /Si, es el primero/ }).click();
await page.waitForTimeout(700);
check('reaches the scale', (await page.getByText('Como ha estado tu energia').count()) > 0);

const scaleButtons = page.locator('.bot-scale button');
check('scale with 5 options', (await scaleButtons.count()) === 5);
await scaleButtons.nth(1).click();
await page.waitForTimeout(700);
check('scale answers and advances', (await page.getByText('Que sintomas has tenido').count()) > 0);

const multiOptions = page.locator('.bot-option');
check('multiple options', (await multiOptions.count()) === 6);
await multiOptions.nth(0).click();
await page.getByRole('button', { name: 'Confirmar' }).click();
await page.waitForTimeout(700);
check('multiple advances', (await page.getByText('Cuantas comidas al dia haces').count()) > 0);

await page.getByRole('button', { name: 'Tres' }).click();
await page.waitForTimeout(600);
await page.getByRole('button', { name: /A veces, se me olvida/ }).click();
await page.waitForTimeout(600);

await page.getByRole('button', { name: /Solo a veces/ }).click();
await page.waitForTimeout(600);

await page.getByRole('button', { name: 'Mi animo y mis emociones' }).click();
await page.waitForTimeout(600);

await page.getByRole('button', { name: 'No, todavia no' }).click();
await page.waitForTimeout(600);

check('reaches the open question', (await page.locator('textarea').count()) > 0);
await page.locator('textarea').fill('Me cuesta dormir por las noches');
await page.getByRole('button', { name: 'Enviar' }).click();
await page.waitForTimeout(900);

check('shows the summary', (await page.getByText('Resumen de tu consulta').count()) > 0);
check('shows the score', (await page.locator('.score-circle').count()) > 0);
check('offers another check-in', (await page.getByText('Hacer otra consulta').count()) > 0);

const summaryText = await page.locator('.bot-feedback p').last().textContent();
check('summary with content', (summaryText?.length ?? 0) > 40, `${summaryText?.length} chars`);
check('summary without diagnoses', !/diagnostic|recet|medicament/i.test(summaryText ?? ''));
check('mentions score out of 12', /de 12/.test(summaryText ?? ''));

const feedbackTexts = await page.locator('.bot-feedback p').allTextContents();
const allFeedback = feedbackTexts.join(' ');
check('no feedback with diagnoses', !/diagnostic|recet|medicament/i.test(allFeedback));

await page.screenshot({ path: 'bot-summary.png', fullPage: true });

await page.getByRole('button', { name: 'Hacer otra consulta' }).click();
await page.waitForTimeout(800);
check('restarts the flow', (await page.getByText('A que semana estas ahora mismo?').count()) > 0);
check('sidebar lists sessions', (await page.getByText('Consulta completada').count()) > 0);

await page.screenshot({ path: 'bot-questions.png', fullPage: true });

const overflow = await page.evaluate(() => {
  const el = document.querySelector('.bot-panel');
  return el ? el.scrollHeight - el.clientHeight : 0;
});
check('bot panel without overflow', overflow <= 2, `overflow ${overflow}px`);

await browser.close();

console.log(`\nResult: ${passed} passed, ${failed} failed\n`);
process.exit(failed === 0 ? 0 : 1);
