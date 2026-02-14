// =============================================================================
// DATA SOURCES - Transparency and Provenance
// All data used in DEVIN//HHS with links to original sources
// =============================================================================

export interface DataSource {
  id: string;
  name: string;
  url: string;
  description: string;
  dataType: string;
  lastUpdated?: string;
  coverage?: string;
}

export const DATA_SOURCES: DataSource[] = [
  {
    id: 'cms-fmap',
    name: 'CMS Federal Matching Rates (FMAP)',
    url: 'https://www.medicaid.gov/medicaid/finance/state-financials/federal-matching-rates-and-data/index.html',
    description: 'Official FMAP rates published by the Centers for Medicare & Medicaid Services. Determines federal share of Medicaid costs for each state.',
    dataType: 'FMAP Rates',
    lastUpdated: 'FY 2024',
    coverage: '51 states and territories'
  },
  {
    id: 'census-2020',
    name: 'U.S. Census Bureau - 2020 Decennial Census',
    url: 'https://data.census.gov/',
    description: 'Official population counts from the 2020 Census. Used to calculate per-capita Medicaid spending.',
    dataType: 'Population',
    lastUpdated: '2020',
    coverage: 'All U.S. states and territories'
  },
  {
    id: 'hhs-provider',
    name: 'HHS Medicaid Provider Utilization',
    url: 'https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicaid-provider-utilization-and-payment-data',
    description: 'Provider-level Medicaid spending data from the HHS Open Data portal. Contains 227 million payment records.',
    dataType: 'Provider Spending',
    lastUpdated: '2018-2024',
    coverage: '227M records, $1.09T total spending'
  },
  {
    id: 'kff-expansion',
    name: 'KFF Medicaid Expansion Tracker',
    url: 'https://www.kff.org/medicaid/issue-brief/status-of-state-medicaid-expansion-decisions-interactive-map/',
    description: 'Kaiser Family Foundation tracking of which states have expanded Medicaid under the Affordable Care Act.',
    dataType: 'Expansion Status',
    lastUpdated: '2024',
    coverage: 'All U.S. states'
  },
  {
    id: 'congress-districts',
    name: 'U.S. Census Congressional Districts',
    url: 'https://www.census.gov/programs-surveys/decennial-census/about/rdo/summary-files.html',
    description: 'Congressional district boundaries from the 2020 redistricting. Used to estimate district-level Medicaid spending.',
    dataType: 'Geographic Boundaries',
    lastUpdated: '2022 (Post-2020 Redistricting)',
    coverage: '436 congressional districts'
  },
  {
    id: 'nppes',
    name: 'NPPES Provider Registry',
    url: 'https://npiregistry.cms.hhs.gov/',
    description: 'National Plan and Provider Enumeration System. Contains NPI numbers and provider information.',
    dataType: 'Provider Registry',
    lastUpdated: 'Monthly updates',
    coverage: '8.9M provider locations'
  }
];

// Get a specific source by ID
export function getSource(id: string): DataSource | undefined {
  return DATA_SOURCES.find(s => s.id === id);
}

// Get sources by data type
export function getSourcesByType(type: string): DataSource[] {
  return DATA_SOURCES.filter(s => s.dataType.toLowerCase().includes(type.toLowerCase()));
}
