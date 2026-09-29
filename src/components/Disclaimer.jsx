import { InfoIcon } from './Icons.jsx';

export default function Disclaimer({ text }) {
  const message =
    text ??
    'BabyTrack IA es un asistente educativo. No realiza diagnosticos ni reemplaza la consulta con tu obstetra o profesional de salud.';

  return (
    <div className="disclaimer" role="note">
      <InfoIcon size={15} />
      <span>{message}</span>
    </div>
  );
}
