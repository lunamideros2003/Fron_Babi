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

async function request(path, { method = 'GET', body, auth = true } = {}) {
  const token = auth ? getToken() : null;

  let response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'No se pudo conectar con el servidor. Verifica que el backend este corriendo.',
      0,
      'NETWORK_ERROR',
    );
  }

  if (response.status === 204) return null;

  const payload = await response.json().catch(() => ({}));

  if (!response.ok || payload.ok === false) {
    if (response.status === 401 && token) setToken(null);
    throw new ApiError(
      payload?.error?.message ?? 'Ocurrio un error inesperado.',
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
