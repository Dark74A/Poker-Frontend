import "../styles/StatusPill.css";

const LABELS = {
  ACTIVE: "Active",
  CLOSED: "Closed",
  ARCHIVED: "Archived",
  INACTIVE: "Removed",
  CREATED: "Active",
};

export function StatusPill({ status }) {
  const tone =
    status === "ACTIVE"
      ? "active"
      : status === "CLOSED"
        ? "closed"
        : status === "ARCHIVED"
          ? "archived"
          : "inactive";
  return (
    <span className={`status-pill status-pill--${tone}`}>
      {LABELS[status] || status}
    </span>
  );
}
