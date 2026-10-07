import { formatMoney, formatSignedMoney } from "../utils/format";
import "../styles/SummaryStats.css";

export function SummaryStats({ totalBuyIns, totalCashOuts }) {
  const outstanding = totalCashOuts - totalBuyIns;
  return (
    <div className="summary-stats">
      <div className="summary-stat">
        <span className="summary-stat-label">Total buy-ins</span>
        <span className="summary-stat-value mono">
          {formatMoney(totalBuyIns)}
        </span>
      </div>
      <div className="summary-stat-divider" />
      <div className="summary-stat">
        <span className="summary-stat-label">Total cash-outs</span>
        <span className="summary-stat-value mono">
          {formatMoney(totalCashOuts)}
        </span>
      </div>
      <div className="summary-stat-divider" />
      <div className="summary-stat">
        <span className="summary-stat-label">On the table</span>
        <span
          className="summary-stat-value mono"
          title="Buy-ins not yet cashed out"
        >
          {formatSignedMoney(-outstanding)}
        </span>
      </div>
    </div>
  );
}
