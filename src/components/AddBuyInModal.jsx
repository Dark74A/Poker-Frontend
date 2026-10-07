import { useMemo, useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { FormError } from "./FormError";
import { formatSignedMoney } from "../utils/format";
import "../styles/RecordHandModal.css";

export function AddBuyInModal({
  open,
  onClose,
  players,
  onSubmit,
  isSubmitting,
  error,
}) {
  const [amounts, setAmounts] = useState({});

  const activePlayers = players.filter((p) => p.status !== "INACTIVE");

  const nonZeroCount = Object.values(amounts).filter(
    (v) => v !== "" && Number.isFinite(Number(v)) && Number(v) > 0,
  ).length;

  const canSubmit = nonZeroCount >= 1;

  function handleClose() {
    setAmounts({});
    onClose();
  }

  function updateAmount(playerId, value) {
    setAmounts((prev) => ({ ...prev, [playerId]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!canSubmit) return;

    const deltas = {};
    for (const [playerId, value] of Object.entries(amounts)) {
      const n = Number(value);
      if (Number.isFinite(n) && n > 0 && value !== "") deltas[playerId] = n;
    }
    onSubmit(deltas);
    setAmounts({});
  }

  return (
    <Modal open={open} onClose={handleClose} title="Add Buy-In" wide>
      <form onSubmit={handleSubmit} noValidate>
        <FormError>{error}</FormError>

        <div className="hand-modal-grid">
          {activePlayers.map((p) => (
            <div key={p.playerId} className="hand-modal-row">
              <span className="hand-modal-name">{p.displayName}</span>
              <input
                type="number"
                inputMode="decimal"
                step="1"
                placeholder="0"
                className="hand-modal-input"
                value={amounts[p.playerId] ?? ""}
                min="0"
                onChange={(e) => updateAmount(p.playerId, e.target.value)}
              />
            </div>
          ))}
        </div>

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={!canSubmit}
          style={{ width: "100%", marginTop: 12 }}
        >
          Confirm
        </Button>
      </form>
    </Modal>
  );
}
