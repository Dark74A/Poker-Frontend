import { formatSignedMoney } from "../utils/format";
import "../styles/LedgerTicker.css";

export function LedgerTicker({ players }) {
  const active = players.filter((p) => p.status !== "INACTIVE");
  if (active.length === 0) return null;

  const maxAbs = Math.max(1, ...active.map((p) => Math.abs(p.profitLoss)));
  const sorted = [...active].sort((a, b) => b.profitLoss - a.profitLoss);

  return (
    <div className="ledger-ticker">
      {sorted.map((p) => {
        const magnitude = Math.min(1, Math.abs(p.profitLoss) / maxAbs);
        const isUp = p.profitLoss > 0;
        const isFlat = p.profitLoss === 0;
        return (
          <div key={p.playerId} className="ticker-chip">
            <div
              className={`ticker-chip-bar ${isFlat ? "is-flat" : isUp ? "is-up" : "is-down"}`}
              style={{ "--mag": Math.max(magnitude, 0.08) }}
            />
            <span className="ticker-chip-name">{p.displayName}</span>
            <span
              className={`ticker-chip-value mono ${isFlat ? "is-flat" : isUp ? "is-up" : "is-down"}`}
            >
              {formatSignedMoney(p.profitLoss)}
            </span>
          </div>
        );
      })}
    </div>
  );
}
