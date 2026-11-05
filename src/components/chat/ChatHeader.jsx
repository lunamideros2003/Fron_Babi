import { Link } from 'react-router-dom';
import { BrandMark, ChevronRightIcon, CloseIcon } from '../Icons.jsx';

export default function ChatHeader({ status, week, onClose, onOpenFull }) {
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

      <Link
        to="/asistente"
        className="cw-icon-btn"
        onClick={onOpenFull}
        aria-label="Abrir el chat completo"
        title="Ver el chat completo"
      >
        <ChevronRightIcon size={16} />
      </Link>

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
