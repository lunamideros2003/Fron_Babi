import { useEffect, useState } from 'react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { PlusIcon, CalendarIcon, TrashIcon, FloralCorner } from '../components/Icons.jsx';
import { formatDate, formatDateTime } from '../utils/format.js';

const COMMON_CHECKUPS = [
  { week: 12, focus: 'Ecografia del primer trimestre' },
  { week: 14, focus: 'Translucencia nucal' },
  { week: 20, focus: 'Ecografia anatomica' },
  { week: 26, focus: 'Tamizaje de diabetes gestacional' },
  { week: 28, focus: 'Crecimiento fetal' },
  { week: 36, focus: 'Prueba de estreptococo grupo B' },
  { week: 38, focus: 'Control semanal' },
  { week: 40, focus: 'Control de la fecha estimada' },
];

const COMMON_SYMPTOMS = [
  'Nauseas',
  'Reflujo',
  'Estreñimiento',
  'Dolor de espalda',
  'Cansancio',
  'Dolor de cabeza',
  'Insomnio',
  'Hinchazon',
];

export default function TrackingPage() {
  const { pregnancy } = useAuth();
  const [timeline, setTimeline] = useState(null);
  const [checkupForm, setCheckupForm] = useState({ pregnancy_week: '', weight_kg: '', blood_pressure: '', notes: '' });
  const [symptomForm, setSymptomForm] = useState({ symptom: '', severity: 1, notes: '' });
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  async function load() {
    try {
      const data = await api.tracking.timeline();
      setTimeline(data);
      setCheckupForm((prev) => ({
        ...prev,
        pregnancy_week: prev.pregnancy_week || data.pregnancy?.current_week || '',
      }));
      setSymptomForm((prev) => ({
        ...prev,
        pregnancy_week: data.pregnancy?.current_week || '',
      }));
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    load();
  }, [pregnancy?.current_week]);

  function flash(message) {
    setNotice(message);
    setTimeout(() => setNotice(''), 3000);
  }

  async function handleCheckup(event) {
    event.preventDefault();
    setError('');

    try {
      await api.tracking.addCheckup({
        pregnancy_week: checkupForm.pregnancy_week ? Number(checkupForm.pregnancy_week) : undefined,
        weight_kg: checkupForm.weight_kg ? Number(checkupForm.weight_kg) : undefined,
        blood_pressure: checkupForm.blood_pressure || undefined,
        notes: checkupForm.notes || undefined,
      });
      setCheckupForm((prev) => ({ ...prev, weight_kg: '', blood_pressure: '', notes: '' }));
      flash('Control registrado.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleSymptom(event) {
    event.preventDefault();
    setError('');

    try {
      await api.tracking.addSymptom({
        pregnancy_week: symptomForm.pregnancy_week ? Number(symptomForm.pregnancy_week) : undefined,
        symptom: symptomForm.symptom,
        severity: Number(symptomForm.severity),
        notes: symptomForm.notes || undefined,
      });
      setSymptomForm((prev) => ({ ...prev, symptom: '', notes: '' }));
      flash('Sintoma registrado.');
      await load();
    } catch (err) {
      setError(err.message);
    }
  }

  const checkups = timeline?.checkups ?? [];
  const symptoms = timeline?.symptoms ?? [];

  return (
    <div className="stack">
      <div className="page-head">
        <p className="eyebrow">Historial</p>
        <h1>Controles y seguimiento</h1>
        <p className="lede">
          Guarda cada consulta, peso, presion y sintoma. Este registro te sirve a ti y a tu
          obstetra en la proxima visita.
        </p>
      </div>

      {error && <div className="form-error">{error}</div>}
      {notice && <div className="form-success">{notice}</div>}

      <div className="grid grid-2" style={{ gap: '1.25rem' }}>
        <section className="card">
          <div className="card-title">
            <h3>Registrar control</h3>
            <CalendarIcon size={16} />
          </div>

          <form onSubmit={handleCheckup} className="stack" style={{ gap: '0.85rem' }}>
            <div className="row" style={{ gap: '0.75rem' }}>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="ckWeek">Semana</label>
                <input
                  id="ckWeek"
                  type="number"
                  className="input"
                  min={1}
                  max={42}
                  value={checkupForm.pregnancy_week}
                  onChange={(e) => setCheckupForm((p) => ({ ...p, pregnancy_week: e.target.value }))}
                />
              </div>
              <div className="field" style={{ flex: 1 }}>
                <label htmlFor="ckWeight">Peso (kg)</label>
                <input
                  id="ckWeight"
                  type="number"
                  step="0.1"
                  className="input"
                  min={30}
                  max={200}
                  value={checkupForm.weight_kg}
                  onChange={(e) => setCheckupForm((p) => ({ ...p, weight_kg: e.target.value }))}
                  placeholder="68.5"
                />
              </div>
            </div>

            <div className="field">
              <label htmlFor="ckPressure">Presion arterial</label>
              <input
                id="ckPressure"
                className="input"
                value={checkupForm.blood_pressure}
                onChange={(e) => setCheckupForm((p) => ({ ...p, blood_pressure: e.target.value }))}
                placeholder="110/70"
              />
            </div>

            <div className="field">
              <label htmlFor="ckNotes">Notas del control</label>
              <textarea
                id="ckNotes"
                className="textarea"
                rows={3}
                value={checkupForm.notes}
                onChange={(e) => setCheckupForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="Resultados, indicaciones del medico..."
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <PlusIcon size={15} />
              Guardar control
            </button>
          </form>
        </section>

        <section className="card">
          <div className="card-title">
            <h3>Registrar sintoma</h3>
            <PlusIcon size={16} />
          </div>

          <form onSubmit={handleSymptom} className="stack" style={{ gap: '0.85rem' }}>
            <div className="field">
              <label htmlFor="symName">Sintoma</label>
              <input
                id="symName"
                className="input"
                value={symptomForm.symptom}
                onChange={(e) => setSymptomForm((p) => ({ ...p, symptom: e.target.value }))}
                placeholder="Ej: Nauseas matutinas"
                required
              />
              <div className="row-wrap" style={{ marginTop: '0.4rem' }}>
                {COMMON_SYMPTOMS.map((symptom) => (
                  <button
                    key={symptom}
                    type="button"
                    className={`chip ${symptomForm.symptom === symptom ? 'active' : ''}`}
                    onClick={() => setSymptomForm((p) => ({ ...p, symptom }))}
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.55rem' }}
                  >
                    {symptom}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label htmlFor="symSeverity">Intensidad: {symptomForm.severity} de 5</label>
              <input
                id="symSeverity"
                type="range"
                min={1}
                max={5}
                value={symptomForm.severity}
                onChange={(e) => setSymptomForm((p) => ({ ...p, severity: e.target.value }))}
                style={{ accentColor: 'var(--blue-500)' }}
              />
              <span className="field-hint">
                1 es leve, 5 es muy intenso. Si es intenso o acompanado de sangrado, dolor fuerte o
                perdida de liquido, contacta a tu medico.
              </span>
            </div>

            <div className="field">
              <label htmlFor="symNotes">Notas</label>
              <textarea
                id="symNotes"
                className="textarea"
                rows={2}
                value={symptomForm.notes}
                onChange={(e) => setSymptomForm((p) => ({ ...p, notes: e.target.value }))}
                placeholder="A que hora ocurre, que lo mejora..."
              />
            </div>

            <button type="submit" className="btn btn-primary">
              <PlusIcon size={15} />
              Guardar sintoma
            </button>
          </form>
        </section>
      </div>

      <div className="grid grid-2">
        <section className="card">
          <div className="card-title">
            <h3>Controles registrados</h3>
            <span className="badge">{checkups.length}</span>
          </div>

          {checkups.length === 0 ? (
            <div className="empty-state">
              <FloralCorner size={56} className="empty-icon" />
              <p>Aun no registras controles. Anota peso y presion en cada consulta.</p>
            </div>
          ) : (
            <div className="list">
              {checkups.map((item) => (
                <div key={item.id} className="list-item">
                  <div className="item-dot blue" />
                  <div className="list-item-main">
                    <div className="list-item-title">
                      {item.pregnancy_week ? `Semana ${item.pregnancy_week}` : 'Control'}
                    </div>
                    <div className="list-item-meta">
                      {item.weight_kg ? `${item.weight_kg} kg` : ''}
                      {item.weight_kg && item.blood_pressure ? ' - ' : ''}
                      {item.blood_pressure ?? ''}
                    </div>
                    {item.notes && (
                      <div className="list-item-meta" style={{ marginTop: '0.25rem' }}>
                        {item.notes}
                      </div>
                    )}
                  </div>
                  <span className="badge badge-sand">{formatDate(item.recorded_at)}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="card">
          <div className="card-title">
            <h3>Sintomas registrados</h3>
            <span className="badge">{symptoms.length}</span>
          </div>

          {symptoms.length === 0 ? (
            <div className="empty-state">
              <FloralCorner size={56} className="empty-icon" />
              <p>Sin registro de sintomas. Llevar este historial ayuda mucho en la consulta.</p>
            </div>
          ) : (
            <div className="list">
              {symptoms.map((item) => (
                <div key={item.id} className="list-item">
                  <div className={`item-dot ${item.severity >= 4 ? 'blush' : 'sage'}`} />
                  <div className="list-item-main">
                    <div className="list-item-title">{item.symptom}</div>
                    <div className="list-item-meta">
                      {item.pregnancy_week ? `Semana ${item.pregnancy_week}` : 'Registro'} - intensidad{' '}
                      {item.severity}/5
                    </div>
                    {item.notes && (
                      <div className="list-item-meta" style={{ marginTop: '0.25rem' }}>
                        {item.notes}
                      </div>
                    )}
                  </div>
                  <span className="badge badge-sand">{formatDateTime(item.created_at)}</span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="card">
        <div className="card-title">
          <h3>Calendario tipico de controles</h3>
          <span className="badge badge-sand">Referencia general</span>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
          Estos son los momentos que la guia general sugiere. Tu clinica define el calendario real
          segun tu caso.
        </p>
        <div className="grid grid-4" style={{ gap: '0.75rem' }}>
          {COMMON_CHECKUPS.map((item) => (
            <div
              key={item.week}
              className="stat-tile"
              style={
                pregnancy?.current_week >= item.week
                  ? { borderColor: 'var(--blue-300)', background: 'var(--blue-50)' }
                  : undefined
              }
            >
              <div className="value" style={{ fontSize: '1.3rem' }}>
                S{item.week}
              </div>
              <div className="label" style={{ fontSize: '0.68rem', lineHeight: 1.4 }}>
                {item.focus}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
