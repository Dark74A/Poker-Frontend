import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { findPlayerCandidates } from "../api/sessions";
import { Modal } from "./Modal";
import { Field, TextInput } from "./Field";
import { Button } from "./Button";
import { FormError } from "./FormError";
import "../styles/AddPlayerModal.css";

export function AddPlayerModal({
  open,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  sessionId,
}) {
  const [mode, setMode] = useState("guest");
  const [displayName, setDisplayName] = useState("");
  const [search, setSearch] = useState("");
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [localError, setLocalError] = useState("");
  const { data: candidates = [], isFetching } = useQuery({
    queryKey: ["player-candidates", sessionId, search],
    queryFn: () => findPlayerCandidates(sessionId, search),
    enabled: mode === "existing" && search.trim().length > 0,
  });

  useEffect(() => {
    if (open) return;
    setMode("guest");
    setDisplayName("");
    setSearch("");
    setSelectedPlayer(null);
  }, [open]);

  function handleClose() {
    setDisplayName("");
    setSearch("");
    setSelectedPlayer(null);
    setMode("guest");
    setLocalError("");
    onClose();
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (mode === "guest" && !displayName.trim()) {
      setLocalError("Enter a name for the guest player.");
      return;
    }
    if (mode === "existing" && !selectedPlayer) {
      setLocalError("Choose an existing player from the results.");
      return;
    }
    setLocalError("");
    onSubmit(mode === "guest"
      ? { displayName: displayName.trim() }
      : { linkedUserId: selectedPlayer.userId, displayName: selectedPlayer.username });
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add player">
      <form onSubmit={handleSubmit} noValidate>
        <FormError>{localError || error}</FormError>
        <div className="add-player-mode">
          <Button type="button" variant={mode === "guest" ? "secondary" : "ghost"} onClick={() => { setMode("guest"); setLocalError(""); }}>Guest player</Button>
          <Button type="button" variant={mode === "existing" ? "secondary" : "ghost"} onClick={() => { setMode("existing"); setLocalError(""); }}>Existing player</Button>
        </div>
        {mode === "guest" ? (
          <Field label="Guest name" hint="Guest details stay limited to this session.">
            <TextInput type="text" placeholder="Raj" autoFocus value={displayName} onChange={(e) => setDisplayName(e.target.value)} />
          </Field>
        ) : (
          <Field label="Search username" hint="Choose an account to retain its session history if re-added.">
            <TextInput type="search" placeholder="Start typing a username" value={search} onChange={(e) => { setSearch(e.target.value); setSelectedPlayer(null); }} />
            {isFetching ? <span>Searching…</span> : null}
            <div className="player-candidate-list">
              {candidates.map((candidate) => (
                <button key={candidate.userId} type="button" className={selectedPlayer?.userId === candidate.userId ? "selected" : ""} onClick={() => setSelectedPlayer(candidate)}>
                  {candidate.username}
                </button>
              ))}
              {search.trim() && !isFetching && candidates.length === 0 ? <span>No matching accounts.</span> : null}
            </div>
          </Field>
        )}
        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          style={{ width: "100%" }}
        >
          Add {mode === "guest" ? "guest" : "player"} to session
        </Button>
      </form>
    </Modal>
  );
}
