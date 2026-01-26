import { countries } from './constants';
import RegionPicker from './RegionPicker';

export default function CountryFilter() {
  return (
    <RegionPicker
      label="Countries"
      regions={countries}
      placeholder="Select country..."
    />
  );
}
