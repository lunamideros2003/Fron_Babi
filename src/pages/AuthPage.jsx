import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { BrandMark } from '../components/Icons.jsx';

const FEATURES = [
  'Calcula tu semana desde tu fecha estimada de parto',
  'Explica los cambios tipicos de cada semana',
  'Asistente IA que clasifica tus preguntas por categoria',
  'Recordatorios personalizados para tu trimestre',
  'Historial de consultas, controles y seguimiento',
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
      setError(err.message ?? 'No se pudo completar la operacion.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="auth-page">
      <aside className="auth-art">
        <div className="auth-art-inner">
          <BrandMark size={46} className="art-flourish" />
          <h1>Cada semana de tu embarazo, acompañada</h1>
          <p>
            Organiza tu informacion, entiende los cambios de cada etapa y resuelve tus dudas
            con un asistente educativo que nunca diagnostica.
          </p>
          <ul className="auth-features">
            {FEATURES.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </aside>

      <main className="auth-form-wrap">
        <div className="auth-card">
          <h2>{isRegister ? 'Crea tu cuenta' : 'Bienvenida de vuelta'}</h2>
          <p className="sub">
            {isRegister
              ? 'Registra tu fecha de parto para empezar el seguimiento.'
              : 'Ingresa para continuar tu seguimiento.'}
          </p>

          <form onSubmit={handleSubmit} className="stack auth-form">
            {error && <div className="form-error">{error}</div>}

            <div className="field-row">
              {isRegister && (
                <div className="field">
                  <label htmlFor="name">Nombre</label>
                  <input
                    id="name"
                    className="input"
                    value={form.name}
                    onChange={update('name')}
                    placeholder="Como te llamamos"
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
                  required
                />
              </div>
            </div>

            <div className="field-row">
              <div className="field">
                <label htmlFor="password">Contrasena</label>
                <input
                  id="password"
                  type="password"
                  className="input"
                  value={form.password}
                  onChange={update('password')}
                  placeholder="Minimo 6 caracteres"
                  required
                  minLength={6}
                />
              </div>

              {isRegister && (
                <div className="field">
                  <label htmlFor="babyName">Nombre del bebe</label>
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
                  <label htmlFor="calcMode">Como calculamos tu semana</label>
                  <select
                    id="calcMode"
                    className="select"
                    value={form.mode}
                    onChange={update('mode')}
                  >
                    <option value="dueDate">Tengo la fecha estimada de parto</option>
                    <option value="lastPeriod">Se mi ultima menstruacion</option>
                    <option value="week">Ya se en que semana estoy</option>
                  </select>
                </div>

                {form.mode === 'dueDate' && (
                  <div className="field">
                    <label htmlFor="dueDate">Fecha estimada de parto</label>
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
                    <label htmlFor="lastPeriod">Primer dia de tu ultima menstruacion</label>
                    <input
                      id="lastPeriod"
                      type="date"
                      className="input"
                      value={form.lastPeriodDate}
                      max={todayISO()}
                      onChange={update('lastPeriodDate')}
                    />
                    <span className="field-hint">Sumamos 280 dias a esa fecha.</span>
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
                      placeholder="Ej: 20"
                    />
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
            {isRegister ? 'Ya tienes cuenta? ' : 'Aun no tienes cuenta? '}
            <button type="button" onClick={switchMode}>
              {isRegister ? 'Ingresa' : 'Registrate'}
            </button>
          </p>

          {isRegister && (
            <div className="demo-box">
              Usa cualquier correo y una contrasena de 6 caracteres o mas. Tus datos se guardan
              solo en tu equipo.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
