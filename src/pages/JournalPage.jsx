import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import api from '../api/client.js';
import { formatDate } from '../utils/format.js';
import { JournalIcon } from '../components/Icons.jsx';

const MOODS = [
  { value: 'feliz', label: 'Feliz' },
  { value: 'tranquila', label: 'Tranquila' },
  { value: 'emocionada', label: 'Emocionada' },
  { value: 'cansada', label: 'Cansada' },
  { value: 'preocupada', label: 'Preocupada' },
];

function moodLabel(value) {
  return MOODS.find((m) => m.value === value)?.label ?? null;
}

export default function JournalPage() {
  const { pregnancy } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mood, setMood] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let vivo = true;

    api.journal
      .list()
      .then((res) => {
        if (vivo) setEntries(res.entries ?? []);
      })
      .catch((err) => {
        if (vivo) setError(err.message);
      })
      .finally(() => {
        if (vivo) setLoading(false);
      });

    return () => {
      vivo = false;
    };
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    if (!content.trim()) return;

    setError('');
    setBusy(true);
    try {
      const res = await api.journal.create({ mood: mood || undefined, content: content.trim() });
      setEntries((prev) => [res.entry, ...prev]);
      setContent('');
      setMood('');
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(id) {
    setEntries((prev) => prev.filter((item) => item.id !== id));
    try {
      await api.journal.remove(id);
    } catch {
      /* se recarga al volver a entrar */
    }
  }

  return (
    <div className="journal-page">
      <div className="page-head">
        <p className="eyebrow">Mi diario</p>
        <h1>Un espacio para ti</h1>
        <p className="lede">
          Anota cómo te sientes, algo que quieras recordar o una duda para tu próxima consulta.
          Solo tú puedes ver estas entradas.
          {pregnancy?.current_week ? ` Vas por la semana ${pregnancy.current_week}.` : ''}
        </p>
      </div>

      <form className="journal-form" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="journalMood">Como te sientes hoy</label>
          <select
            id="journalMood"
            className="select"
            value={mood}
            onChange={(e) => setMood(e.target.value)}
          >
            <option value="">Prefiero no decirlo</option>
            {MOODS.map((item) => (
              <option key={item.value} value={item.value}>
                {item.label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="journalContent">Tu nota</label>
          <textarea
            id="journalContent"
            className="textarea"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Hoy senti..."
            rows={4}
            required
          />
          <span className="field-hint">Solo es obligatorio escribir la nota.</span>
        </div>

        {error && <div className="form-error">{error}</div>}

        <button type="submit" className="btn btn-primary" disabled={busy || !content.trim()}>
          {busy && <span className="loader" style={{ width: 15, height: 15 }} />}
          Guardar en mi diario
        </button>
      </form>

      <section aria-label="Entradas anteriores">
        <h2 className="section-title">Entradas anteriores</h2>

        {loading ? (
          <div className="skeleton" style={{ height: 120 }} />
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <JournalIcon size={46} className="empty-icon" />
            <p>Todavía no has escrito nada. Tu primera entrada puede ser una línea corta.</p>
          </div>
        ) : (
          <ul className="journal-list">
            {entries.map((item) => (
              <li key={item.id} className="journal-item">
                <div className="journal-item-head">
                  <span className="journal-date">{formatDate(item.entry_date)}</span>
                  <span className="journal-meta">
                    {moodLabel(item.mood)}
                    {moodLabel(item.mood) && item.pregnancy_week ? ' · ' : ''}
                    {item.pregnancy_week ? `Semana ${item.pregnancy_week}` : ''}
                  </span>
                  <button
                    type="button"
                    className="journal-delete"
                    onClick={() => handleRemove(item.id)}
                    aria-label="Borrar esta entrada"
                  >
                    Borrar
                  </button>
                </div>
                <p className="journal-content">{item.content}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
