import { Link } from "react-router-dom";
import { StatusPill } from "./StatusPill";
import { formatDateTime } from "../utils/format";
import "../styles/SessionCard.css";

export function SessionCard({ session, isHost }) {
  return (
    <Link to={`/sessions/${session.sessionId}`} className="session-card">
      <div className="session-card-top">
        <h3>{session.name}</h3>
        <StatusPill status={session.currentUserStatus || session.status} />
      </div>
      <p className="session-card-host">
        <span>Hosted by:</span> <strong>{isHost ? "YOU" : session.hostName || "Unknown"}</strong>
      </p>
      <div className="session-card-meta">
        <time className="session-card-date" dateTime={session.createdAt}>
          {formatDateTime(session.createdAt)}
        </time>
        <span className="session-card-player-count">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M16 11a4 4 0 1 0-3.9-4.9A5 5 0 0 1 16 11ZM8 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm0 2c-3.3 0-6 1.7-6 3.8V20h12v-2.2C14 15.7 11.3 14 8 14Zm8 0c-.5 0-1 .03-1.5.1 1.5.9 2.5 2.1 2.5 3.7V20h5v-2.2c0-2.1-2.7-3.8-6-3.8Z" />
          </svg>
          Players: <strong>{session.playerCount}</strong>
        </span>
      </div>
    </Link>
  );
}
