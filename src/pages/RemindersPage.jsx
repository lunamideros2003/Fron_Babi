import { useEffect, useState } from 'react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { CheckIcon, SparkleIcon, TrashIcon, PlusIcon, MotherSilhouette } from '../components/Icons.jsx';
import { relativeDay, toLocalInputValue } from '../utils/format.js';

const CATEGORIES = [
  { value: 'alimentacion', label: 'Alimentacion' },
  { value: 'ejercicio', label: 'Ejercicio' },
  { value: 'medicacion', label: 'Medicacion' },
  { value: 'controles', label: 'Controles' },
  { value: 'parto', label: 'Parto' },
  { value: 'emocional', label: 'Emocional' },
  { value: 'general', label: 'General' },
];

const DOT = {
  alimentacion: 'blue',
  ejercicio: 'sage',
  medicacion: 'blush',
  controles: 'gold',
  parto: 'blush',
  emocional: 'sage',
  general: 'blue',
};

export default function RemindersPage() {
  const { pregnancy } = useAuth();
  const [reminders, setReminders] = useState([]);
  const [showCompleted, setShowCompleted] = useState(false);
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: 'general',
    due_at: toLocalInputValue(new Date(Date.now() + 3_600_000)),
    recurrence: 'none',
  });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [busy, setBusy] = useState(false);
  const [generating, setGenerating] = useState(false);

  async function load() {
    try {
      const data = await api.reminders.list(showCompleted);
      setReminders(data.reminders ?? []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [showCompleted, pregnancy?.current_week]);

  function update(field) {
    return (event) => setForm((prev) => ({ ...prev, [field]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');
    setBusy(true);

    try {
      await api.reminders.create({ ...form, due_at: toLocalInputValue(form.due_at) });
      setForm((prev) => ({ ...prev, title: '', description: '' }));
      setNotice('Recordatorio agregado.');
      setTimeout(() => setNotice(''), 3000);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleToggle(id) {
    setReminders((prev) =>
      prev.map((item) => (item.id === id ? { ...item, is_completed: item.is_completed ? 0 : 1 } : item)),
    );
    try {
      await api.reminders.toggle(id);
      if (!showCompleted) await load();
    } catch (err) {
      setError(err.message);
      load();
    }
  }

  async function handleDelete(id) {
    try {
      await api.reminders.remove(id);
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleGenerate() {
    setGenerating(true);
    setError('');

    try {
      const data = await api.reminders.generate(5);
      setNotice(`Se generaron ${data.reminders.length} recordatorios para tu semana.`);
      setTimeout(() => setNotice(''), 4000);
      await load();
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  }

  const pending = reminders.filter((item) => !item.is_completed);
  const completed = reminders.filter((item) => item.is_completed);

  return (
    <div className="stack">
      <div className="page-head">
        <p className="eyebrow">Organizacion diaria</p>
        <h1>Recordatorios</h1>
        <p className="lede">
          Crea tus propias tareas o deja que la IA las genere segun tu trimestre actual.
        </p>
      </div>

      <div className="row-wrap">
        <button type="button" className="btn btn-primary" onClick={handleGenerate} disabled={generating}>
          {generating ? <span className="loader" style={{ width: 15, height: 15 }} /> : <SparkleIcon size={15} />}
          Generar con IA
        </button>
        <button
          type="button"
          className={`chip ${showCompleted ? 'active' : ''}`}
          onClick={() => setShowCompleted((prev) => !prev)}
        >
          {showCompleted ? 'Ocultar completados' : 'Mostrar completados'}
        </button>
        {pregnancy && (
          <span className="badge">
            Semana {pregnancy.current_week} - {pregnancy.trimester_label}
          </span>
        )}
      </div>

      {error && <div className="form-error">{error}</div>}
      {notice && <div className="form-success">{notice}</div>}

      <div className="grid grid-2" style={{ gridTemplateColumns: 'minmax(0, 1fr) 340px' }}>
        <div className="stack">
          {reminders.length === 0 ? (
            <div className="card empty-state">
              <MotherSilhouette size={70} className="empty-icon" />
              <p>
                No tienes recordatorios. Genera los tuyos con IA para empezar, o agrega uno
                manualmente con el formulario.
              </p>
              <button type="button" className="btn btn-primary" onClick={handleGenerate}>
                Generar ahora
              </button>
            </div>
          ) : (
            <>
              {pending.length > 0 && (
                <div className="stack" style={{ gap: '0.6rem' }}>
                  <p className="eyebrow" style={{ color: 'var(--text-muted)' }}>
                    Pendientes ({pending.length})
                  </p>
                  <div className="list">
                    {pending.map((item) => (
                      <ReminderRow
                        key={item.id}
                        item={item}
                        onToggle={() => handleToggle(item.id)}
                        onDelete={() => handleDelete(item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {showCompleted && completed.length > 0 && (
                <div className="stack" style={{ gap: '0.6rem' }}>
                  <p className="eyebrow" style={{ color: 'var(--text-muted)' }}>
                    Completados ({completed.length})
                  </p>
                  <div className="list">
                    {completed.map((item) => (
                      <ReminderRow
                        key={item.id}
                        item={item}
                        onToggle={() => handleToggle(item.id)}
                        onDelete={() => handleDelete(item.id)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <section className="card" style={{ position: 'sticky', top: 80, alignSelf: 'start' }}>
          <div className="card-title">
            <h3>Nuevo recordatorio</h3>
            <PlusIcon size={16} />
          </div>

          <form onSubmit={handleSubmit} className="stack" style={{ gap: '0.85rem' }}>
            <div className="field">
              <label htmlFor="remTitle">Titulo</label>
              <input
                id="remTitle"
                className="input"
                value={form.title}
                onChange={update('title')}
                placeholder="Ej: Tomar acido folico"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="remDesc">Descripcion</label>
              <textarea
                id="remDesc"
                className="textarea"
                value={form.description}
                onChange={update('description')}
                placeholder="Detalles opcionales"
                rows={2}
              />
            </div>

            <div className="field">
              <label htmlFor="remCategory">Categoria</label>
              <select id="remCategory" className="select" value={form.category} onChange={update('category')}>
                {CATEGORIES.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="field">
              <label htmlFor="remDue">Fecha y hora</label>
              <input
                id="remDue"
                type="datetime-local"
                className="input"
                value={form.due_at}
                onChange={update('due_at')}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="remRecurrence">Repeticion</label>
              <select id="remRecurrence" className="select" value={form.recurrence} onChange={update('recurrence')}>
                <option value="none">Una vez</option>
                <option value="daily">Diaria</option>
                <option value="weekly">Semanal</option>
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-block" disabled={busy}>
              {busy && <span className="loader" style={{ width: 15, height: 15 }} />}
              Agregar
            </button>
          </form>
        </section>
      </div>
    </div>
  );
}

function ReminderRow({ item, onToggle, onDelete }) {
  return (
    <div className={`list-item ${item.is_completed ? 'is-done' : ''}`}>
      <button
        type="button"
        className={`checkbox ${item.is_completed ? 'checked' : ''}`}
        onClick={onToggle}
        aria-label={item.is_completed ? 'Marcar pendiente' : 'Marcar completada'}
      >
        {item.is_completed && <CheckIcon />}
      </button>
      <div className={`item-dot ${DOT[item.category] ?? 'blue'}`} />
      <div className="list-item-main">
        <div className="list-item-title">{item.title}</div>
        {item.description && <div className="list-item-meta">{item.description}</div>}
        <div className="list-item-meta">
          {relativeDay(item.due_at)}
          {item.source === 'ai' ? ' - generado por IA' : ''}
        </div>
      </div>
      <span className="badge badge-sand">{item.category}</span>
      <button
        type="button"
        className="btn btn-ghost btn-sm"
        onClick={onDelete}
        aria-label="Eliminar recordatorio"
        style={{ color: 'var(--danger)' }}
      >
        <TrashIcon size={14} />
      </button>
    </div>
  );
}
