import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listSessions } from "../api/sessions";
import { Layout } from "../components/Layout";
import { SessionCard } from "../components/SessionCard";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { PageLoader } from "../components/PageLoader";
import { NewSessionModal } from "../components/NewSessionModal";
import { getErrorMessage } from "../api/client";
import "./Dashboard.css";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const {
    data: sessions,
    isLoading,
    isError,
    error,
  } = useQuery({ queryKey: ["sessions"], queryFn: listSessions });

  return (
    <Layout>
      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">Your table</span>
          <h1>Sessions</h1>
        </div>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          + New session
        </Button>
      </div>

      {isLoading ? <PageLoader label="Loading your sessions..." /> : null}
      {isError ? (
        <EmptyState
          title="Couldn't load sessions"
          description={getErrorMessage(error)}
        />
      ) : null}

      {sessions && sessions.length === 0 ? (
        <EmptyState
          title="No sessions yet"
          description="Start a session to track buy-ins, cash-outs, and who's up or down."
          action={
            <Button variant="secondary" onClick={() => setModalOpen(true)}>
              Start your first session
            </Button>
          }
        />
      ) : null}

      {sessions && sessions.length > 0 ? (
        <div className="dashboard-grid">
          {sessions.map((session) => (
            <SessionCard key={session.sessionId} session={session} />
          ))}
        </div>
      ) : null}

      <NewSessionModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </Layout>
  );
}
