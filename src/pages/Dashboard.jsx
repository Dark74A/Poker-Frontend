import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { listSessions } from "../api/sessions";
import { Layout } from "../components/Layout";
import { SessionCard } from "../components/SessionCard";
import { Button } from "../components/Button";
import { EmptyState } from "../components/EmptyState";
import { PageLoader } from "../components/PageLoader";
import { NewSessionModal } from "../components/NewSessionModal";
import { getErrorMessage } from "../api/client";
import { useAuth } from "../context/AuthContext";
import { JoinSessionModal } from "../components/JoinSessionModal";
import "./Dashboard.css";

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [joinModalOpen, setJoinModalOpen] = useState(false);
  const [sessionFilter, setSessionFilter] = useState("all");
  const [sessionSort, setSessionSort] = useState("newest");
  const [pageSize, setPageSize] = useState(12);
  const [page, setPage] = useState(0);
  const { user } = useAuth();
  const {
    data: sessionPage,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["sessions", { page, pageSize, sessionFilter, sessionSort }],
    queryFn: () => listSessions({ page, size: pageSize, filter: sessionFilter, sort: sessionSort }),
  });
  const sessions = sessionPage?.content ?? [];
  const totalElements = sessionPage?.totalElements ?? 0;
  const totalPages = sessionPage?.totalPages ?? 0;
  const firstItem = totalElements === 0 ? 0 : page * pageSize + 1;
  const lastItem = Math.min((page + 1) * pageSize, totalElements);

  useEffect(() => {
    if (sessionPage && page > 0 && (totalPages === 0 || page >= totalPages)) {
      setPage(Math.max(totalPages - 1, 0));
    }
  }, [page, sessionPage, totalPages]);

  function changeFilter(filter) {
    setSessionFilter(filter);
    setPage(0);
  }

  function changeSort(sort) {
    setSessionSort(sort);
    setPage(0);
  }

  function changePageSize(size) {
    setPageSize(Number(size));
    setPage(0);
  }

  return (
    <Layout>
      <div className="dashboard-header">
        <div>
          <span className="dashboard-eyebrow">Your table</span>
          <h1>Sessions</h1>
        </div>
        <div className="dashboard-header-actions">
          <Button variant="secondary" onClick={() => setJoinModalOpen(true)}>
            Join session
          </Button>
          <Button variant="primary" onClick={() => setModalOpen(true)}>
            + New session
          </Button>
        </div>
      </div>

      {isLoading ? <PageLoader label="Loading your sessions..." /> : null}
      {isError ? (
        <EmptyState
          title="Couldn't load sessions"
          description={getErrorMessage(error)}
        />
      ) : null}

      {!isLoading && !isError && totalElements === 0 ? (
        <EmptyState
          title={sessionFilter === "all" ? "No sessions yet" : "No matching sessions"}
          description={sessionFilter === "all"
            ? "Start a session to track buy-ins, cash-outs, and who's up or down."
            : "Try another filter to see your sessions."}
          action={
            sessionFilter === "all" ? (
              <Button variant="secondary" onClick={() => setModalOpen(true)}>
                Start your first session
              </Button>
            ) : (
              <Button variant="secondary" onClick={() => changeFilter("all")}>
                Show all sessions
              </Button>
            )
          }
        />
      ) : null}

      {!isLoading && !isError && totalElements > 0 ? (
        <>
          <div className="dashboard-filters" role="group" aria-label="Filter sessions">
            <span>Show</span>
            <Button size="sm" variant={sessionFilter === "all" ? "secondary" : "ghost"} onClick={() => changeFilter("all")}>All</Button>
            <Button size="sm" variant={sessionFilter === "hosted" ? "secondary" : "ghost"} onClick={() => changeFilter("hosted")}>Hosted by me</Button>
            <Button size="sm" variant={sessionFilter === "player" ? "secondary" : "ghost"} onClick={() => changeFilter("player")}>Player only</Button>
            <label className="dashboard-select-label">
              Sort
              <select value={sessionSort} onChange={(event) => changeSort(event.target.value)}>
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="name-asc">Name A–Z</option>
                <option value="name-desc">Name Z–A</option>
                <option value="active">Active sessions first</option>
              </select>
            </label>
            <label className="dashboard-select-label">
              Per page
              <select value={pageSize} onChange={(event) => changePageSize(event.target.value)}>
                <option value={12}>12</option>
                <option value={24}>24</option>
                <option value={48}>48</option>
              </select>
            </label>
          </div>
          <div className="dashboard-grid">
            {sessions.map((session) => (
              <SessionCard key={session.sessionId} session={session} isHost={session.hostId === user?.userId} />
            ))}
          </div>
          <div className="dashboard-pagination" aria-label="Session pages">
            <span>Showing {firstItem}–{lastItem} of {totalElements} sessions</span>
            <div>
              <Button size="sm" variant="secondary" disabled={page <= 0 || isLoading} onClick={() => setPage((current) => current - 1)}>
                Previous
              </Button>
              <span>Page {page + 1} of {Math.max(totalPages, 1)}</span>
              <Button size="sm" variant="secondary" disabled={page + 1 >= totalPages || isLoading} onClick={() => setPage((current) => current + 1)}>
                Next
              </Button>
            </div>
          </div>
        </>
      ) : null}

      <NewSessionModal open={modalOpen} onClose={() => setModalOpen(false)} />
      <JoinSessionModal open={joinModalOpen} onClose={() => setJoinModalOpen(false)} />
    </Layout>
  );
}
