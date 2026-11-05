export default function ChatSuggestions({ suggestions = [], onPick, disabled = false }) {
  if (suggestions.length === 0) return null;

  return (
    <div className="cw-suggestions" aria-label="Preguntas sugeridas">
      {suggestions.map((text) => (
        <button
          key={text}
          type="button"
          className="cw-chip"
          onClick={() => onPick(text)}
          disabled={disabled}
        >
          {text}
        </button>
      ))}
    </div>
  );
}
