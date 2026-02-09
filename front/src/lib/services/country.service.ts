import { apiGet } from '../api';

/**
 * Country data structure from backend API
 */
export interface Country {
  country_name: string;
  country_code: string;
}

/**
 * Fetch all countries from the backend
 * Returns array of countries with name and ISO code
 *
 * @returns Promise resolving to array of Country objects
 * @throws Error if API request fails
 */
export async function getCountries(): Promise<Country[]> {
  try {
    const countries = await apiGet<Country[]>('/countries/');
    return countries;
  } catch (error) {
    console.error('Failed to fetch countries:', error);
    throw error;
  }
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
