import { SparkleIcon } from '../Icons.jsx';

export default function ChatMessage({
  role,
  content,
  categoryLabel,
  isEmergency = false,
  isRedirect = false,
}) {
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

        {!isUser && categoryLabel && (
          <span className="cw-msg-tag">{categoryLabel}</span>
        )}

        {(isEmergency || isRedirect) && (
          <span className="cw-msg-flag">{isEmergency ? 'Urgente' : 'Orientación'}</span>
        )}
      </div>
    </div>
  );
}
