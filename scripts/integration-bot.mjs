// Drives the questionnaire bot in a real browser to confirm the whole flow works.
// Run with both dev servers active: npm run test:bot
// Requires Playwright, which is optional: npm i -D playwright && npx playwright install chromium
const WEB = process.env.WEB_URL ?? `http://localhost:${process.env.VITE_PORT ?? 5180}`;
const API = process.env.API_URL ?? 'http://localhost:4001/api';

let chromium;
try {
  ({ chromium } = await import('playwright'));
} catch {
  console.log('\nPrueba del bot en navegador omitida: Playwright no esta instalado.');
  console.log('Instalalo con:');
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

console.log('\nBabyTrack IA - prueba del bot en el navegador\n');

await page.goto(`${WEB}/bot`, { waitUntil: 'networkidle' });
check('ruta /bot carga', await page.locator('h1').first().textContent().then((t) => t.includes('Consulta guiada')));
check('enlace Bot en la navegacion', (await page.locator('nav a', { hasText: 'Bot' }).count()) > 0);
check('pantalla de inicio visible', (await page.getByText('Empezar la consulta').count()) > 0);

await page.getByRole('button', { name: 'Empezar la consulta' }).click();
await page.waitForTimeout(700);

check('abre la primera pregunta', (await page.getByText('A que semana estas ahora mismo?').count()) > 0);
check('muestra progreso', (await page.getByText('Pregunta 1 de 10').count()) > 0);
check('barra de progreso', (await page.locator('.progress-bar').count()) > 0);

// Question 1: single choice
await page.getByRole('button', { name: /Segundo trimestre/ }).click();
await page.waitForTimeout(700);
check('responde y avanza', (await page.getByText('Es tu primer embarazo?').count()) > 0);
check('muestra feedback del bot', (await page.locator('.bot-feedback').count()) > 0);

// Question 2: single choice
await page.getByRole('button', { name: /Si, es el primero/ }).click();
await page.waitForTimeout(700);
check('llega a la escala', (await page.getByText('Como ha estado tu energia').count()) > 0);

// Question 3: scale
const scaleButtons = page.locator('.bot-scale button');
check('escala con 5 opciones', (await scaleButtons.count()) === 5);
await scaleButtons.nth(1).click();
await page.waitForTimeout(700);
check('escala responde y avanza', (await page.getByText('Que sintomas has tenido').count()) > 0);

// Question 4: multi choice
const multiOptions = page.locator('.bot-option');
check('opciones multiple', (await multiOptions.count()) === 6);
await multiOptions.nth(0).click();
await page.getByRole('button', { name: 'Confirmar' }).click();
await page.waitForTimeout(700);
check('multiple avanza', (await page.getByText('Cuantas comidas al dia haces').count()) > 0);

// Question 5 and 6
await page.getByRole('button', { name: 'Tres' }).click();
await page.waitForTimeout(600);
await page.getByRole('button', { name: /A veces, se me olvida/ }).click();
await page.waitForTimeout(600);

// Question 7
await page.getByRole('button', { name: /Solo a veces/ }).click();
await page.waitForTimeout(600);

// Question 8
await page.getByRole('button', { name: 'Mi animo y mis emociones' }).click();
await page.waitForTimeout(600);

// Question 9
await page.getByRole('button', { name: 'No, todavia no' }).click();
await page.waitForTimeout(600);

// Question 10: text
check('llega a la pregunta abierta', (await page.locator('textarea').count()) > 0);
await page.locator('textarea').fill('Me cuesta dormir por las noches');
await page.getByRole('button', { name: 'Enviar' }).click();
await page.waitForTimeout(900);

check('muestra el resumen', (await page.getByText('Resumen de tu consulta').count()) > 0);
check('muestra el puntaje', (await page.locator('.score-circle').count()) > 0);
check('ofrece otro check-in', (await page.getByText('Hacer otra consulta').count()) > 0);

const summaryText = await page.locator('.bot-feedback p').last().textContent();
check('resumen con contenido', (summaryText?.length ?? 0) > 40, `${summaryText?.length} chars`);
check('resumen sin diagnosticos', !/diagnostic|recet|medicament/i.test(summaryText ?? ''));
check('menciona puntaje de 12', /de 12/.test(summaryText ?? ''));

const feedbackTexts = await page.locator('.bot-feedback p').allTextContents();
const allFeedback = feedbackTexts.join(' ');
check('ningun feedback con diagnosticos', !/diagnostic|recet|medicament/i.test(allFeedback));

await page.screenshot({ path: 'bot-summary.png', fullPage: true });

// Resume from history
await page.getByRole('button', { name: 'Hacer otra consulta' }).click();
await page.waitForTimeout(800);
check('reinicia el flujo', (await page.getByText('A que semana estas ahora mismo?').count()) > 0);
check('sidebar lista sesiones', (await page.getByText('Consulta completada').count()) > 0);

await page.screenshot({ path: 'bot-questions.png', fullPage: true });

const overflow = await page.evaluate(() => {
  const el = document.querySelector('.bot-panel');
  return el ? el.scrollHeight - el.clientHeight : 0;
});
check('panel del bot sin desbordes', overflow <= 2, `desborde ${overflow}px`);

await browser.close();

console.log(`\nResultado: ${passed} correctos, ${failed} fallidos\n`);
process.exit(failed === 0 ? 0 : 1);
