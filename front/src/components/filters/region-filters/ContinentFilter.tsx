import { continents } from './constants';
import RegionPicker from './RegionPicker';

export default function ContinentFilter() {
  return (
    <RegionPicker
      label="Continents"
      regions={continents}
      placeholder="Select continent..."
    />
  );
}
