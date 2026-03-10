import { apiGet } from '../api';

/**
 * Country data structure from backend API
 */
export interface Country {
  country_name: string;
  country_code: string;
}

/** Module-level cache — populated on the first successful fetch. */
let _cache: Promise<Country[]> | null = null;

/**
 * Fetch all countries from the backend
 * Returns array of countries with name and ISO code
 *
 * @returns Promise resolving to array of Country objects
 * @throws Error if API request fails
 */
export async function getCountries(): Promise<Country[]> {
  if (!_cache) {
    _cache = apiGet<Country[]>('/countries/').catch((error) => {
      _cache = null;
      console.error('Failed to fetch countries:', error);
      throw error;
    });
  }
  return _cache;
}

/**
 * Transform countries into option format for filters/dropdowns
 *
 * @param countries - Array of Country objects
 * @returns Array of options with label and value
 */
export function countriesToOptions(countries: Country[]) {
  return countries.map((country) => ({
    label: country.country_name,
    value: country.country_code,
  }));
}
