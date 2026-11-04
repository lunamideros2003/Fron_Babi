import { SparkleIcon } from '../Icons.jsx';

/**
 * Una burbuja de la conversación. Sirve tanto para la usuaria como para el
 * asistente, y marca los dos casos especiales: urgencia y derivación médica.
 */
export default function ChatMessage({ role, content, isEmergency = false, isRedirect = false }) {
  const isUser = role === 'user';

  const classes = [
    'cw-msg',
    isUser ? 'is-user' : 'is-bot',
    isEmergency ? 'is-emergency' : '',
    isRedirect ? 'is-redirect' : '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <span className="cw-msg-avatar" aria-hidden="true">
        {isUser ? 'Tú' : <SparkleIcon size={12} />}
      </span>

      <div className="cw-msg-body">
        <div className="cw-msg-bubble">{content}</div>

        {(isEmergency || isRedirect) && (
          <span className="cw-msg-flag">{isEmergency ? 'Urgente' : 'Orientación'}</span>
        )}
      </div>
    </div>
  );
}
