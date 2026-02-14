// =============================================================================
// FEDERAL SPENDING OUTLIERS - CENSUS-BASED PER-CAPITA ANALYSIS
// Source: Medicaid spending + Census 2020 population data
// Methodology: Z-score analysis on per-capita spending by state
// Updated: Feb 14, 2026
// =============================================================================

import { STATES_BY_SPENDING } from './geo-aggregates';
import { FMAP_DATA } from './federal-aggregates';

export interface StateOutlier {
  state: string;
  stateName: string;
  spending: number;
  population: number;
  perCapita: number;
  perCapitaZScore: number;
  fmap: number;
  expansionStatus: 'Y' | 'N';
  analogy: {
    probability: string;
    analogy: string;
    severity: string;
  };
  analysis: string;
}

export interface FederalOutlierSummary {
  totalStates: number;
  nationalPerCapita: number;
  standardDeviation: number;
  highOutliers: number;
  lowOutliers: number;
  topOutlier: string;
  bottomOutlier: string;
}

// State code to name lookup
const STATE_NAMES: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'DC': 'District of Columbia', 'FL': 'Florida',
  'GA': 'Georgia', 'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana',
  'IA': 'Iowa', 'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine',
  'MD': 'Maryland', 'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi',
  'MO': 'Missouri', 'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire',
  'NJ': 'New Jersey', 'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota',
  'OH': 'Ohio', 'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'PR': 'Puerto Rico',
  'RI': 'Rhode Island', 'SC': 'South Carolina', 'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas',
  'UT': 'Utah', 'VT': 'Vermont', 'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia',
  'WI': 'Wisconsin', 'WY': 'Wyoming', 'VI': 'Virgin Islands', 'GU': 'Guam', 'AS': 'American Samoa',
  'MP': 'Northern Mariana Islands'
};

// Calculate statistics
const perCapitaValues = STATES_BY_SPENDING
  .filter(s => s.population > 100000) // Exclude tiny territories
  .map(s => s.perCapita);

const nationalAvg = perCapitaValues.reduce((a, b) => a + b, 0) / perCapitaValues.length;
const variance = perCapitaValues.reduce((sum, val) => sum + Math.pow(val - nationalAvg, 2), 0) / perCapitaValues.length;
const stdDev = Math.sqrt(variance);

// Generate z-score based analogy
function getAnalogy(zScore: number): { probability: string; analogy: string; severity: string } {
  const absZ = Math.abs(zScore);
  
  if (absZ > 4) {
    return {
      probability: "1 in 31,560",
      analogy: "A specific person being struck by lightning in a given year",
      severity: "extreme"
    };
  } else if (absZ > 3) {
    return {
      probability: "1 in 741",
      analogy: "Rolling six 6's in a row on a fair die",
      severity: "very high"
    };
  } else if (absZ > 2.5) {
    return {
      probability: "1 in 161",
      analogy: "Drawing 4 aces from a shuffled deck in the first 4 cards",
      severity: "high"
    };
  } else if (absZ > 2) {
    return {
      probability: "1 in 44",
      analogy: "Flipping heads 5 times in a row",
      severity: "notable"
    };
  } else {
    return {
      probability: "1 in 10",
      analogy: "Rolling a 1 on a 10-sided die",
      severity: "moderate"
    };
  }
}

// Generate analysis for each outlier
function generateAnalysis(state: string, perCapita: number, zScore: number, fmap: number, expansion: string): string {
  const direction = zScore > 0 ? 'above' : 'below';
  const pct = Math.abs(((perCapita - nationalAvg) / nationalAvg) * 100).toFixed(0);
  
  const factors: string[] = [];
  
  // High spenders
  if (zScore > 2) {
    if (state === 'DC') {
      factors.push("D.C. has unique federal district dynamics with high cost of care and concentrated urban poverty.");
    } else if (state === 'AK') {
      factors.push("Alaska's geographic isolation drives up healthcare delivery costs significantly.");
    } else if (state === 'MA' || state === 'NY') {
      factors.push("High cost of living and generous benefit packages drive up per-beneficiary costs.");
    } else if (state === 'ME' || state === 'VT' || state === 'RI') {
      factors.push("Small population combined with high healthcare utilization in aging demographics.");
    } else if (state === 'NM') {
      factors.push("High poverty rate combined with Medicaid expansion coverage.");
    }
    
    if (expansion === 'Y') {
      factors.push("Medicaid expansion has increased coverage, adding more beneficiaries.");
    }
    
    if (fmap > 70) {
      factors.push(`High FMAP (${fmap}%) means federal government covers most costs, potentially reducing state cost controls.`);
    }
  }
  
  // Low spenders
  if (zScore < -1.5) {
    if (expansion === 'N') {
      factors.push("Has NOT expanded Medicaid, limiting coverage to fewer residents.");
    }
    if (state === 'GA' || state === 'TX' || state === 'FL') {
      factors.push("Large population dilutes per-capita figures; total spending is still substantial.");
    }
    if (state === 'UT' || state === 'WY' || state === 'ID') {
      factors.push("Younger, healthier population demographics reduce per-capita healthcare needs.");
    }
  }
  
  if (factors.length === 0) {
    factors.push(`Spending is ${pct}% ${direction} the national average of $${nationalAvg.toFixed(0)} per person.`);
  }
  
  return factors.join(" ");
}

// Build outlier data
export const STATE_OUTLIERS: StateOutlier[] = STATES_BY_SPENDING
  .filter(s => s.population > 100000) // Exclude tiny territories
  .map(s => {
    const zScore = (s.perCapita - nationalAvg) / stdDev;
    const fmapData = FMAP_DATA.find(f => f.stateCode === s.state);
    const fmap = fmapData?.fy2024 || 50;
    const expansion = fmapData?.expansionStatus || 'N';
    
    return {
      state: s.state,
      stateName: STATE_NAMES[s.state] || s.state,
      spending: s.spending,
      population: s.population,
      perCapita: s.perCapita,
      perCapitaZScore: parseFloat(zScore.toFixed(2)),
      fmap,
      expansionStatus: expansion,
      analogy: getAnalogy(zScore),
      analysis: generateAnalysis(s.state, s.perCapita, zScore, fmap, expansion)
    };
  })
  .sort((a, b) => b.perCapitaZScore - a.perCapitaZScore);

// High outliers (z > 2)
export const HIGH_OUTLIERS = STATE_OUTLIERS.filter(s => s.perCapitaZScore > 2);

// Low outliers (z < -1.5)
export const LOW_OUTLIERS = STATE_OUTLIERS.filter(s => s.perCapitaZScore < -1.5);

// Summary statistics
export const FEDERAL_OUTLIER_SUMMARY: FederalOutlierSummary = {
  totalStates: STATE_OUTLIERS.length,
  nationalPerCapita: parseFloat(nationalAvg.toFixed(2)),
  standardDeviation: parseFloat(stdDev.toFixed(2)),
  highOutliers: HIGH_OUTLIERS.length,
  lowOutliers: LOW_OUTLIERS.length,
  topOutlier: HIGH_OUTLIERS[0]?.state || 'N/A',
  bottomOutlier: LOW_OUTLIERS[LOW_OUTLIERS.length - 1]?.state || 'N/A'
};

// Census data source documentation
export const CENSUS_METADATA = {
  source: "U.S. Census Bureau, 2020 Decennial Census",
  url: "https://data.census.gov/",
  fields: ["Total Population by State/Territory"],
  methodology: "Per-capita spending calculated as Total Medicaid Spending / Census Population",
  zScoreThreshold: "High outliers: z > 2.0 (top ~2.5%), Low outliers: z < -1.5 (bottom ~7%)",
  computedAt: new Date().toISOString()
};
