import { containerStyles } from '@/src/config/component-styles';
import TradeDataTable from './TradeDataTable';

export default function TradeDashboard() {
  return (
    <div className={containerStyles.flexCol}>
      {/* Top summary area (placeholder for future KPIs/charts) */}
      {/* <div className={containerStyles.grid3}>
        <div className={cardStyles.compact}>
          <p className={textStyles.muted}>Total Imports</p>
        </div>
        <div className={cardStyles.compact}>
          <p className={textStyles.muted}>Total Exports</p>
        </div>
        <div className={cardStyles.compact}>
          <p className={textStyles.muted}>Trade Balance</p>
        </div>
      </div> */}

      {/* Main table area */}
      <div className="min-h-0 flex-1">
        <TradeDataTable />
      </div>
    </div>
  );
}
