// Provider name lookup from NPPES Registry
// Computed: Feb 13, 2026

export interface ProviderInfo {
  name: string;
  specialty: string;
  state: string;
  type: 'Organization' | 'Individual' | 'Unknown';
}

export const PROVIDER_LOOKUP: Record<string, ProviderInfo> = {
  '1417262056': { name: 'PUBLIC PARTNERSHIPS LLC', specialty: 'Case Management', state: 'NY', type: 'Organization' },
  '1699703827': { name: 'LOS ANGELES COUNTY DEPARTMENT OF MENTAL HEALTH', specialty: 'Psychiatric Unit', state: 'CA', type: 'Organization' },
  '1376609297': { name: 'TEMPUS UNLIMITED, INC.', specialty: 'Voluntary or Charitable', state: 'MA', type: 'Organization' },
  '1699725143': { name: 'MODIVCARE SOLUTIONS, LLC', specialty: 'Taxi', state: 'CO', type: 'Organization' },
  '1922467554': { name: 'FREEDOM CARE LLC', specialty: 'Home Health', state: 'NY', type: 'Organization' },
  '1710176151': { name: 'GUARDIANTRAC. LLC', specialty: 'Supports Brokerage', state: 'MI', type: 'Organization' },
  '1629436241': { name: 'DEPARTMENT OF INTELLECTUAL AND DEVELOPMENTAL DISABILITIES, STATE OF TN', specialty: 'Public Health or Welfare', state: 'TN', type: 'Organization' },
  '1982757688': { name: 'ALABAMA DEPARTMENT OF MENTAL HEALTH AND MENTAL RETARDATION', specialty: 'Community/Behavioral Health', state: 'AL', type: 'Organization' },
  '1538649983': { name: 'CONSUMER DIRECT CARE NETWORK VIRGINIA', specialty: 'Case Manager/Care Coordinator', state: 'MT', type: 'Organization' },
  '1528263910': { name: 'COUNTY OF SANTA CLARA', specialty: 'Community/Behavioral Health', state: 'CA', type: 'Organization' },
};

export function getProviderName(npi: string): string {
  return PROVIDER_LOOKUP[npi]?.name || `Provider ${npi}`;
}

export function getProviderInfo(npi: string): ProviderInfo | undefined {
  return PROVIDER_LOOKUP[npi];
}
