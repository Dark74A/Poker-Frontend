import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Layout } from "../components/Layout";
import { StatusPill } from "../components/StatusPill";
import { Button } from "../components/Button";
import { PageLoader } from "../components/PageLoader";
import { EmptyState } from "../components/EmptyState";
import { LedgerTicker } from "../components/LedgerTicker";
import { SummaryStats } from "../components/SummaryStats";
import { PlayerTable } from "../components/PlayerTable";
import { AddPlayerModal } from "../components/AddPlayerModal";
import { AmountModal } from "../components/AmountModal";
import { RecordHandModal } from "../components/RecordHandModal";
import { ConfirmDialog } from "../components/ConfirmDialog";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { getErrorMessage } from "../api/client";
import {
  getSession,
  getSessionAsOf,
  getSessionEvents,
  addPlayer,
  removePlayer,
  addCashOut,
  recordHand,
  closeSession,
  archiveSession,
  reopenSession,
  recordBuyIn,
} from "../api/sessions";
import "./SessionDetail.css";
import { useEffect, useState } from "react";
import { AddBuyInModal } from "../components/AddBuyInModal";
import { connectToSessionUpdates } from "../api/liveUpdates";

export default function SessionDetail() {
  const { sessionId } = useParams();
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [addPlayerOpen, setAddPlayerOpen] = useState(false);
  const [amountModal, setAmountModal] = useState(null);
  const [handModalOpen, setHandModalOpen] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [lifecycleError, setLifecycleError] = useState("");
  const [buyInModalOpen, setBuyInModalOpen] = useState(false);
  const [liveConnection, setLiveConnection] = useState("connecting");

  const {
    data: session,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryKey: ["session", sessionId],
    queryFn: () => getSession(sessionId),
    enabled: Boolean(sessionId),
  });

  const {
    data: events = [],
    isLoading: eventsLoading,
    isError: eventsError,
  } = useQuery({
    queryKey: ["session", sessionId, "events"],
    queryFn: () => getSessionEvents(sessionId),
    enabled: Boolean(sessionId),
  });

  const [selectedEventIndex, setSelectedEventIndex] = useState(0);
  const [isHistoricalView, setIsHistoricalView] = useState(false);

  useEffect(() => {
    if (events.length === 0) {
      setSelectedEventIndex(0);
      setIsHistoricalView(false);
      return;
    }

    setSelectedEventIndex((previousIndex) => {
      const lastIndex = events.length - 1;

      return Math.min(previousIndex, lastIndex);
    });
  }, [events]);

  useEffect(() => {
    if (!sessionId || !session) return undefined;
    return connectToSessionUpdates(
      sessionId,
      () => {
        queryClient.invalidateQueries({ queryKey: ["session", sessionId] });
        queryClient.invalidateQueries({
          queryKey: ["session", sessionId, "events"],
        });
        queryClient.invalidateQueries({ queryKey: ["sessions"] });
        queryClient.invalidateQueries({ queryKey: ["history", sessionId] });
      },
      setLiveConnection,
    );
  }, [queryClient, sessionId, session]);

  const selectEvent = (index) => {
    if (events.length === 0) {
      return;
    }

    const safeIndex = Math.max(0, Math.min(index, events.length - 1));

    setSelectedEventIndex(safeIndex);

    setIsHistoricalView(safeIndex !== events.length - 1);
  };

  const backToLive = () => {
    if (events.length === 0) {
      setSelectedEventIndex(0);
      setIsHistoricalView(false);
      return;
    }

    setSelectedEventIndex(events.length - 1);
    setIsHistoricalView(false);
  };

  const currentEvent =
    events.length > 0 ? events[selectedEventIndex] : undefined;

  const {
    data: currentSnapshot,
    isLoading: snapshotLoading,
    isError: snapshotError,
    error: snapshotQueryError,
  } = useQuery({
    queryKey: ["session", sessionId, "asOf", currentEvent?.timestamp],

    queryFn: () => getSessionAsOf(sessionId, currentEvent.timestamp),

    enabled:
      Boolean(sessionId) &&
      isHistoricalView &&
      Boolean(currentEvent?.timestamp),

    staleTime: Infinity,
  });

  const displayedSession = isHistoricalView
    ? (currentSnapshot ?? session)
    : session;

  const isLoading = sessionLoading || eventsLoading;

  const isError = sessionError || eventsError;

  function invalidate() {
    queryClient.invalidateQueries({
      queryKey: ["session", sessionId],
    });

    queryClient.invalidateQueries({
      queryKey: ["session", sessionId, "events"],
    });

    queryClient.invalidateQueries({
      queryKey: ["sessions"],
    });

    queryClient.invalidateQueries({
      queryKey: ["history", sessionId],
    });
  }

  const addPlayerMutation = useMutation({
    mutationFn: (player) => addPlayer(sessionId, player),
    onSuccess: () => {
      invalidate();
      setAddPlayerOpen(false);
      toast.success("Player added.");
    },
  });

  const removePlayerMutation = useMutation({
    mutationFn: (playerId) => removePlayer(sessionId, playerId),
    onSuccess: () => {
      invalidate();
      setRemoveTarget(null);
      toast.success("Player removed.");
    },
  });

  const cashOutMutation = useMutation({
    mutationFn: ({ playerId, amount }) =>
      addCashOut(sessionId, { playerId, amount }),
    onSuccess: () => {
      invalidate();
      setAmountModal(null);
      toast.success("Cash-out recorded.");
    },
  });

  const recordHandMutation = useMutation({
    mutationFn: (deltas) => recordHand(sessionId, deltas),
    onSuccess: () => {
      invalidate();
      setHandModalOpen(false);
      toast.success("Hand recorded.");
    },
  });

  const recordBuyInMutation = useMutation({
    mutationFn: (deltas) => recordBuyIn(sessionId, deltas),
    onSuccess: () => {
      invalidate();
      setBuyInModalOpen(false);
      toast.success("Buy-in added.");
    },
  });

  const lifecycleMutation = useMutation({
    mutationFn: (action) => {
      if (action === "close") return closeSession(sessionId);
      if (action === "archive") return archiveSession(sessionId);
      return reopenSession(sessionId);
    },
    onSuccess: () => {
      invalidate();
      setLifecycleError("");
    },
    onError: (err) => setLifecycleError(getErrorMessage(err)),
  });

  if (isLoading)
    return (
      <Layout>
        <PageLoader label="Loading session" />
      </Layout>
    );

  if (isError || !session || (isHistoricalView && snapshotError)) {
    return (
      <Layout>
        <EmptyState
          title={
            isHistoricalView
              ? "No session existed at that time"
              : "Couldn't load this session"
          }
          description={getErrorMessage(
            snapshotQueryError ||
              (sessionError
                ? new Error("Couldn't load this session.")
                : eventsError
                  ? new Error("Couldn't load session events.")
                  : new Error("No session was found.")),
          )}
          action={
            isHistoricalView ? (
              <Button variant="secondary" onClick={backToLive}>
                Back to live view
              </Button>
            ) : null
          }
        />
      </Layout>
    );
  }

  const isHost = user?.userId === session.hostId;
  const isActive = session.status === "ACTIVE";
  const canManage = isHost && !isHistoricalView;
  const currentAmountMutation = cashOutMutation;

  return (
    <Layout>
      <div className="session-detail-header">
        <div>
          <Link to="/" className="session-detail-back">
            &larr; All sessions
          </Link>
          <div className="session-detail-title-row">
            <h1>{displayedSession.sessionName}</h1>
            <StatusPill status={displayedSession.status} />
            <span
              className={`live-connection live-connection--${liveConnection}`}
              aria-live="polite"
            >
              {liveConnection === "connected" ? "Live" : "Reconnecting…"}
            </span>
          </div>
        </div>

        {canManage ? (
          <div className="session-detail-lifecycle">
            {displayedSession.status === "ACTIVE" ? (
              <>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => lifecycleMutation.mutate("archive")}
                  loading={lifecycleMutation.isPending}
                >
                  Archive
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => lifecycleMutation.mutate("close")}
                  loading={lifecycleMutation.isPending}
                >
                  Close session
                </Button>
              </>
            ) : displayedSession.status === "CLOSED" ||
              displayedSession.status === "ARCHIVED" ? (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => lifecycleMutation.mutate("reopen")}
                loading={lifecycleMutation.isPending}
              >
                Reopen
              </Button>
            ) : null}
          </div>
        ) : null}
      </div>

      {lifecycleError ? (
        <div className="session-detail-lifecycle-error" role="alert">
          {lifecycleError}
        </div>
      ) : null}

      <div className="asof-bar">
        {eventsLoading ? (
          <div className="asof-loading">Loading session timeline...</div>
        ) : events.length === 0 ? (
          <div className="asof-empty">
            No events available for this session.
          </div>
        ) : (
          <div className="asof-timeline">
            <div className="asof-header">
              <div>
                <span className="asof-title">Session Replay</span>
                <span className="asof-subtitle">
                  {isHistoricalView
                    ? `Viewing event ${selectedEventIndex + 1} of ${events.length}`
                    : `${events.length} recorded events`}
                </span>
              </div>

              {isHistoricalView && (
                <Button size="sm" variant="secondary" onClick={backToLive}>
                  Back to live
                </Button>
              )}
            </div>

            <div className="asof-event-info">
              {currentEvent && (
                <>
                  <strong>
                    {currentEvent.description || currentEvent.eventType}
                  </strong>
                  <span>
                    {new Date(currentEvent.timestamp).toLocaleString()}
                  </span>
                </>
              )}
            </div>

            <div className="asof-slider-container">
              <input
                type="range"
                className="asof-slider"
                min={0}
                max={events.length - 1}
                step={1}
                value={selectedEventIndex}
                onChange={(e) => selectEvent(Number(e.target.value))}
                aria-label="Replay session events"
              />

              <div className="asof-markers">
                {events.map((event, index) => (
                  <button
                    key={event.eventId}
                    type="button"
                    className={`asof-marker ${
                      index === selectedEventIndex ? "selected" : ""
                    } ${index < selectedEventIndex ? "visited" : ""}`}
                    style={{
                      left:
                        events.length === 1
                          ? "0%"
                          : `${(index / (events.length - 1)) * 100}%`,
                    }}
                    title={`${event.eventType} — ${new Date(
                      event.timestamp,
                    ).toLocaleString()}`}
                    aria-label={`Event ${index + 1}: ${event.description || event.eventType}`}
                    aria-pressed={index === selectedEventIndex}
                    onClick={() => selectEvent(index)}
                  />
                ))}
              </div>
            </div>

            <div className="asof-controls">
              <Button
                size="sm"
                variant="ghost"
                disabled={selectedEventIndex <= 0}
                onClick={() => selectEvent(selectedEventIndex - 1)}
              >
                Previous
              </Button>

              <span className="asof-position">
                {selectedEventIndex + 1} / {events.length}
              </span>

              <Button
                size="sm"
                variant="ghost"
                disabled={selectedEventIndex >= events.length - 1}
                onClick={() => selectEvent(selectedEventIndex + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </div>

      {isHistoricalView && snapshotLoading ? (
        <PageLoader label="Loading historical snapshot" />
      ) : null}
      {!isHistoricalView || !snapshotLoading ? (
        <LedgerTicker players={displayedSession.players} />
      ) : null}
      <SummaryStats
        totalBuyIns={displayedSession.totalBuyIns}
        totalCashOuts={displayedSession.totalCashOuts}
      />

      <div className="session-detail-section-head">
        <h2>Players</h2>
        <div className="session-detail-section-actions">
          <Link
            to={`/sessions/${sessionId}/history`}
            className="session-detail-history-link"
          >
            History
          </Link>
          {canManage && isActive ? (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setBuyInModalOpen(true)}
              >
                Add Buy-In
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => setHandModalOpen(true)}
              >
                Record hand
              </Button>
              <Button size="sm" onClick={() => setAddPlayerOpen(true)}>
                + Add player
              </Button>
            </>
          ) : null}
        </div>
      </div>

      {displayedSession.players.length === 0 ? (
        <EmptyState
          title="No players yet"
          description="Add everyone at the table to start tracking buy-ins."
          action={
            canManage ? (
              <Button
                variant="secondary"
                onClick={() => setAddPlayerOpen(true)}
              >
                Add the first player
              </Button>
            ) : null
          }
        />
      ) : (
        <PlayerTable
          players={displayedSession.players}
          canManage={canManage}
          sessionOpen={isActive}
          onCashOut={(p) => setAmountModal({ kind: "cashout", player: p })}
          onRemove={(p) => setRemoveTarget(p)}
        />
      )}

      <AddPlayerModal
        sessionId={sessionId}
        open={addPlayerOpen}
        onClose={() => setAddPlayerOpen(false)}
        onSubmit={(name) => addPlayerMutation.mutate(name)}
        isSubmitting={addPlayerMutation.isPending}
        error={
          addPlayerMutation.isError
            ? getErrorMessage(addPlayerMutation.error)
            : ""
        }
      />

      <AmountModal
        open={Boolean(amountModal)}
        kind={amountModal?.kind}
        playerName={amountModal?.player?.displayName}
        onClose={() => setAmountModal(null)}
        onSubmit={(amount) =>
          currentAmountMutation.mutate({
            playerId: amountModal.player.playerId,
            amount,
          })
        }
        isSubmitting={currentAmountMutation.isPending}
        error={
          currentAmountMutation.isError
            ? getErrorMessage(currentAmountMutation.error)
            : ""
        }
      />

      <AddBuyInModal
        open={buyInModalOpen}
        onClose={() => setBuyInModalOpen(false)}
        players={session.players}
        onSubmit={(deltas) => recordBuyInMutation.mutate(deltas)}
        isSubmitting={recordBuyInMutation.isPending}
        error={
          recordBuyInMutation.isError
            ? getErrorMessage(recordBuyInMutation.error)
            : ""
        }
      />

      <RecordHandModal
        open={handModalOpen}
        onClose={() => setHandModalOpen(false)}
        players={session.players}
        onSubmit={(deltas) => recordHandMutation.mutate(deltas)}
        isSubmitting={recordHandMutation.isPending}
        error={
          recordHandMutation.isError
            ? getErrorMessage(recordHandMutation.error)
            : ""
        }
      />

      <ConfirmDialog
        open={Boolean(removeTarget)}
        onClose={() => {
          removePlayerMutation.reset();
          setRemoveTarget(null);
        }}
        title="Remove player"
        description={`Remove ${removeTarget?.displayName} from this session? Their buy-in and cash-out history stays on the record.`}
        confirmLabel="Remove"
        onConfirm={() => removePlayerMutation.mutate(removeTarget.playerId)}
        isSubmitting={removePlayerMutation.isPending}
        error={
          removePlayerMutation.isError
            ? getErrorMessage(removePlayerMutation.error)
            : ""
        }
      />
    </Layout>
  );
}
