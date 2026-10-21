import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import './styles/tokens.css';
import './styles/app.css';
import './styles/layout.css';
import './styles/home.css';
import './styles/guide.css';
import './styles/journal.css';
import './styles/week.css';
import './styles/appointments.css';

const BUILD_COMMIT = import.meta.env.VITE_BUILD_COMMIT ?? '';
const RECHECK_KEY = 'babytrack_version_reload';

/**
 * Si el servidor ya tiene una version mas nueva que la que esta corriendo el
 * navegador, se recarga una sola vez para no dejar a nadie con una version
 * antigua. Asi un despliegue nuevo llega sin depender de una recarga manual.
 */
async function refreshIfOutdated() {
  if (!BUILD_COMMIT || BUILD_COMMIT === 'local') return;

  try {
    const response = await fetch('/version.json', { cache: 'no-store' });
    if (!response.ok) return;

    const { commit } = await response.json();
    if (!commit || commit === BUILD_COMMIT) return;

    // Solo una recarga por version, para no entrar en un bucle.
    if (sessionStorage.getItem(RECHECK_KEY) === commit) return;
    sessionStorage.setItem(RECHECK_KEY, commit);
    window.location.reload();
  } catch {
    /* sin version.json no hay nada que comprobar */
  }
}

refreshIfOutdated();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
