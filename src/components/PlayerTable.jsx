import { formatMoney, formatSignedMoney, initials } from "../utils/format";
import { Button } from "./Button";
import { StatusPill } from "./StatusPill";
import "../styles/PlayerTable.css";

export function PlayerTable({
  players,
  canManage,
  sessionOpen,
  onCashOut,
  onRemove,
}) {
  return (
    <div className="player-table">
      <div className="player-table-head">
        <span>Player</span>
        <span>Buy-in</span>
        <span>Cash-out</span>
        <span>Stack</span>
        <span>Net</span>
        <span className="player-table-actions-head">Actions</span>
      </div>

      {players.filter((p) => p.status !== "INACTIVE").map((p) => {
        const isInactive = p.status === "INACTIVE";
        const isUp = p.profitLoss > 0;
        const isFlat = p.profitLoss === 0;

        return (
          <div
            key={p.playerId}
            className={`player-row ${isInactive ? "is-inactive" : ""}`}
          >
            <div className="player-row-identity">
              <span className="player-avatar" aria-hidden="true">
                {initials(p.displayName)}
              </span>
              <div className="player-row-name-block">
                <span className="player-row-name">{p.displayName}</span>
                {isInactive ? <StatusPill status="INACTIVE" /> : null}
              </div>
            </div>

            <span className="mono player-row-amount" data-label="Buy-in">
              {formatMoney(p.totalBuyIn)}
            </span>
            <span className="mono player-row-amount" data-label="Cash-out">
              {formatMoney(p.totalCashOut)}
            </span>
            <span
              className="mono player-row-amount"
              data-label="Stack"
              title="Chips currently in front of this player"
            >
              {formatMoney(p.chipStack)}
            </span>
            <span
              className={`mono player-row-net ${isFlat ? "is-flat" : isUp ? "is-up" : "is-down"}`}
              data-label="Net"
              title="Cash-outs plus current stack, minus buy-ins"
            >
              {formatSignedMoney(p.profitLoss)}
            </span>

            <div className="player-row-actions">
              {canManage && sessionOpen && !isInactive ? (
                <>
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => onCashOut(p)}
                  >
                    Cash-out
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => onRemove(p)}>
                    Remove
                  </Button>
                </>
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
