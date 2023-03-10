const WBSources = "https://api.worldbank.org/v2/sources?format=json&page=1&per_page=299";
const WBRegions = "https://api.worldbank.org/v2/region?format=json&page=1&per_page=299";
const WBCountries = "https://api.worldbank.org/v2/country?format=json&page=1&per_page=299";

const WBCountriesByRegion = (region) =>
  `https://api.worldbank.org/V2/region/${region}/country?format=json&page=1&per_page=299`;

const WBIndicatorById = (indicatorId) =>
  `https://api.worldbank.org/v2/indicator/${indicatorId}?format=json&page=1&per_page=299`;

const WBIndicatorByCountry = (country, indicator) =>
  `https://api.worldbank.org/v2/country/${country}/indicator/${indicator}?format=json&page=1&per_page=299`;

export { WBRegions, WBSources, WBCountries, WBCountriesByRegion, WBIndicatorByCountry, WBIndicatorById };
