import { SendIcon } from '../Icons.jsx';

export default function ChatComposer({
  value,
  onChange,
  onSubmit,
  onKeyDown,
  sending,
  inputRef,
  maxLength = 500,
}) {
  return (
    <form className="cw-form" onSubmit={onSubmit}>
      <textarea
        ref={inputRef}
        className="cw-input"
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        placeholder="Escribe tu pregunta..."
        rows={1}
        maxLength={maxLength}
        aria-label="Escribe tu pregunta sobre el embarazo"
      />

      <button
        type="submit"
        className="cw-send"
        disabled={!value.trim() || sending}
        aria-label="Enviar pregunta"
      >
        <SendIcon size={17} />
      </button>
    </form>
  );
}
