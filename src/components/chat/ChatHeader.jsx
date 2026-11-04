import { BrandMark, CloseIcon } from '../Icons.jsx';

/** Cabecera de la ventana: marca, estado del modelo y botón de cerrar. */
export default function ChatHeader({ status, week, onClose }) {
  return (
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
        onClick={onClose}
        aria-label="Cerrar el asistente"
      >
        <CloseIcon size={16} />
      </button>
    </header>
  );
}
