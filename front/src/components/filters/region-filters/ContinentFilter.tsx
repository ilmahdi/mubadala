'use client';

import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { continents } from './constants';
import RegionPicker from './RegionPicker';

export default function ContinentFilter() {
  const [continent, setContinent] = useQueryState(
    'continent',
    parseAsArrayOf(parseAsString, ',').withDefault([]),
  );

  return (
    <RegionPicker
      label="Continents"
      regions={continents}
      placeholder="Select continent..."
      value={continent}
      onChange={setContinent}
    />
  );
}
