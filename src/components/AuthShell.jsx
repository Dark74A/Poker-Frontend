import "../styles/AuthShell.css";

export function AuthShell({ eyebrow, title, subtitle, children, footer }) {
  return (
    <div className="auth-shell">
      <div className="auth-visual" aria-hidden="true">
        <div className="auth-visual-inner">
          <FeltMark />
          <div className="auth-visual-copy">
            <p className="auth-visual-eyebrow">Home game, done properly</p>
            <h2>
              Every buy-in.
              <br />
              Every cash-out.
              <br />
              Settled without an argument.
            </h2>
          </div>
        </div>
      </div>
      <div className="auth-panel">
        <div className="auth-panel-inner">
          <span className="auth-eyebrow">{eyebrow}</span>
          <h1>{title}</h1>
          {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}
          <div className="auth-form">{children}</div>
          {footer ? <div className="auth-footer">{footer}</div> : null}
        </div>
      </div>
    </div>
  );
}

function FeltMark() {
  return (
    <svg
      width="220"
      height="220"
      viewBox="0 0 220 220"
      fill="none"
      className="felt-mark"
    >
      <circle
        cx="110"
        cy="110"
        r="90"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.4"
      />
      <circle
        cx="110"
        cy="110"
        r="65"
        stroke="currentColor"
        strokeWidth="1"
        opacity="0.55"
      />
      <circle
        cx="110"
        cy="110"
        r="40"
        stroke="currentColor"
        strokeWidth="1.4"
        opacity="0.8"
      />
      <circle cx="110" cy="110" r="6" fill="currentColor" />
    </svg>
  );
}
