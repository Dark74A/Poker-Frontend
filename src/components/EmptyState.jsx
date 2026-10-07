import "../styles//EmptyState.css";

export function EmptyState({ title, description, action }) {
  return (
    <div className="empty-state">
      <div className="empty-state-mark" aria-hidden="true">
        <svg width="34" height="34" viewBox="0 0 34 34" fill="none">
          <circle
            cx="17"
            cy="17"
            r="15.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="3 4"
          />
          <circle cx="17" cy="17" r="5" fill="currentColor" opacity="0.5" />
        </svg>
      </div>
      <h3>{title}</h3>
      {description ? <p>{description}</p> : null}
      {action ? <div className="empty-state-action">{action}</div> : null}
    </div>
  );
}
