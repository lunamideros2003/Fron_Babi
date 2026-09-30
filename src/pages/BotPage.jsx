import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import Disclaimer from '../components/Disclaimer.jsx';
import {
  BrandMark,
  CheckIcon,
  MotherSilhouette,
  SparkleIcon,
  PlusIcon,
  TrashIcon,
} from '../components/Icons.jsx';

const CATEGORY_LABELS = {
  desarrollo: 'Desarrollo',
  emocional: 'Bienestar emocional',
  sintomas: 'Sintomas',
  alimentacion: 'Alimentacion',
  ejercicio: 'Ejercicio',
  controles: 'Controles',
  general: 'General',
};

export default function BotPage() {
  const { user, pregnancy } = useAuth();

  const [phase, setPhase] = useState('intro');
  const [session, setSession] = useState(null);
  const [question, setQuestion] = useState(null);
  const [feedback, setFeedback] = useState('');
  const [summary, setSummary] = useState('');
  const [score, setScore] = useState(null);
  const [multi, setMulti] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [history, setHistory] = useState([]);

  const loadHistory = useCallback(async () => {
    try {
      const data = await api.bot.sessions();
      setHistory(data.sessions ?? []);
    } catch {
      setHistory([]);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const handleStart = useCallback(async () => {
    setError('');
    setBusy(true);

    try {
      const data = await api.bot.start();
      setSession(data.session);
      setQuestion(data.question);
      setFeedback('');
      setSummary('');
      setScore(null);
      setMulti([]);
      setText('');
      setPhase('questions');
      loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }, [loadHistory]);

  const handleAnswer = useCallback(
    async (payload) => {
      if (!session) return;
      setError('');
      setBusy(true);

      try {
        const data = await api.bot.answer(session.id, payload);
        setFeedback(data.feedback ?? '');
        setSession(data.session);

        if (data.is_complete) {
          setSummary(data.summary);
          setScore(data.score);
          setQuestion(null);
          setPhase('summary');
        } else {
          setQuestion(data.question);
          setMulti([]);
          setText('');
        }

        loadHistory();
      } catch (err) {
        setError(err.message);
      } finally {
        setBusy(false);
      }
    },
    [session, loadHistory],
  );

  async function handleResume(id) {
    setError('');
    setBusy(true);

    try {
      const data = await api.bot.session(id);
      setSession(data.session);
      setScore(data.score ?? null);
      setSummary(data.summary ?? '');

      if (data.session.status === 'completed') {
        setQuestion(null);
        setFeedback('');
        setPhase('summary');
      } else {
        setQuestion(data.question);
        setFeedback('');
        setMulti([]);
        setText('');
        setPhase('questions');
      }

      loadHistory();
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  async function handleRemove(id) {
    try {
      await api.bot.remove(id);
      setHistory((prev) => prev.filter((item) => item.id !== id));
      if (session?.id === id) {
        setPhase('intro');
        setSession(null);
        setQuestion(null);
        setSummary('');
        setScore(null);
      }
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <div className="stack" style={{ gap: '1.25rem' }}>
      <div className="page-head" style={{ marginBottom: 0 }}>
        <p className="eyebrow">Bot de preguntas</p>
        <h1>Consulta guiada</h1>
        <p className="lede">
          El bot te hace una serie de preguntas sobre tu embarazo, te responde segun lo que
          contestas y al final te da un resumen con tu puntaje de seguimiento.
        </p>
      </div>

      {error && <div className="form-error">{error}</div>}

      <div className="bot-layout">
        <section className="bot-panel">
          <div className="bot-head">
            <BrandMark size={32} />
            <div style={{ flex: 1 }}>
              <h3>BabyTrack Bot</h3>
              <div className="bot-status">
                {phase === 'questions' && session
                  ? `Pregunta ${session.current_index + 1} de ${question?.total ?? 10}`
                  : phase === 'summary'
                    ? 'Sesion completada'
                    : 'Listo para empezar'}
                {pregnancy ? ` - Semana ${pregnancy.current_week}` : ''}
              </div>
            </div>
            {session && phase === 'questions' && (
              <button
                type="button"
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setPhase('intro');
                  setSession(null);
                  setQuestion(null);
                  setFeedback('');
                }}
              >
                Salir
              </button>
            )}
          </div>

          {phase === 'questions' && question && (
            <div className="bot-progress">
              <div className="bot-progress-row">
                <span>
                  Pregunta {question.index + 1} de {question.total}
                </span>
                <span>{question.progress}%</span>
              </div>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${question.progress}%` }} />
              </div>
            </div>
          )}

          {phase === 'intro' && (
            <div className="bot-body">
              <div className="bot-intro">
                <MotherSilhouette size={96} className="bot-illustration" />
                <h3>Vamos a revisar como estas</h3>
                <p>
                  Son 10 preguntas cortas. El bot te responde segun lo que contestas y al final
                  te da un resumen con tu puntaje de seguimiento.
                </p>

                <ul className="auth-features bot-steps-preview">
                  <li>
                    <span className="num">1</span> Responde a lo que te pregunte
                  </li>
                  <li>
                    <span className="num">2</span> Recibe una respuesta a cada respuesta
                  </li>
                  <li>
                    <span className="num">3</span> Recibe un resumen con tu puntaje
                  </li>
                </ul>

                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleStart}
                  disabled={busy}
                  style={{ marginTop: '1.25rem' }}
                >
                  {busy ? <span className="loader" style={{ width: 15, height: 15 }} /> : <SparkleIcon size={15} />}
                  Empezar la consulta
                </button>
              </div>
            </div>
          )}

          {phase === 'questions' && question && (
            <>
              <div className="bot-body">
                <div className="bot-step">
                  <span className="badge badge-sand" style={{ marginBottom: '0.6rem' }}>
                    {CATEGORY_LABELS[question.category] ?? question.category}
                  </span>
                  <h3 className="bot-question">{question.text}</h3>
                  {question.help && <p className="bot-help">{question.help}</p>}

                  {question.type === 'single' && (
                    <div className="bot-options">
                      {question.options.map((option) => (
                        <button
                          key={option.value}
                          type="button"
                          className="bot-option"
                          onClick={() => handleAnswer({ questionId: question.id, value: option.value })}
                          disabled={busy}
                        >
                          <span className="bot-option-mark" />
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}

                  {question.type === 'multi' && (
                    <>
                      <div className="bot-options">
                        {question.options.map((option) => {
                          const selected = multi.includes(option.value);
                          const locked = busy || (multi.includes('ninguno') && option.value !== 'ninguno');

                          return (
                            <button
                              key={option.value}
                              type="button"
                              className={`bot-option ${selected ? 'selected' : ''}`}
                              onClick={() => {
                                if (busy) return;
                                if (option.value === 'ninguno') {
                                  setMulti(selected ? [] : ['ninguno']);
                                  return;
                                }
                                const next = selected
                                  ? multi.filter((item) => item !== option.value)
                                  : [...multi.filter((item) => item !== 'ninguno'), option.value];
                                setMulti(next);
                              }}
                              disabled={locked}
                            >
                              <span className="bot-option-mark box">
                                {selected && <CheckIcon size={11} />}
                              </span>
                              {option.label}
                            </button>
                          );
                        })}
                      </div>

                      <div className="bot-footer" style={{ border: 'none', background: 'none', padding: 0 }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {multi.length === 0 ? 'Elige al menos una' : `${multi.length} seleccionada(s)`}
                        </span>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() => handleAnswer({ questionId: question.id, value: multi })}
                          disabled={busy || multi.length === 0}
                        >
                          {busy && <span className="loader" style={{ width: 14, height: 14 }} />}
                          Confirmar
                        </button>
                      </div>
                    </>
                  )}

                  {question.type === 'scale' && (
                    <>
                      <div className="bot-scale">
                        {Array.from({ length: question.max - question.min + 1 }, (_, i) => i + question.min).map(
                          (number) => (
                            <button
                              key={number}
                              type="button"
                              onClick={() => handleAnswer({ questionId: question.id, value: number })}
                              disabled={busy}
                            >
                              {number}
                            </button>
                          ),
                        )}
                      </div>
                      <div className="bot-scale-labels">
                        <span>{question.minLabel}</span>
                        <span>{question.maxLabel}</span>
                      </div>
                    </>
                  )}

                  {question.type === 'text' && (
                    <>
                      <textarea
                        className="textarea"
                        rows={3}
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        placeholder={question.placeholder}
                        maxLength={500}
                        disabled={busy}
                      />
                      <div className="bot-footer" style={{ border: 'none', background: 'none', padding: '0.75rem 0 0' }}>
                        <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                          {text.length}/500
                        </span>
                        <button
                          type="button"
                          className="btn btn-primary"
                          onClick={() =>
                            handleAnswer({
                              questionId: question.id,
                              text,
                              value: text.trim() ? 'texto' : 'vacio',
                            })
                          }
                          disabled={busy}
                        >
                          {busy && <span className="loader" style={{ width: 14, height: 14 }} />}
                          {text.trim() ? 'Enviar' : 'Saltar'}
                        </button>
                      </div>
                    </>
                  )}
                </div>

                {feedback && (
                  <div className="bot-feedback">
                    <SparkleIcon size={16} />
                    <p>{feedback}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {phase === 'summary' && (
            <div className="bot-body">
              <div className="bot-summary">
                <div className="score-ring">
                  <div className="score-circle">
                    <div style={{ textAlign: 'center' }}>
                      <span className="num">{score ?? 0}</span>
                      <span className="den">/12</span>
                    </div>
                  </div>
                  <div className="score-text">
                    <h3>Resumen de tu consulta</h3>
                    <p>
                      {session
                        ? `Completaste las 10 preguntas${session.pregnancy_week ? ` con informacion de tu semana ${session.pregnancy_week}` : ''}.`
                        : 'Completaste las 10 preguntas.'}
                    </p>
                  </div>
                </div>

                <div
                  className="bot-feedback"
                  style={{ background: 'var(--surface-alt)', borderLeftColor: 'var(--blue-500)' }}
                >
                  <SparkleIcon size={16} />
                  <div>
                    <p style={{ whiteSpace: 'pre-wrap' }}>{summary}</p>
                  </div>
                </div>

                <div className="bot-cta">
                  <button type="button" className="btn btn-primary" onClick={handleStart} disabled={busy}>
                    <PlusIcon size={15} />
                    Hacer otra consulta
                  </button>
                  <Link to="/recordatorios" className="btn btn-secondary">
                    Ver mis recordatorios
                  </Link>
                  <Link to="/seguimiento" className="btn btn-secondary">
                    Registrar sintomas
                  </Link>
                </div>
              </div>
            </div>
          )}
        </section>

        <aside className="bot-aside stack" style={{ gap: '0.85rem' }}>
          <section className="card">
            <div className="card-title">
              <h3>Sesiones anteriores</h3>
              {history.length > 0 && <span className="badge badge-sand">{history.length}</span>}
            </div>

            {history.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>
                Todavia no has hecho ninguna consulta. Cuando lo hagas aparecera aqui.
              </p>
            ) : (
              <div className="list">
                {history.map((item) => (
                  <div key={item.id} className="list-item">
                    <div className={`item-dot ${item.status === 'completed' ? 'sage' : 'blue'}`} />
                    <button
                      type="button"
                      className="list-item-main"
                      onClick={() => handleResume(item.id)}
                      style={{ background: 'none', border: 'none', textAlign: 'left', cursor: 'pointer' }}
                    >
                      <div className="list-item-title">
                        {item.status === 'completed' ? 'Consulta completada' : 'Consulta en curso'}
                      </div>
                      <div className="list-item-meta">
                        {item.status === 'completed' && item.score !== null
                          ? `${item.score} de 12 puntos`
                          : `${item.answers_count} de 10 respondidas`}
                      </div>
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => handleRemove(item.id)}
                      aria-label="Eliminar sesion"
                      style={{ color: 'var(--danger)' }}
                    >
                      <TrashIcon size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <div className="card-title">
              <h3>Que hace el bot</h3>
            </div>
            <ul className="summary-list good">
              <li>Te pregunta sobre alimentacion, sintomas, ejercicio y controles</li>
              <li>Responde a cada respuesta con orientacion general</li>
              <li>Calcula un puntaje de seguimiento de 0 a 12</li>
              <li>Resume lo que haces bien y lo que te puede ayudar</li>
            </ul>
          </section>

          <Disclaimer text="El bot da informacion educativa. No diagnostica enfermedades ni indica medicamentos." />
        </aside>
      </div>
    </div>
  );
}
