import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  BrandMark,
  ChatBubbleIcon,
  CloseIcon,
  MinimizeIcon,
  SendIcon,
} from '../Icons.jsx';
import ChatMessage from './ChatMessage.jsx';
import ChatSuggestions from './ChatSuggestions.jsx';
import TypingDots from './TypingDots.jsx';

const OPEN_KEY = 'babytrack_chat_open';

const WELCOME_FALLBACK =
  'Hola. Hazme preguntas sobre tu embarazo y resolvámoslas juntas.';

/**
 * Asistente flotante.
 *
 * La conversación se guarda en el servidor igual que la del chat completo,
 * pero aqui se piden respuestas cortas (`/chat/quick`) y solo se cargan los
 * ultimos mensajes. El saludo y las sugerencias los prepara el backend segun
 * la semana, asi que abrir la ventana no gasta tokens.
 */
export default function ChatWidget() {
  const { pregnancy, isAuthenticated } = useAuth();

  const [open, setOpen] = useState(() => {
    try {
      return sessionStorage.getItem(OPEN_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [greeting, setGreeting] = useState(WELCOME_FALLBACK);
  const [suggestions, setSuggestions] = useState([]);
  const [mode, setMode] = useState(null);
  const [week, setWeek] = useState(pregnancy?.current_week ?? null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [error, setError] = useState('');

  const bodyRef = useRef(null);
  const inputRef = useRef(null);
  const bubbleRef = useRef(null);
  const loadedRef = useRef(false);

  useEffect(() => {
    try {
      sessionStorage.setItem(OPEN_KEY, open ? '1' : '0');
    } catch {
      /* almacenamiento no disponible */
    }
  }, [open]);

  const load = useCallback(async () => {
    if (loadedRef.current) return;
    loadedRef.current = true;

    try {
      const [welcome, history] = await Promise.all([
        api.chat.welcome(),
        api.chat.history(12),
      ]);

      setGreeting(welcome.greeting ?? WELCOME_FALLBACK);
      setSuggestions(welcome.suggestions ?? []);
      setMode(welcome.ai?.mode ?? null);
      setWeek(welcome.week ?? pregnancy?.current_week ?? null);
      setMessages((history.messages ?? []).slice(-12));
    } catch {
      // El saludo local sigue sirviendo aunque el servidor no responda.
    }
  }, [pregnancy?.current_week]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  useEffect(() => {
    if (!open) return undefined;

    const id = setTimeout(() => inputRef.current?.focus(), 140);
    return () => clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const body = bodyRef.current;
    if (body) body.scrollTop = body.scrollHeight;
  }, [messages, sending, open]);

  useEffect(() => {
    if (!open) return undefined;

    function handleKey(event) {
      if (event.key !== 'Escape') return;
      setOpen(false);
      bubbleRef.current?.focus();
    }

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [open]);

  async function send(text) {
    const clean = text.trim();
    if (!clean || sending) return;

    setInput('');
    setError('');
    setSending(true);

    const tempId = `tmp-${Date.now()}`;
    setMessages((prev) => [...prev, { id: tempId, role: 'user', content: clean }]);

    try {
      const data = await api.chat.quick(clean);

      setMessages((prev) => [
        ...prev,
        {
          id: data.reply.id,
          role: 'assistant',
          content: data.reply.content,
          is_emergency: data.reply.is_emergency,
          is_redirect: data.reply.is_redirect,
        },
      ]);
    } catch (err) {
      setMessages((prev) => prev.filter((message) => message.id !== tempId));
      setError(err.message || 'No se pudo enviar la pregunta.');
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    send(input);
  }

  if (!isAuthenticated) return null;

  const status = mode === 'model' ? 'En línea' : mode === 'local' ? 'Modo local' : 'Asistente educativo';

  return (
    <>
      {open && (
        <section
          className="cw-panel"
          role="dialog"
          aria-label="Asistente BabyTrack IA"
        >
          <header className="cw-head">
            <BrandMark size={26} />

            <div className="cw-head-text">
              <h3>BabyTrack IA</h3>
              <p>
                {status}
                {week ? ` · Semana ${week}` : ''}
              </p>
            </div>

            <button
              type="button"
              className="cw-icon-btn"
              onClick={() => {
                setOpen(false);
                bubbleRef.current?.focus();
              }}
              aria-label="Cerrar el asistente"
            >
              <CloseIcon size={16} />
            </button>
          </header>

          <div className="cw-body" ref={bodyRef} aria-live="polite">
            <ChatMessage role="assistant" content={greeting} />

            {messages.length === 0 && (
              <ChatSuggestions
                suggestions={suggestions}
                onPick={send}
                disabled={sending}
              />
            )}

            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                role={message.role}
                content={message.content}
                isEmergency={message.is_emergency}
                isRedirect={message.is_redirect}
              />
            ))}

            {sending && <TypingDots />}
          </div>

          {error && (
            <p className="cw-error" role="alert">
              {error}
            </p>
          )}

          <form className="cw-form" onSubmit={handleSubmit}>
            <textarea
              ref={inputRef}
              className="cw-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  send(input);
                }
              }}
              placeholder="Escribe tu pregunta..."
              rows={1}
              maxLength={500}
              aria-label="Escribe tu pregunta sobre el embarazo"
            />

            <button
              type="submit"
              className="cw-send"
              disabled={!input.trim() || sending}
              aria-label="Enviar pregunta"
            >
              <SendIcon size={17} />
            </button>
          </form>

          <p className="cw-foot">No sustituye la consulta médica.</p>
        </section>
      )}

      <button
        ref={bubbleRef}
        type="button"
        className={`cw-bubble ${open ? 'is-open' : ''}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? 'Cerrar el asistente' : 'Abrir el asistente'}
      >
        {open ? <MinimizeIcon size={18} /> : <ChatBubbleIcon size={26} />}
        {!open && <span className="cw-bubble-dot" aria-hidden="true" />}
      </button>
    </>
  );
}
