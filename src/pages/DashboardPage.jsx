import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client.js';
import Disclaimer from '../components/Disclaimer.jsx';
import { FloralCorner, SparkleIcon, CalendarIcon, CheckIcon, MotherSilhouette } from '../components/Icons.jsx';
import { formatDate, formatDateTime, relativeDay } from '../utils/format.js';

export default function DashboardPage() {
  const { user, pregnancy, refresh } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [health, setHealth] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [reminderData, appointmentData, healthData] = await Promise.all([
          api.reminders.list(),
          api.appointments.list('upcoming'),
          api.health().catch(() => null),
        ]);

        if (!active) return;
        setReminders(reminderData.reminders ?? []);
        setAppointments(appointmentData.appointments ?? []);
        setHealth(healthData);
      } catch {
        if (active) {
          setReminders([]);
          setAppointments([]);
        }
      }
    }

    load();
    return () => {
      active = false;
    };
  }, [pregnancy?.current_week]);

  async function handleGenerate() {
    setGenerating(true);
    try {
      const data = await api.reminders.generate(5);
      setReminders((prev) => [...data.reminders, ...prev]);
    } catch {
      /* handled by the empty state */
    } finally {
      setGenerating(false);
    }
  }

  async function handleToggle(id) {
    setReminders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_completed: item.is_completed ? 0 : 1 } : item)),
    );
    try {
      await api.reminders.toggle(id);
    } catch {
      refresh();
    }
  }

  if (!pregnancy) {
    return (
      <div className="stack">
        <div className="page-head">
          <p className="eyebrow">Hola {user?.name?.split(' ')[0]}</p>
          <h1>Aun no tenemos tu fecha de parto</h1>
          <p className="lede">
            Registrala para que el sistema calcule tu semana y personalice toda la informacion.
          </p>
        </div>
        <WeekSetupCard />
        <Disclaimer />
      </div>
    );
  }

  const week = pregnancy.week;

  return (
    <div className="stack">
      <section className="hero">
        <FloralCorner size={230} className="hero-deco" />
        <p className="eyebrow">
          {pregnancy.trimester_label}
          {pregnancy.baby_name ? ` de ${pregnancy.baby_name}` : ''}
        </p>
        <h1>Semana {pregnancy.current_week} de 40</h1>
        <p className="week-sub">{week ? week.title : 'Embarazo en curso'}</p>

        <div className="hero-stats">
          <div>
            <div className="hero-stat-value">{pregnancy.days_left}</div>
            <div className="hero-stat-label">Dias restantes</div>
          </div>
          <div>
            <div className="hero-stat-value">
              {pregnancy.current_day}/{280}
            </div>
            <div className="hero-stat-label">Dia de embarazo</div>
          </div>
          <div>
            <div className="hero-stat-value">{week?.size_comparison ?? '...'}</div>
            <div className="hero-stat-label">Tamano aproximado</div>
          </div>
        </div>

        <div className="progress">
          <div className="progress-bar" style={{ width: `${pregnancy.progress_percent}%` }} />
        </div>

        {pregnancy.is_overdue && (
          <div className="hero-alert">
            Tu fecha estimada ya paso. La mayoria de los bebes llegan hasta la semana 42. Tu
            obstetra te indicara los siguientes pasos.
          </div>
        )}
      </section>

      <div className="grid grid-4">
        <div className="stat-tile">
          <div className="value">{pregnancy.current_week}</div>
          <div className="label">Semana actual</div>
        </div>
        <div className="stat-tile">
          <div className="value">{week?.typical_weight ?? '...'}</div>
          <div className="label">Peso estimado</div>
        </div>
        <div className="stat-tile">
          <div className="value">{week?.typical_length ?? '...'}</div>
          <div className="label">Longitud</div>
        </div>
        <div className="stat-tile">
          <div className="value">{reminders.filter((r) => !r.is_completed).length}</div>
          <div className="label">Recordatorios</div>
        </div>
      </div>

      {week && (
        <section className="week-card">
          <div className="row" style={{ alignItems: 'flex-start', marginBottom: '1.25rem' }}>
            <div className="week-number-badge">
              <div>
                <span className="num">{week.week_number}</span>
                <span className="lbl">semana</span>
              </div>
            </div>
            <div style={{ flex: 1 }}>
              <h3>{week.title}</h3>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', margin: '0.2rem 0 0' }}>
                {week.summary}
              </p>
            </div>
            <Link to="/semana" className="btn btn-secondary btn-sm">
              Ver detalle
            </Link>
          </div>

          <div className="grid grid-2" style={{ gap: '1rem' }}>
            <div className="info-block">
              <div className="info-label">Tu bebe</div>
              <p>{week.baby_development}</p>
            </div>
            <div className="info-block">
              <div className="info-label">En ti</div>
              <p>{week.mother_changes}</p>
            </div>
            <div className="info-block">
              <div className="info-label">Alimentacion</div>
              <p>{week.food_focus}</p>
            </div>
            <div className="info-block">
              <div className="info-label">Ejercicio</div>
              <p>{week.exercise_tip}</p>
            </div>
          </div>

          {week.tips && (
            <div
              style={{
                marginTop: '1.25rem',
                padding: '0.85rem 1rem',
                background: 'var(--gold-soft)',
                borderRadius: 'var(--radius-sm)',
                fontSize: '0.88rem',
                color: '#7a6020',
              }}
            >
              <strong>Consejo: </strong>
              {week.tips}
            </div>
          )}
        </section>
      )}

      <div className="grid grid-2">
        <section className="card">
          <div className="card-title">
            <h3>Proximos recordatorios</h3>
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleGenerate}
              disabled={generating}
            >
              {generating ? <span className="loader" style={{ width: 13, height: 13 }} /> : <SparkleIcon size={14} />}
              Generar con IA
            </button>
          </div>

          {reminders.length === 0 ? (
            <div className="empty-state">
              <MotherSilhouette size={70} className="empty-icon" />
              <p>Aun no tienes recordatorios. Genera algunos personalizados para tu semana.</p>
              <button type="button" className="btn btn-primary" onClick={handleGenerate}>
                Generar recordatorios
              </button>
            </div>
          ) : (
            <div className="list">
              {reminders.slice(0, 5).map((item) => (
                <div key={item.id} className={`list-item ${item.is_completed ? 'is-done' : ''}`}>
                  <button
                    type="button"
                    className={`checkbox ${item.is_completed ? 'checked' : ''}`}
                    onClick={() => handleToggle(item.id)}
                    aria-label={item.is_completed ? 'Marcar pendiente' : 'Marcar completada'}
                  >
                    {item.is_completed && <CheckIcon />}
                  </button>
                  <div className="list-item-main">
                    <div className="list-item-title">{item.title}</div>
                    {item.description && <div className="list-item-meta">{item.description}</div>}
                  </div>
                  <span className="badge badge-sand">{item.category}</span>
                </div>
              ))}
            </div>
          )}

          <Link to="/recordatorios" className="btn btn-ghost btn-sm" style={{ marginTop: '0.75rem' }}>
            Ver todos
          </Link>
        </section>

        <section className="card">
          <div className="card-title">
            <h3>Tus proximas citas</h3>
            <Link to="/citas" className="btn btn-secondary btn-sm">
              <CalendarIcon size={14} />
              Agendar
            </Link>
          </div>

          {appointments.length === 0 ? (
            <div className="empty-state">
              <FloralCorner size={64} className="empty-icon" />
              <p>No tienes citas agendadas. Registra tus controles para no perder ninguno.</p>
              <Link to="/citas" className="btn btn-primary">
                Agregar cita
              </Link>
            </div>
          ) : (
            <div className="list">
              {appointments.slice(0, 4).map((item) => (
                <div key={item.id} className="list-item">
                  <div className="item-dot gold" />
                  <div className="list-item-main">
                    <div className="list-item-title">{item.title}</div>
                    <div className="list-item-meta">
                      {formatDateTime(item.scheduled_at)}
                      {item.location ? ` - ${item.location}` : ''}
                    </div>
                  </div>
                  <span className="badge badge-gold">{relativeDay(item.scheduled_at)}</span>
                </div>
              ))}
            </div>
          )}

          {pregnancy.next_appointment && (
            <div className="row" style={{ marginTop: '0.85rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <CalendarIcon size={14} />
              Proxima: {pregnancy.next_appointment.title} ({formatDate(pregnancy.next_appointment.scheduled_at)})
            </div>
          )}
        </section>
      </div>

      <Disclaimer />
    </div>
  );
}

function WeekSetupCard() {
  const { refresh } = useAuth();
  const [mode, setMode] = useState('dueDate');
  const [dueDate, setDueDate] = useState('');
  const [lastPeriodDate, setLastPeriodDate] = useState('');
  const [currentWeek, setCurrentWeek] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      const payload = {};
      if (mode === 'dueDate' && dueDate) payload.dueDate = dueDate;
      if (mode === 'lastPeriod' && lastPeriodDate) payload.lastPeriodDate = lastPeriodDate;
      if (mode === 'week' && currentWeek) payload.currentWeek = Number(currentWeek);

      await api.pregnancy.save(payload);
      await refresh();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <section className="card" style={{ maxWidth: 520 }}>
      <div className="card-title">
        <h3>Configura tu embarazo</h3>
      </div>

      <form onSubmit={handleSubmit} className="stack" style={{ gap: '0.9rem' }}>
        {error && <div className="form-error">{error}</div>}

        <div className="field">
          <label htmlFor="setupMode">Como calculamos tu semana</label>
          <select id="setupMode" className="select" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="dueDate">Tengo la fecha estimada de parto</option>
            <option value="lastPeriod">Se mi ultima menstruacion</option>
            <option value="week">Ya se en que semana estoy</option>
          </select>
        </div>

        {mode === 'dueDate' && (
          <div className="field">
            <label htmlFor="setupDue">Fecha estimada de parto</label>
            <input
              id="setupDue"
              type="date"
              className="input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>
        )}

        {mode === 'lastPeriod' && (
          <div className="field">
            <label htmlFor="setupLmp">Primer dia de tu ultima menstruacion</label>
            <input
              id="setupLmp"
              type="date"
              className="input"
              value={lastPeriodDate}
              onChange={(e) => setLastPeriodDate(e.target.value)}
              required
            />
            <span className="field-hint">Sumamos 280 dias a esa fecha.</span>
          </div>
        )}

        {mode === 'week' && (
          <div className="field">
            <label htmlFor="setupWeek">Semana actual</label>
            <input
              id="setupWeek"
              type="number"
              className="input"
              value={currentWeek}
              onChange={(e) => setCurrentWeek(e.target.value)}
              min={1}
              max={42}
              placeholder="Ej: 20"
              required
            />
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={busy}>
          {busy && <span className="loader" style={{ width: 15, height: 15 }} />}
          Calcular mi semana
        </button>
      </form>
    </section>
  );
}
