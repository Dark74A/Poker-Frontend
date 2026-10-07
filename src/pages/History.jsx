import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "../components/Layout";
import { PageLoader } from "../components/PageLoader";
import { EmptyState } from "../components/EmptyState";
import { getSessionEvents, getSession } from "../api/sessions";
import { formatDateTime } from "../utils/format";
import { getErrorMessage } from "../api/client";
import "./History.css";

const EVENT_MARKS = {
  SessionCreated: "\u25CB",
  PlayerAdded: "+",
  PlayerRemoved: "\u2212",
  BuyInAdded: "\u2191",
  CashOutAdded: "\u2193",
  HandPlayed: "\u2660",
  SessionClosed: "\u25A0",
  SessionArchived: "\u25A1",
  SessionReopened: "\u21BB",
};

export default function History() {
  const { sessionId } = useParams();

  const { data: session } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => getSession(sessionId),
  });
  const {
    data: entries,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["history", sessionId],
    queryFn: () => getSessionEvents(sessionId),
  });

  return (
    <Layout>
      <Link to={`/sessions/${sessionId}`} className="history-back">
        &larr; {session ? session.sessionName : "Session"}
      </Link>
      <h1 className="history-title">History</h1>
      <p className="history-subtitle">
        Every action, in order, permanently on the record.
      </p>

      {isLoading ? <PageLoader label="Loading history\u2026" /> : null}
      {isError ? (
        <EmptyState
          title="Couldn't load history"
          description={getErrorMessage(error)}
        />
      ) : null}
      {entries && entries.length === 0 ? (
        <EmptyState
          title="Nothing recorded yet"
          description="Actions taken in this session will show up here."
        />
      ) : null}

      {entries && entries.length > 0 ? (
        <ol className="history-feed">
          {entries.map((entry, i) => (
            <li key={i} className="history-entry">
              <span className="history-entry-mark" aria-hidden="true">
                {EVENT_MARKS[entry.eventType] ?? "\u2022"}
              </span>
              <div className="history-entry-body">
                <p className="history-entry-description">{entry.description}</p>
                <span className="history-entry-time mono">
                  {formatDateTime(entry.timestamp)}
                </span>
              </div>
            </li>
          ))}
        </ol>
      ) : null}
    </Layout>
  );
}
