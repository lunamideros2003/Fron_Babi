import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client.js';
import MotherIllustration from '../components/MotherIllustration.jsx';
import FruitIllustration from '../components/Fruit.jsx';
import { HeartPulseIcon, CalendarIcon, ChevronRightIcon, ShieldIcon, BrandMark } from '../components/Icons.jsx';

const MASCULINO = ['aguacate', 'mango', 'melon', 'plata', 'platano', 'banano', 'maiz', 'coco'];

function conArticulo(texto) {
  if (!texto) return 'Por confirmar';
  const bajo = String(texto).toLowerCase().trim();
  const articulo = MASCULINO.some((m) => bajo.startsWith(m)) ? 'un' : 'una';
  return `Como ${articulo} ${bajo}`;
}

function trimesterOf(week) {
  if (week < 13) return 'Primer trimestre';
  if (week < 28) return 'Segundo trimestre';
  return 'Tercer trimestre';
}

function milestoneOf(week) {
  if (week >= 40) return 'Casi el día';
  if (week >= 37) return 'Ya es termino';
  if (week >= 28) return 'Último trimestre';
  if (week >= 20) return 'Mitad del camino';
  if (week >= 13) return 'Segundo trimestre';
  return 'Primeros pasos';
}

export default function DashboardPage() {
  const { user, pregnancy } = useAuth();

  if (!pregnancy) {
    return (
      <div className="home">
        <header className="home-greeting">
          <div>
            <p className="home-eyebrow">Mi espacio de embarazo</p>
            <h1 className="home-title">Hola, mama</h1>
            <p className="home-subtitle">Un día a la vez, un paso a la vez.</p>
          </div>
          <span className="home-mark" aria-hidden="true">
            <BrandMark size={24} />
          </span>
        </header>

        <div className="home-art">
          <MotherIllustration height={190} />
        </div>

        <WeekSetupCard firstName={user?.name?.split(' ')[0]} />
      </div>
    );
  }

  const week = pregnancy.week;
  const current = pregnancy.current_week;
  const progress = Math.max(0, Math.min(100, pregnancy.progress_percent ?? 0));
  const firstName = user?.name?.split(' ')[0];

  return (
    <div className="home">
      {/* A. Encabezado de bienvenida */}
      <header className="home-greeting">
        <div>
          <p className="home-eyebrow">Mi espacio de embarazo</p>
          <h1 className="home-title">Hola, mamá{firstName ? `, ${firstName}` : ''}</h1>
          <p className="home-subtitle">Un día a la vez, un paso a la vez.</p>
        </div>
        <span className="home-mark" aria-hidden="true">
          <BrandMark size={24} />
        </span>
      </header>

      {/* B. Ilustracion principal */}
      <div className="home-art">
        <MotherIllustration height={210} />
      </div>

      {/* C y D. Tarjeta principal con el tamano del bebe */}
      <section className="today-card" aria-label="Tu embarazo hoy">
        <div className="today-head">
          <div>
            <p className="today-label">Tu embarazo hoy</p>
            <h2 className="today-week">Semana {current}</h2>
            <p className="today-trimester">{pregnancy.trimester_label || trimesterOf(current)}</p>
          </div>
          <span className="today-badge">{milestoneOf(current)}</span>
        </div>

        <div>
          <div className="today-progress">
            <div className="today-progress-bar" style={{ width: `${progress}%` }} />
          </div>
          <p className="today-progress-label">
            {current} de 40 semanas aproximadas. El cálculo es orientativo.
          </p>
        </div>

        <div className="size-block">
          <span className="size-art">
            <FruitIllustration sizeComparison={week?.size_comparison} size={66} />
          </span>
          <div className="size-copy">
            <p className="size-label">El tamaño de tu bebé</p>
            <h3 className="size-title">{conArticulo(week?.size_comparison)}</h3>
            <p className="size-text">Una comparación visual para imaginar cuánto ha crecido.</p>
          </div>
        </div>
      </section>

      {/* E. Guia para esta semana */}
      <section aria-labelledby="guide-title">
        <h2 id="guide-title" className="section-title">
          Tu guía para esta semana
        </h2>
        <div className="guide-links">
          <Link to="/semana" className="guide-link">
            <span className="guide-link-icon" aria-hidden="true">
              <HeartPulseIcon size={21} />
            </span>
            <span className="guide-link-body">
              <p className="guide-link-title">Cambios en tu cuerpo</p>
              <p className="guide-link-text">Conoce los cambios y las molestias de esta etapa.</p>
            </span>
            <span className="guide-link-chevron" aria-hidden="true">
              <ChevronRightIcon size={16} />
            </span>
          </Link>

          <Link to="/citas" className="guide-link">
            <span className="guide-link-icon" aria-hidden="true">
              <CalendarIcon size={20} />
            </span>
            <span className="guide-link-body">
              <p className="guide-link-title">Tus próximos controles</p>
              <p className="guide-link-text">Consulta tus citas y las indicaciones pendientes.</p>
            </span>
            <span className="guide-link-chevron" aria-hidden="true">
              <ChevronRightIcon size={16} />
            </span>
          </Link>
        </div>
      </section>

      {/* F. Informacion de seguridad */}
      <div className="safety-note">
        <span className="safety-note-icon" aria-hidden="true">
          <ShieldIcon size={17} />
        </span>
        <p>
          Información orientativa. Tu profesional de salud es quien puede valorar tu embarazo
          individualmente. Si notas{' '}
          <Link to="/seguridad">señales de alarma</Link>, busca atención médica sin esperar.
        </p>
      </div>
    </div>
  );
}

function WeekSetupCard({ firstName }) {
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
    <section className="setup-card">
      <h2 className="section-title" style={{ marginTop: 0 }}>
        Configura tu embarazo
      </h2>
      <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', marginTop: '-0.4rem' }}>
        {firstName ? `${firstName}, registra` : 'Registra'} tu fecha para calcular tu semana y
        personalizar toda la información.
      </p>

      <form onSubmit={handleSubmit} className="stack" style={{ gap: '0.9rem', marginTop: '1rem' }}>
        {error && <div className="form-error">{error}</div>}

        <div className="field">
          <label htmlFor="setupMode">Cómo calculamos tu semana</label>
          <select id="setupMode" className="select" value={mode} onChange={(e) => setMode(e.target.value)}>
            <option value="dueDate">Tengo la fecha estimada de parto</option>
            <option value="lastPeriod">Sé mi última menstruación</option>
            <option value="week">Ya sé en qué semana estoy</option>
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
            <span className="field-hint">Sumamos 280 días a esa fecha.</span>
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
