import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Disclaimer from '../components/Disclaimer.jsx';
import { MotherSilhouette } from '../components/Icons.jsx';

const TRIMESTERS = [
  { key: 1, label: 'Primer trimestre', range: 'Semanas 1 a 13' },
  { key: 2, label: 'Segundo trimestre', range: 'Semanas 14 a 27' },
  { key: 3, label: 'Tercer trimestre', range: 'Semanas 28 a 40' },
];

export default function WeekPage() {
  const { pregnancy } = useAuth();
  const [params, setParams] = useSearchParams();
  const [weeks, setWeeks] = useState([]);
  const [selected, setSelected] = useState(Number(params.get('w')) || pregnancy?.current_week || 20);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const data = await api.weeks.list();
        if (!active) return;
        setWeeks(data.weeks ?? []);
        setError('');
      } catch (err) {
        if (active) setError(err.message);
      } finally {
        if (active) setLoading(false);
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  function handleSelect(weekNumber) {
    setSelected(weekNumber);
    setParams({ w: String(weekNumber) });
  }

  const current = weeks.find((w) => w.week_number === selected) ?? weeks[0];
  const trimester = TRIMESTERS.find((t) => selected <= (t.key === 1 ? 13 : t.key === 2 ? 27 : 40));

  if (loading) {
    return (
      <div className="stack">
        <div className="skeleton" style={{ height: 130, borderRadius: 22 }} />
        <div className="skeleton" style={{ height: 320, borderRadius: 14 }} />
      </div>
    );
  }

  if (error) return <div className="form-error">{error}</div>;
  if (!current) return <p>No hay informacion de semanas disponible.</p>;

  return (
    <div className="stack">
      <div className="page-head">
        <p className="eyebrow">{trimester?.label} - {trimester?.range}</p>
        <h1>Semana {current.week_number}</h1>
        <p className="lede">
          Explora como evoluciona el embarazo semana a semana y tuck away lo tipico de esta etapa.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'minmax(0, 1fr) 260px', gap: '1.25rem' }}>
        <div className="stack">
          <section className="week-card">
            <div className="row" style={{ alignItems: 'flex-start' }}>
              <div className="week-number-badge">
                <div>
                  <span className="num">{current.week_number}</span>
                  <span className="lbl">semana</span>
                </div>
              </div>
              <div style={{ flex: 1 }}>
                <div className="row-wrap" style={{ marginBottom: '0.3rem' }}>
                  <h3>{current.title}</h3>
                  {pregnancy?.current_week === current.week_number && (
                    <span className="badge">Tu semana actual</span>
                  )}
                </div>
                <p style={{ color: 'var(--text-soft)', fontSize: '0.9rem', margin: 0 }}>
                  {current.summary}
                </p>
              </div>
            </div>

            <div className="grid grid-3" style={{ marginTop: '1.25rem', gap: '0.85rem' }}>
              <div className="stat-tile">
                <div className="value" style={{ fontSize: '1.15rem' }}>{current.size_comparison}</div>
                <div className="label">Tamano</div>
              </div>
              <div className="stat-tile">
                <div className="value" style={{ fontSize: '1.15rem' }}>{current.typical_weight ?? '--'}</div>
                <div className="label">Peso tipico</div>
              </div>
              <div className="stat-tile">
                <div className="value" style={{ fontSize: '1.15rem' }}>{current.typical_length ?? '--'}</div>
                <div className="label">Longitud</div>
              </div>
            </div>
          </section>

          <section className="card">
            <div className="card-title">
              <h3>Desarrollo de tu bebe</h3>
            </div>
            <p style={{ color: 'var(--text-soft)', fontSize: '0.92rem' }}>{current.baby_development}</p>
          </section>

          <section className="card">
            <div className="card-title">
              <h3>Cambios en tu cuerpo</h3>
            </div>
            <p style={{ color: 'var(--text-soft)', fontSize: '0.92rem' }}>{current.mother_changes}</p>
          </section>

          <div className="grid grid-3">
            <section className="card">
              <div className="card-title">
                <h3>Alimentacion</h3>
              </div>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.88rem' }}>{current.food_focus}</p>
            </section>
            <section className="card">
              <div className="card-title">
                <h3>Ejercicio</h3>
              </div>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.88rem' }}>{current.exercise_tip}</p>
            </section>
            <section className="card">
              <div className="card-title">
                <h3>En tu control</h3>
              </div>
              <p style={{ color: 'var(--text-soft)', fontSize: '0.88rem' }}>{current.checkup_focus}</p>
            </section>
          </div>

          {current.tips && (
            <section
              style={{
                padding: '1.1rem 1.25rem',
                background: 'var(--gold-soft)',
                borderRadius: 'var(--radius)',
                border: '1px solid rgba(201, 169, 97, 0.3)',
              }}
            >
              <p style={{ margin: 0, color: '#7a6020', fontSize: '0.9rem' }}>
                <strong>Consejo de la semana: </strong>
                {current.tips}
              </p>
            </section>
          )}

          <div className="week-nav">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleSelect(Math.max(4, current.week_number - 1))}
              disabled={current.week_number <= 4}
            >
              Semana anterior
            </button>
            <span className="spacer" />
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={() => handleSelect(Math.min(40, current.week_number + 1))}
              disabled={current.week_number >= 40}
            >
              Semana siguiente
            </button>
          </div>

          <Disclaimer />
        </div>

        <aside className="card" style={{ position: 'sticky', top: 80 }}>
          <div className="card-title">
            <h3>Semanas</h3>
          </div>
          <div className="timeline" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
            {weeks.map((week) => {
              const progress = Math.min(100, Math.round((week.week_number / 40) * 100));
              return (
                <button
                  key={week.week_number}
                  type="button"
                  className={`timeline-week ${week.week_number === selected ? 'is-current' : ''}`}
                  onClick={() => handleSelect(week.week_number)}
                >
                  <div className="timeline-num">{week.week_number}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      {week.title}
                    </div>
                    <div className="timeline-bar">
                      <span style={{ width: `${progress}%` }} />
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </aside>
      </div>
    </div>
  );
}

export { MotherSilhouette };
