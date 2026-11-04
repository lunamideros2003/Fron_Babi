import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../../api/client.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { ChatBubbleIcon, MinimizeIcon } from '../Icons.jsx';
import ChatHeader from './ChatHeader.jsx';
import ChatComposer from './ChatComposer.jsx';
import ChatMessage from './ChatMessage.jsx';
import ChatSuggestions from './ChatSuggestions.jsx';
import TypingDots from './TypingDots.jsx';

const OPEN_KEY = 'babytrack_chat_open';
const DRAFT_KEY = 'babytrack_chat_draft';
const SEEN_KEY = 'babytrack_chat_seen';

const WELCOME_FALLBACK =
  'Hola. Hazme preguntas sobre tu embarazo y resolvámoslas juntas.';

/** Saludo inmediato, sin esperar al servidor, para que la ventana abra calida. */
function localGreeting(name) {
  const firstName = String(name ?? '').trim().split(/\s+/)[0];

  return firstName
    ? `Hola, ${firstName}. Hazme preguntas sobre tu embarazo y resolvámoslas juntas.`
    : WELCOME_FALLBACK;
}

/**
 * Asistente flotante.
 *
 * La conversación se guarda en el servidor igual que la del chat completo,
 * pero aqui se piden respuestas cortas (`/chat/quick`) y solo se cargan los
 * ultimos mensajes. El saludo y las sugerencias los prepara el backend segun
 * la semana, asi que abrir la ventana no gasta tokens.
 */
export default function ChatWidget() {
  const { user, pregnancy, isAuthenticated } = useAuth();

  const [open, setOpen] = useState(() => {
    try {
      return sessionStorage.getItem(OPEN_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [seen, setSeen] = useState(() => {
    try {
      return sessionStorage.getItem(SEEN_KEY) === '1';
    } catch {
      return false;
    }
  });

  const [greeting, setGreeting] = useState(() => localGreeting(user?.name));
  const [suggestions, setSuggestions] = useState([]);
  const [mode, setMode] = useState(null);
  const [week, setWeek] = useState(pregnancy?.current_week ?? null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(() => {
    try {
      return sessionStorage.getItem(DRAFT_KEY) ?? '';
    } catch {
      return '';
    }
  });
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

  useEffect(() => {
    if (!open || seen) return;

    setSeen(true);
    try {
      sessionStorage.setItem(SEEN_KEY, '1');
    } catch {
      /* almacenamiento no disponible */
    }
  }, [open, seen]);

  // Lo que se estaba escribiendo no se pierde al cambiar de pantalla.
  useEffect(() => {
    try {
      if (input) sessionStorage.setItem(DRAFT_KEY, input);
      else sessionStorage.removeItem(DRAFT_KEY);
    } catch {
      /* almacenamiento no disponible */
    }
  }, [input]);

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
          category: data.reply.category,
          category_label: data.reply.category_label,
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
          <ChatHeader
            status={status}
            week={week}
            onOpenFull={() => setOpen(false)}
            onClose={() => {
              setOpen(false);
              bubbleRef.current?.focus();
            }}
          />

          <div
            className="cw-body"
            ref={bodyRef}
            aria-live="polite"
            aria-busy={sending}
            aria-label="Conversación con el asistente"
          >
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
                categoryLabel={message.category_label}
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

          <ChatComposer
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onSubmit={handleSubmit}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                send(input);
              }
            }}
            sending={sending}
            inputRef={inputRef}
          />

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
        {!open && !seen && <span className="cw-bubble-dot" aria-hidden="true" />}
      </button>
    </>
  );
}
