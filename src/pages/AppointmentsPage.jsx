import { useEffect, useState } from 'react';
import api from '../api/client.js';
import { CalendarIcon, PlusIcon, TrashIcon, FloralCorner } from '../components/Icons.jsx';
import { formatDateTime, relativeDay, toLocalInputValue } from '../utils/format.js';

const CATEGORIES = [
  { value: 'checkup', label: 'Control prenatal' },
  { value: 'ultrasound', label: 'Ecografia' },
  { value: 'lab', label: 'Analisis de laboratorio' },
  { value: 'specialist', label: 'Especialista' },
  { value: 'vaccine', label: 'Vacuna' },
  { value: 'birth_class', label: 'Clase de parto' },
  { value: 'other', label: 'Otro' },
];

const EMPTY = {
  title: '',
  category: 'checkup',
  scheduled_at: '',
  location: '',
  provider_name: '',
  notes: '',
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [scope, setScope] = useState('upcoming');
  const [form, setForm] = useState(EMPTY);
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
  }, [scope]);

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
    <div className="stack">
      <div className="page-head">
        <p className="eyebrow">Agenda medica</p>
        <h1>Mis citas</h1>
        <p className="lede">
          Registra tus controles, ecografias y analisis para no perder ninguno. BabyTrack te
          avisa de los proximos.
        </p>
      </div>

      <div className="grid grid-2" style={{ gridTemplateColumns: 'minmax(0, 1fr) 340px' }}>
        <div className="stack">
          <div className="row-wrap">
            {[
              { key: 'upcoming', label: 'Proximas' },
              { key: 'past', label: 'Pasadas' },
              { key: 'all', label: 'Todas' },
            ].map((option) => (
              <button
                key={option.key}
                type="button"
                className={`chip ${scope === option.key ? 'active' : ''}`}
                onClick={() => setScope(option.key)}
              >
                {option.label}
              </button>
            ))}
          </div>

          {error && <div className="form-error">{error}</div>}

          {appointments.length === 0 ? (
            <div className="card empty-state">
              <FloralCorner size={64} className="empty-icon" />
              <p>
                No hay citas en esta vista. Agrega una con el formulario o recuerda que tu
                obstetra define el calendario final.
              </p>
            </div>
          ) : (
            <div className="list">
              {appointments.map((item) => (
                <div key={item.id} className="list-item">
                  <div className="item-dot gold" />
                  <div className="list-item-main">
                    <div className="list-item-title">{item.title}</div>
                    <div className="list-item-meta">
                      {formatDateTime(item.scheduled_at)}
                      {item.location ? ` - ${item.location}` : ''}
                      {item.provider_name ? ` - ${item.provider_name}` : ''}
                    </div>
                    {item.notes && (
                      <div className="list-item-meta" style={{ marginTop: '0.25rem' }}>
                        {item.notes}
                      </div>
                    )}
                  </div>
                  <div className="stack" style={{ gap: '0.3rem', alignItems: 'flex-end' }}>
                    <span className="badge badge-gold">{relativeDay(item.scheduled_at)}</span>
                    <div className="row" style={{ gap: '0.3rem' }}>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleStatus(item.id, item.status === 'done' ? 'scheduled' : 'done')}
                      >
                        {item.status === 'done' ? 'Reabrir' : 'Completada'}
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-sm"
                        onClick={() => handleDelete(item.id)}
                        aria-label="Eliminar cita"
                        style={{ color: 'var(--danger)' }}
                      >
                        <TrashIcon size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <section className="card" style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
          <div className="card-title">
            <h3>Nueva cita</h3>
            <PlusIcon size={16} />
          </div>

          <form onSubmit={handleSubmit} className="stack" style={{ gap: '0.85rem' }}>
            <div className="field">
              <label htmlFor="apptTitle">Titulo</label>
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
              <select id="apptCategory" className="select" value={form.category} onChange={update('category')}>
                {CATEGORIES.map((option) => (
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
                placeholder="Clinica u hospital"
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

            <div className="field">
              <label htmlFor="apptNotes">Notas</label>
              <textarea
                id="apptNotes"
                className="textarea"
                value={form.notes}
                onChange={update('notes')}
                placeholder="Examenes que te pediran, preguntas..."
                rows={3}
              />
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy ? <span className="loader" style={{ width: 15, height: 15 }} /> : <CalendarIcon size={15} />}
              Guardar cita
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}
