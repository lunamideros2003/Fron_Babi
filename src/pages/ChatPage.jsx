import { useEffect, useRef, useState } from 'react';
import api from '../api/client.js';
import { useAuth } from '../context/AuthContext.jsx';
import { SendIcon, SparkleIcon, BrandMark, TrashIcon, InfoIcon } from '../components/Icons.jsx';
import { formatDateTime } from '../utils/format.js';

const CATEGORIES = [
  { key: 'alimentacion', label: 'Alimentacion', questions: ['Que puedo comer?', 'Cuanto peso puedo ganar?'] },
  { key: 'sintomas', label: 'Sintomas', questions: ['Tengo nauseas, que hago?', 'Como puedo dormir mejor?'] },
  { key: 'controles', label: 'Controles', questions: ['Que controles necesito?', 'Cuando es la ecografia?'] },
  { key: 'ejercicio', label: 'Ejercicio', questions: ['Puedo hacer ejercicio?', 'Como hago suelo pelvico?'] },
  { key: 'desarrollo', label: 'Desarrollo', questions: ['Que se siente cuando se mueve?', 'Como lo estimulo?'] },
  { key: 'parto', label: 'Parto', questions: ['Que llevo al hospital?', 'Cuando es el parto?'] },
  { key: 'emocional', label: 'Emocional', questions: ['Me siento ansiosa', 'Tengo mucho estres'] },
];

export default function ChatPage() {
  const { user, pregnancy } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [activeCategory, setActiveCategory] = useState(null);
  const [error, setError] = useState('');
  const [provider, setProvider] = useState(null);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    let active = true;

    async function load() {
      try {
        const [history, meta] = await Promise.all([
          api.chat.history(),
          api.health().catch(() => null),
        ]);
        if (!active) return;
        setMessages(history.messages ?? []);
        setProvider(meta?.ai?.active ?? null);
      } catch {
        if (active) setError('No se pudo cargar el historial.');
      }
    }

    load();
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, sending]);

  async function handleSend(event) {
    event?.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setInput('');
    setError('');
    setSending(true);
    setMessages((prev) => [...prev, { id: `tmp-${Date.now()}`, role: 'user', content: text }]);

    try {
      const data = await api.chat.send(text);
      setMessages((prev) => [
        ...prev,
        {
          id: data.reply.id,
          role: 'assistant',
          content: data.reply.content,
          category: data.reply.category,
          category_label: data.reply.category_label,
          confidence: data.reply.confidence,
          provider: data.reply.provider,
          is_emergency: data.reply.is_emergency,
          is_redirect: data.reply.is_redirect,
          is_fallback: data.reply.is_fallback,
          created_at: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setError(err.message);
      setMessages((prev) => prev.filter((m) => m.id !== `tmp-${Date.now()}`));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  async function handleClear() {
    try {
      await api.chat.clear();
      setMessages([]);
    } catch (err) {
      setError(err.message);
    }
  }

  function handleSuggestion(text) {
    setInput(text);
    inputRef.current?.focus();
  }

  return (
    <div className="stack" style={{ gap: '1rem' }}>
      <div className="page-head" style={{ marginBottom: 0 }}>
        <p className="eyebrow">Asistente educativo</p>
        <h1>Pregunta lo que necesites</h1>
        <p className="lede">
          BabyTrack IA clasifica tu pregunta por categoria y responde con informacion
          educativa de tu etapa. Nunca diagnostica ni receta medicamentos.
        </p>
      </div>

      <div className="chat-layout">
        <section className="chat-panel">
          <div className="chat-head">
            <BrandMark size={30} />
            <div style={{ flex: 1 }}>
              <h3>BabyTrack IA</h3>
              <div className="status">
                {provider === 'openai'
                  ? 'Conectado al modelo de lenguaje'
                  : 'Modo local (responde igual, sin conexion)'}
                {pregnancy ? ` - Semana ${pregnancy.current_week}` : ''}
              </div>
            </div>
            {messages.length > 0 && (
              <button type="button" className="btn btn-ghost btn-sm" onClick={handleClear}>
                <TrashIcon size={14} />
                Limpiar
              </button>
            )}
          </div>

          <div className="chat-messages">
            {messages.length === 0 && (
              <div className="empty-state">
                <BrandMark size={52} className="empty-icon" />
                <p>
                  Hola {user?.name?.split(' ')[0]}. Preguntame sobre alimentacion, controles,
                  sintomas, ejercicio, desarrollo o el parto.
                </p>
              </div>
            )}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`msg ${message.role} ${message.is_emergency ? 'emergency' : ''} ${
                  message.is_redirect ? 'redirect' : ''
                }`}
              >
                <div className="msg-avatar">
                  {message.role === 'user' ? 'Tu' : <SparkleIcon size={15} />}
                </div>
                <div>
                  <div className="msg-bubble">{message.content}</div>
                  {message.role === 'assistant' && (
                    <div className="msg-meta">
                      {message.category_label && (
                        <span className="msg-tag">{message.category_label}</span>
                      )}
                      {message.confidence >= 0.7 && (
                        <span className="badge badge-sage" style={{ fontSize: '0.62rem' }}>
                          Alta certeza
                        </span>
                      )}
                      {message.is_emergency && (
                        <span className="badge badge-danger">Urgente</span>
                      )}
                      {message.is_redirect && <span className="badge badge-gold">Redirigido</span>}
                      {message.provider && (
                        <span style={{ fontSize: '0.66rem', color: 'var(--ink-muted)' }}>
                          {message.provider}
                        </span>
                      )}
                    </div>
                  )}
                  {message.created_at && (
                    <div className="msg-meta">
                      <span style={{ fontSize: '0.65rem', color: 'var(--ink-muted)' }}>
                        {formatDateTime(message.created_at)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {sending && (
              <div className="msg assistant">
                <div className="msg-avatar">
                  <SparkleIcon size={15} />
                </div>
                <div className="msg-bubble typing">
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <div className="chat-input-bar">
            {error && <div className="form-error" style={{ marginBottom: '0.7rem' }}>{error}</div>}

            <div className="chat-suggestions">
              {CATEGORIES.slice(0, 4).map((category) => (
                <button
                  key={category.key}
                  type="button"
                  className="chip"
                  onClick={() => handleSuggestion(category.questions[0])}
                >
                  {category.label}
                </button>
              ))}
            </div>

            <form className="chat-form" onSubmit={handleSend}>
              <textarea
                ref={inputRef}
                className="textarea"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) handleSend(e);
                }}
                placeholder="Escribe tu pregunta sobre el embarazo..."
                rows={1}
                maxLength={1000}
              />
              <button type="submit" className="chat-send" disabled={!input.trim() || sending}>
                <SendIcon size={18} />
              </button>
            </form>

            <div
              className="row"
              style={{ marginTop: '0.5rem', fontSize: '0.7rem', color: 'var(--ink-muted)' }}
            >
              <InfoIcon size={13} />
              Enter envia - Shift+Enter salto de linea
            </div>
          </div>
        </section>

        <aside className="chat-aside stack" style={{ gap: '0.85rem' }}>
          <section className="card">
            <div className="card-title">
              <h3>Categorias</h3>
            </div>
            <div className="row-wrap">
              {CATEGORIES.map((category) => (
                <button
                  key={category.key}
                  type="button"
                  className={`chip ${activeCategory === category.key ? 'active' : ''}`}
                  onClick={() => setActiveCategory(activeCategory === category.key ? null : category.key)}
                >
                  {category.label}
                </button>
              ))}
            </div>

            {activeCategory && (
              <div className="list" style={{ marginTop: '0.85rem' }}>
                {CATEGORIES.find((c) => c.key === activeCategory)?.questions.map((question) => (
                  <button
                    key={question}
                    type="button"
                    className="btn btn-ghost btn-sm"
                    style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                    onClick={() => handleSuggestion(question)}
                  >
                    {question}
                  </button>
                ))}
              </div>
            )}
          </section>

          <section className="card">
            <div className="card-title">
              <h3>Preguntas frecuentes</h3>
            </div>
            <div className="list">
              {[
                'Que puedo comer en el embarazo?',
                'Que controles necesito y cuando?',
                'Puedo hacer ejercicio?',
                'Que se siente cuando se mueve el bebe?',
                'Que llevo al hospital?',
                'Me siento ansiosa, que hago?',
              ].map((question) => (
                <button
                  key={question}
                  type="button"
                  className="btn btn-ghost btn-sm"
                  style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  onClick={() => handleSuggestion(question)}
                >
                  {question}
                </button>
              ))}
            </div>
          </section>

          <div className="disclaimer">
            <InfoIcon size={15} />
            <span>
              Si tienes sangrado, perdida de liquido, dolor intenso o falta de movimientos,
              contacta de inmediato a tu equipo medico. Esta herramienta no evalua tu situacion
              clinica.
            </span>
          </div>
        </aside>
      </div>
    </div>
  );
}
