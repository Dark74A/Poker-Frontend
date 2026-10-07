import { Link } from "react-router-dom";
import { StatusPill } from "./StatusPill";
import { formatDate } from "../utils/format";
import "../styles/SessionCard.css";

export function SessionCard({ session }) {
  return (
    <Link to={`/sessions/${session.sessionId}`} className="session-card">
      <div className="session-card-top">
        <h3>{session.name}</h3>
        <StatusPill status={session.status} />
      </div>
      <p className="session-card-date">{formatDate(session.createdAt)}</p>
    </Link>
  );
}
