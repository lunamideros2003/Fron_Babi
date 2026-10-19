import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { BrandMark, MotherSilhouette } from '../components/Icons.jsx';

const FEATURES = [
  'Calcula tu semana desde tu fecha probable de parto',
  'Explica los cambios habituales de cada semana',
  'Asistente educativo que nunca hace diagnósticos',
  'Recordatorios y controles ordenados por categoría',
  'Tu diario personal para anotar cómo te sientes',
];

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function AuthPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    mode: 'dueDate',
    dueDate: '',
    lastPeriodDate: '',
    currentWeek: '',
    babyName: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const isRegister = mode === 'register';

  function update(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  function switchMode() {
    setMode(isRegister ? 'login' : 'register');
    setError('');
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      if (isRegister) {
        const payload = {
          name: form.name.trim(),
          email: form.email.trim(),
          password: form.password,
          babyName: form.babyName.trim() || undefined,
        };

        if (form.mode === 'dueDate' && form.dueDate) payload.dueDate = form.dueDate;
        if (form.mode === 'lastPeriod' && form.lastPeriodDate)
          payload.lastPeriodDate = form.lastPeriodDate;
        if (form.mode === 'week' && form.currentWeek)
          payload.currentWeek = Number(form.currentWeek);

        await register(payload);
      } else {
        await login({ email: form.email.trim(), password: form.password });
      }

      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message ?? 'No se pudo completar la operación.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-art">
        <div className="auth-art-inner">
          <BrandMark size={44} className="art-flourish" />
          <h1>Cada semana de tu embarazo, acompañada</h1>
          <p>
            Ordena tu información, entiende los cambios de cada etapa y resuelve tus dudas con un
            asistente educativo que nunca diagnostica.
          </p>
          <ul className="auth-features">
            {FEATURES.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
        <MotherSilhouette size={210} className="auth-art-figure" />
      </aside>

      <main className="auth-form-wrap">
        <div className="auth-card">
          <h2>{isRegister ? 'Crea tu cuenta' : 'Bienvenida de vuelta'}</h2>
          <p className="sub">
            {isRegister
              ? 'Registra tu fecha probable de parto para empezar el seguimiento.'
              : 'Ingresa para continuar tu seguimiento.'}
          </p>

          <form onSubmit={handleSubmit} className="stack auth-form">
            {error && (
              <div className="form-error" role="alert">
                {error}
              </div>
            )}

            <div className="field-row">
              {isRegister && (
                <div className="field">
                  <label htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    className="input"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Cómo te llamamos"
                    autoComplete="name"
                    required
                    minLength={2}
                  />
                </div>
              )}

              <div className="field">
                <label htmlFor="email">Correo</label>
                <input
                  id="email"
                  type="email"
                  className="input"
                  value={form.email}
                  onChange={update('email')}
                  placeholder="tu@correo.com"
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="password">Contraseña</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Mínimo 6 caracteres"
                  autoComplete={isRegister ? 'new-password' : 'current-password'}
                  required
                  minLength={6}
                />
              </div>

              {isRegister && (
                <div className="field">
                  <label htmlFor="babyName">Nombre del bebé</label>
                  <input
                    id="babyName"
                    className="input"
                    value={form.babyName}
                    onChange={update('babyName')}
                    placeholder="Opcional"
                  />
                </div>
              )}
            </div>

            {isRegister && (
              <>
                <div className="field">
                  <label htmlFor="calcMode">Cómo calculamos tu semana</label>
                  <select
                    id="calcMode"
                    className="select"
                    value={form.mode}
                    onChange={update('mode')}
                  >
                    <option value="dueDate">Tengo la fecha probable de parto</option>
                    <option value="lastPeriod">Sé mi última menstruación</option>
                    <option value="week">Ya sé en qué semana estoy</option>
                  </select>
                </div>

                {form.mode === 'dueDate' && (
                  <div className="field">
                    <label htmlFor="dueDate">Fecha probable de parto</label>
                    <input
                      id="dueDate"
                      type="date"
                      className="input"
                      value={form.dueDate}
                      min={todayISO()}
                      onChange={update('dueDate')}
                    />
                  </div>
                )}

                {form.mode === 'lastPeriod' && (
                  <div className="field">
                    <label htmlFor="lastPeriod">Primer día de tu última menstruación</label>
                    <input
                      id="lastPeriod"
                      type="date"
                      className="input"
                      value={form.lastPeriodDate}
                      max={todayISO()}
                      onChange={update('lastPeriodDate')}
                    />
                    <span className="field-hint">Sumamos 280 días a esa fecha.</span>
                  </div>
                )}

                {form.mode === 'week' && (
                  <div className="field">
                    <label htmlFor="week">Semana actual</label>
                    <input
                      id="week"
                      type="number"
                      className="input"
                      value={form.currentWeek}
                      min={1}
                      max={42}
                      onChange={update('currentWeek')}
                      placeholder="Ej.: 20"
                    />
                    <span className="field-hint">El cálculo se ajustará a esa semana.</span>
                  </div>
                )}
              </>
            )}

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy && <span className="loader" style={{ width: 15, height: 15 }} />}
              {isRegister ? 'Crear mi cuenta' : 'Entrar'}
            </button>
          </form>

          <p className="auth-switch">
            {isRegister ? '¿Ya tienes cuenta? ' : '¿Aún no tienes cuenta? '}
            <button type="button" onClick={switchMode}>
              {isRegister ? 'Ingresa' : 'Regístrate'}
            </button>
          </p>

          <div className="demo-box">
            {isRegister
              ? 'Tus datos quedan asociados a tu cuenta y no se comparten con terceros.'
              : 'BabyTrack ofrece información educativa. No sustituye tus controles prenatales ni un diagnóstico profesional.'}
          </div>
        </div>
      </main>
    </div>
  );
}
