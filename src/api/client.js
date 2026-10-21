const BASE_URL = import.meta.env.VITE_API_URL ?? '/api';

const TOKEN_KEY = 'babytrack_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) localStorage.setItem(TOKEN_KEY, token);
  else localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, status, code, details) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// El backend vive en el plan gratuito de Render, que se apaga cuando no
// recibe visitas. Cuando vuelve a encenderse la primera peticion puede tardar
// medio minuto, asi que se espera bastante antes de rendirse.
const TIMEOUT_MS = 90_000;
const RETRY_DELAY_MS = 4000;

const NETWORK_MESSAGE =
  'No se pudo conectar con el servidor. Revisa tu conexión a internet e inténtalo de nuevo.';
const TIMEOUT_MESSAGE =
  'El servidor tardó mucho en responder. Es su primer arranque tras un rato sin visitas: prueba otra vez en unos segundos.';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url, options) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function request(path, { method = 'GET', body, auth = true, retried = false } = {}) {
  const token = auth ? getToken() : null;

  let response;
  try {
    response = await fetchWithTimeout(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (error) {
    const timedOut = error?.name === 'AbortError';

    // Un fallo de red al primer intento suele ser el servidor despertando.
    // Se reintenta una vez antes de avisar a la persona.
    if (!retried) {
      await wait(RETRY_DELAY_MS);
      return await request(path, { method, body, auth, retried: true });
    }

    throw new ApiError(
      timedOut ? TIMEOUT_MESSAGE : NETWORK_MESSAGE,
      0,
      timedOut ? 'TIMEOUT' : 'NETWORK_ERROR',
    );
  }

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.ok === false) {
    if (response.status === 401 && token) setToken(null);
    throw new ApiError(
      payload?.error?.message ?? 'Ocurrió un error inesperado.',
      response.status,
      payload?.error?.code ?? 'UNKNOWN',
      payload?.error?.details ?? null,
    );
  }

  return payload;
}

export const api = {
  health: () => request('/health', { auth: false }),

  auth: {
    register: (data) => request('/auth/register', { method: 'POST', body: data, auth: false }),
    login: (data) => request('/auth/login', { method: 'POST', body: data, auth: false }),
    me: () => request('/auth/me'),
    updateProfile: (data) => request('/auth/me', { method: 'PATCH', body: data }),
  },

  weeks: {
    list: () => request('/weeks', { auth: false }),
    get: (number) => request(`/weeks/${number}`, { auth: false }),
    calculate: (params) => request(`/weeks/calculate?${params}`, { auth: false }),
  },

  guide: {
    get: () => request('/guide', { auth: false }),
  },

  journal: {
    list: () => request('/journal'),
    create: (data) => request('/journal', { method: 'POST', body: data }),
    remove: (id) => request(`/journal/${id}`, { method: 'DELETE' }),
  },

  pregnancy: {
    get: () => request('/pregnancy'),
    save: (data) => request('/pregnancy', { method: 'PUT', body: data }),
  },

  appointments: {
    list: (scope = 'all') => request(`/appointments?scope=${scope}`),
    create: (data) => request('/appointments', { method: 'POST', body: data }),
    update: (id, data) => request(`/appointments/${id}`, { method: 'PUT', body: data }),
    remove: (id) => request(`/appointments/${id}`, { method: 'DELETE' }),
  },

  reminders: {
    list: (includeCompleted = false) => request(`/reminders?all=${includeCompleted}`),
    create: (data) => request('/reminders', { method: 'POST', body: data }),
    generate: (count = 5) => request('/reminders/generate', { method: 'POST', body: { count } }),
    toggle: (id) => request(`/reminders/${id}/toggle`, { method: 'PATCH' }),
    remove: (id) => request(`/reminders/${id}`, { method: 'DELETE' }),
  },

  chat: {
    send: (message) => request('/chat', { method: 'POST', body: { message } }),
    history: () => request('/chat/history'),
    categories: () => request('/chat/categories'),
    clear: () => request('/chat/history', { method: 'DELETE' }),
  },

  bot: {
    questions: () => request('/bot/questions'),
    sessions: () => request('/bot/sessions'),
    start: () => request('/bot/sessions', { method: 'POST' }),
    session: (id) => request(`/bot/sessions/${id}`),
    answer: (id, payload) => request(`/bot/sessions/${id}/answers`, { method: 'POST', body: payload }),
    remove: (id) => request(`/bot/sessions/${id}`, { method: 'DELETE' }),
    reset: () => request('/bot/reset', { method: 'POST' }),
  },

  tracking: {
    timeline: () => request('/tracking/timeline'),
    addCheckup: (data) => request('/tracking/checkups', { method: 'POST', body: data }),
    addSymptom: (data) => request('/tracking/symptoms', { method: 'POST', body: data }),
    checkups: () => request('/tracking/checkups'),
    symptoms: () => request('/tracking/symptoms'),
  },
};

export default api;
