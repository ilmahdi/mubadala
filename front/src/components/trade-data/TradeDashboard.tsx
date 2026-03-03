import { containerStyles } from '@/src/config/component-styles';
import TradeDataTable from './TradeDataTable';

export default function TradeDashboard() {
  return (
    <div className={containerStyles.flexCol}>
      <div className="min-h-0 flex-1">
        <TradeDataTable />
      </div>
    </div>
  );
}
