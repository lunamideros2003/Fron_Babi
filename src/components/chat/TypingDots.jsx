import { SparkleIcon } from '../Icons.jsx';

/** Tres puntos mientras el modelo piensa. */
export default function TypingDots() {
  return (
    <div className="cw-msg is-bot">
      <span className="cw-msg-avatar" aria-hidden="true">
        <SparkleIcon size={12} />
      </span>

      <div className="cw-msg-bubble cw-typing" role="status" aria-label="Escribiendo la respuesta">
        <span />
        <span />
        <span />
      </div>
    </div>
  );
}
