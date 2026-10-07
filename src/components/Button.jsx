import "../styles/Button.css";

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  children,
  ...rest
}) {
  return (
    <button
      className={`btn btn-${variant} btn-${size}`}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    >
      {loading ? <span className="btn-spinner" aria-hidden="true" /> : null}
      <span className={loading ? "btn-label-loading" : undefined}>
        {children}
      </span>
    </button>
  );
}
