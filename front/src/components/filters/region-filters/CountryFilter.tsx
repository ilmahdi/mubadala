'use client';

import { useQueryState, parseAsArrayOf, parseAsString } from 'nuqs';
import { countries } from './constants';
import RegionPicker from './RegionPicker';

export default function CountryFilter() {
  const [country, setCountry] = useQueryState(
    'country_name',
    parseAsArrayOf(parseAsString, ',').withDefault([]),
  );

  return (
    <RegionPicker
      label="Countries"
      regions={countries}
      placeholder="Select country..."
      value={country}
      onChange={setCountry}
    />
  );
}
