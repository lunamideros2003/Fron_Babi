import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import {
  CalendarIcon,
  PlusIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../components/Icons.jsx';
import { formatDateTime, relativeDay, toLocalInputValue } from '../utils/format.js';

const SCOPES = [
  { key: 'upcoming', label: 'Próximas' },
  { key: 'past', label: 'Pasadas' },
  { key: 'all', label: 'Todas' },
];

const EMPTY = {
  title: '',
  category: 'checkup',
  scheduled_at: '',
  location: '',
  provider_name: '',
  notes: '',
};

function dateParts(value) {
  if (!value) return { day: '--', month: '' };
  const date = new Date(String(value).replace(' ', 'T'));
  if (Number.isNaN(date.getTime())) return { day: '--', month: '' };
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month: date.toLocaleDateString('es-ES', { month: 'short' }).replace('.', ''),
  };
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [categories, setCategories] = useState([]);
  const [scope, setScope] = useState('upcoming');
  const [form, setForm] = useState(EMPTY);
  const [openForm, setOpenForm] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function load() {
    try {
      const data = await api.appointments.list(scope);
      setAppointments(data.appointments ?? []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scope]);

  // Las categorias las define el backend, para que no se desincronicen.
  useEffect(() => {
    api.appointments
      .categories()
      .then((data) => setCategories(data.categories ?? []))
      .catch(() => setCategories([]));
  }, []);

  function update(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      await api.appointments.create({
        ...form,
        scheduled_at: toLocalInputValue(form.scheduled_at),
      });
      setForm(EMPTY);
      setOpenForm(false);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleDelete(id) {
    try {
      await api.appointments.remove(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatus(id, status) {
    try {
      await api.appointments.update(id, { status });
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="appointments-page">
      <div className="page-head appointments-head">
        <div>
          <p className="eyebrow">Seguimiento prenatal</p>
          <h1>Mis controles</h1>
          <p className="lede">
            Consulta tus próximas citas y regístralas según las indique tu equipo de salud.
          </p>
        </div>
        <button
          type="button"
          className="btn btn-primary"
          onClick={() => setOpenForm((v) => !v)}
          aria-expanded={openForm}
        >
          {openForm ? <ChevronLeftIcon size={15} /> : <PlusIcon size={15} />}
          {openForm ? 'Cerrar formulario' : 'Nueva cita'}
        </button>
      </div>

      {openForm && (
        <section className="appointments-form" aria-label="Nueva cita">
          <form onSubmit={handleSubmit} className="appointments-form-grid">
            <div className="field">
              <label htmlFor="apptTitle">Título</label>
              <input
                id="apptTitle"
                className="input"
                value={form.title}
                onChange={update('title')}
                placeholder="Ej: Control del segundo trimestre"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="apptCategory">Tipo</label>
              <select
                id="apptCategory"
                className="select"
                value={form.category}
                onChange={update('category')}
              >
                {categories.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="apptDate">Fecha y hora</label>
              <input
                id="apptDate"
                type="datetime-local"
                className="input"
                value={form.scheduled_at}
                onChange={update('scheduled_at')}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="apptLocation">Lugar</label>
              <input
                id="apptLocation"
                className="input"
                value={form.location}
                onChange={update('location')}
                placeholder="Clínica u hospital"
              />
            </div>

            <div className="field">
              <label htmlFor="apptProvider">Profesional</label>
              <input
                id="apptProvider"
                className="input"
                value={form.provider_name}
                onChange={update('provider_name')}
                placeholder="Nombre de tu obstetra"
              />
            </div>

            <div className="field appointments-form-wide">
              <label htmlFor="apptNotes">Notas o preguntas</label>
              <textarea
                id="apptNotes"
                className="textarea"
                value={form.notes}
                onChange={update('notes')}
                placeholder="Exámenes que te pedirán, preguntas para la consulta..."
                rows={3}
              />
            </div>

            <div className="appointments-form-actions">
              <button type="submit" className="btn btn-primary" disabled={busy}>
                {busy && <span className="loader" style={{ width: 15, height: 15 }} />}
                Guardar cita
              </button>
            </div>
          </form>
        </section>
      )}

      <div className="appointments-scopes" role="tablist" aria-label="Filtrar citas">
        {SCOPES.map((option) => (
          <button
            key={option.key}
            type="button"
            role="tab"
            aria-selected={scope === option.key}
            className={`chip ${scope === option.key ? 'active' : ''}`}
            onClick={() => setScope(option.key)}
          >
            {option.label}
          </button>
        ))}
      </div>

      {error && <div className="form-error">{error}</div>}

      {appointments.length === 0 ? (
        <div className="empty-state appointments-empty">
          <CalendarIcon size={40} className="empty-icon" />
          <p>
            No hay citas en esta vista. El calendario final lo define tu profesional de salud;
            aquí puedes apuntarlo para no perderlo.
          </p>
        </div>
      ) : (
        <ul className="appointments-list">
          {appointments.map((item) => {
            const { day, month } = dateParts(item.scheduled_at);
            const done = item.status === 'done';

            return (
              <li key={item.id} className={`appointment-item ${done ? 'is-done' : ''}`}>
                <div className="appointment-date" aria-hidden="true">
                  <span className="appointment-day">{day}</span>
                  <span className="appointment-month">{month}</span>
                </div>

                <div className="appointment-body">
                  <div className="appointment-topline">
                    <h3 className="appointment-title">{item.title}</h3>
                    <span className="appointment-when">{relativeDay(item.scheduled_at)}</span>
                  </div>

                  <p className="appointment-meta">
                    {formatDateTime(item.scheduled_at)}
                    {item.location ? ` · ${item.location}` : ''}
                    {item.provider_name ? ` · ${item.provider_name}` : ''}
                  </p>

                  {item.notes && <p className="appointment-notes">{item.notes}</p>}

                  <div className="appointment-actions">
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleStatus(item.id, done ? 'scheduled' : 'done')}
                    >
                      {done ? 'Reabrir' : 'Marcar como realizada'}
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleDelete(item.id)}
                      aria-label={`Eliminar ${item.title}`}
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <section className="extra-block" aria-label="Otras herramientas de seguimiento">
        <h2 className="section-title">Complementa tu seguimiento</h2>
        <div className="extra-links">
          <Link to="/recordatorios" className="extra-link">
            <span className="extra-link-body">
              <span className="extra-link-title">Recordatorios</span>
              <span className="extra-link-text">
                Anota qué te han indicado y actívalos cuando toque.
              </span>
            </span>
            <span className="extra-link-chevron" aria-hidden="true">
              <ChevronRightIcon size={16} />
            </span>
          </Link>
          <Link to="/seguimiento" className="extra-link">
            <span className="extra-link-body">
              <span className="extra-link-title">Síntomas y analíticas</span>
              <span className="extra-link-text">
                Registra cómo te sientes y tus últimos controles.
              </span>
            </span>
            <span className="extra-link-chevron" aria-hidden="true">
              <ChevronRightIcon size={16} />
            </span>
          </Link>
        </div>
      </section>

      <p className="appointments-note">
        No marcamos ningún control como obligatorio. La frecuencia de revisiones y exámenes la
        fija tu equipo de salud según tu caso.
      </p>
    </div>
  );
}
