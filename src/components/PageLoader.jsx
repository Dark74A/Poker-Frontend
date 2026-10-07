import "../styles/PageLoader.css";

export function PageLoader({ label = "Loading\u2026" }) {
  return (
    <div className="page-loader">
      <span className="page-loader-spinner" aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}
