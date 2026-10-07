import { useMemo, useState } from "react";
import { Modal } from "./Modal";
import { Button } from "./Button";
import { FormError } from "./FormError";
import { formatSignedMoney } from "../utils/format";
import "../styles/RecordHandModal.css";

export function RecordHandModal({
  open,
  onClose,
  players,
  onSubmit,
  isSubmitting,
  error,
}) {
  const [amounts, setAmounts] = useState({});

  const activePlayers = players.filter((p) => p.status !== "INACTIVE");

  const sum = useMemo(() => {
    return Object.values(amounts).reduce((total, v) => {
      const n = Number(v);
      return total + (Number.isFinite(n) ? n : 0);
    }, 0);
  }, [amounts]);

  const nonZeroCount = Object.values(amounts).filter(
    (v) => Number(v) !== 0 && v !== "",
  ).length;
  const isBalanced = Math.abs(sum) < 0.005;
  const canSubmit = isBalanced && nonZeroCount >= 2;

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
      if (n !== 0 && value !== "") deltas[playerId] = n;
    }
    onSubmit(deltas);
  }

  return (
    <Modal open={open} onClose={handleClose} title="Record a hand" wide>
      <form onSubmit={handleSubmit} noValidate>
        <FormError>{error}</FormError>

        <p className="hand-modal-hint">
          Enter what each player won or lost this hand. Leave a field blank for
          anyone not involved. The total must balance to zero.
        </p>

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
                onChange={(e) => updateAmount(p.playerId, e.target.value)}
              />
            </div>
          ))}
        </div>

        <div
          className={`hand-modal-total ${isBalanced ? "is-balanced" : "is-unbalanced"}`}
        >
          <span>Total</span>
          <span className="mono">{formatSignedMoney(sum)}</span>
        </div>

        {!isBalanced ? (
          <p className="hand-modal-warning">
            Amounts must sum to zero before you can record this hand.
          </p>
        ) : null}

        <Button
          type="submit"
          variant="primary"
          loading={isSubmitting}
          disabled={!canSubmit}
          style={{ width: "100%", marginTop: 12 }}
        >
          Record hand
        </Button>
      </form>
    </Modal>
  );
}
