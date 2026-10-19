import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import FruitIllustration from '../components/Fruit.jsx';
import { ChevronLeftIcon, ChevronRightIcon } from '../components/Icons.jsx';

function trimesterOf(week) {
  if (week < 13) return 'Primer trimestre';
  if (week < 28) return 'Segundo trimestre';
  return 'Tercer trimestre';
}

export default function WeekPage() {
  const { pregnancy } = useAuth();
  const [params, setParams] = useSearchParams();
  const [weeks, setWeeks] = useState([]);
  const [selected, setSelected] = useState(
    Number(params.get('w')) || pregnancy?.current_week || 20,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let activo = true;

    api.weeks
      .list()
      .then((data) => {
        if (!activo) return;
        setWeeks(data.weeks ?? []);
        setError('');
      })
      .catch((err) => {
        if (activo) setError(err.message);
      })
      .finally(() => {
        if (activo) setLoading(false);
      });

    return () => {
      activo = false;
    };
  }, []);

  function handleSelect(weekNumber) {
    setSelected(weekNumber);
    setParams({ w: String(weekNumber) });
  }

  const current = weeks.find((w) => w.week_number === selected) ?? weeks[0];
  const actual = pregnancy?.current_week ?? null;
  const esActual = actual === current?.week_number;
  const esFutura = actual !== null && current && current.week_number > actual;

  if (loading) {
    return (
      <div className="stack">
        <div className="skeleton" style={{ height: 90, borderRadius: 20 }} />
        <div className="skeleton" style={{ height: 320, borderRadius: 14 }} />
      </div>
    );
  }

  if (error) return <div className="form-error">{error}</div>;
  if (!current) return <p>No hay información de semanas disponible.</p>;

  return (
    <div className="week-page">
      <div className="page-head">
        <p className="eyebrow">Acompañándote semana a semana</p>
        <h1>Mi embarazo</h1>
        {actual && (
          <p className="lede">
            Vas por la semana {actual}. Puedes mirar cualquier semana de las 37 que tenemos
            guardadas.
          </p>
        )}
      </div>

      {/* Selector compacto */}
      <div className="week-selector">
        <button
          type="button"
          className="week-arrow"
          onClick={() => handleSelect(Math.max(4, current.week_number - 1))}
          disabled={current.week_number <= 4}
          aria-label="Semana anterior"
        >
          <ChevronLeftIcon size={16} />
        </button>

        <div className="week-selector-body">
          <label className="week-select-label" htmlFor="weekSelect">
            Semana {current.week_number}
          </label>
          <select
            id="weekSelect"
            className="select"
            value={current.week_number}
            onChange={(e) => handleSelect(Number(e.target.value))}
          >
            {weeks.map((week) => (
              <option key={week.week_number} value={week.week_number}>
                Semana {week.week_number} — {week.title}
              </option>
            ))}
          </select>
        </div>

        <button
          type="button"
          className="week-arrow"
          onClick={() => handleSelect(Math.min(40, current.week_number + 1))}
          disabled={current.week_number >= 40}
          aria-label="Semana siguiente"
        >
          <ChevronRightIcon size={16} />
        </button>
      </div>

      <header className="week-hero">
        <div>
          <h2 className="week-hero-title">Semana {current.week_number}</h2>
          <p className="week-hero-sub">{current.title}</p>
          <p className="week-hero-meta">
            {trimesterOf(current.week_number)}
            {esActual ? ' · es tu semana actual' : ''}
          </p>
        </div>
        <span className="week-hero-fruit">
          <FruitIllustration sizeComparison={current.size_comparison} size={72} />
        </span>
      </header>

      {esFutura && (
        <p className="week-orientative">
          Esta semana aún no te toca. La información es orientativa: cada embarazo avanza a su
          ritmo.
        </p>
      )}

      <div className="week-blocks">
        <section className="week-block">
          <h3>Tu bebé</h3>
          <p>{current.baby_development}</p>
          <ul className="week-facts">
            <li>
              <span>Tamaño aproximado</span>
              <strong>{current.size_comparison}</strong>
            </li>
            {current.typical_weight && (
              <li>
                <span>Peso habitual</span>
                <strong>{current.typical_weight}</strong>
              </li>
            )}
            {current.typical_length && (
              <li>
                <span>Longitud habitual</span>
                <strong>{current.typical_length}</strong>
              </li>
            )}
          </ul>
        </section>

        <section className="week-block">
          <h3>Tu cuerpo</h3>
          <p>{current.mother_changes}</p>
        </section>

        <section className="week-block">
          <h3>Cuidados de esta semana</h3>
          <p>{current.tips || 'Descansa, hidratate y avisa a tu equipo de salud si algo te preocupa.'}</p>
        </section>

        <section className="week-block">
          <h3>Alimentación y bienestar</h3>
          {current.food_focus && <p>{current.food_focus}</p>}
          {current.exercise_tip && <p>{current.exercise_tip}</p>}
        </section>

        <section className="week-block">
          <h3>Controles y preguntas</h3>
          <p>{current.checkup_focus || 'Apunta tus dudas para llevarlas a tu próxima consulta.'}</p>
        </section>
      </div>

      <p className="week-note">
        La información de cada semana describe lo más habitual, no lo que necesariamente te va a
        ocurrir. Ante cualquier molestia nueva, coméntalo con tu profesional de salud.
      </p>
    </div>
  );
}
