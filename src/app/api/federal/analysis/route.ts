import { NextResponse } from 'next/server';
import { FMAP_DATA, DISTRICT_SPENDING, FEDERAL_SUMMARY } from '@/lib/federal-aggregates';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  // Pre-computed analysis based on federal data
  const expansionStates = FMAP_DATA.filter(f => f.expansionStatus === 'Y');
  const nonExpansionStates = FMAP_DATA.filter(f => f.expansionStatus === 'N');
  
  const avgExpansionFMAP = expansionStates.reduce((s, f) => s + f.fy2024, 0) / expansionStates.length;
  const avgNonExpansionFMAP = nonExpansionStates.reduce((s, f) => s + f.fy2024, 0) / nonExpansionStates.length;
  
  const highestFMAP = FMAP_DATA.reduce((max, f) => f.fy2024 > max.fy2024 ? f : max);
  const lowestFMAP = FMAP_DATA.reduce((min, f) => f.fy2024 < min.fy2024 ? f : min);
  
  // States at floor (50%)
  const statesAtFloor = FMAP_DATA.filter(f => f.fy2024 === 50.00);
  
  // FMAP changes
  const biggestIncrease = FMAP_DATA.reduce((max, f) => {
    const change = f.fy2024 - f.fy2022;
    const maxChange = max.fy2024 - max.fy2022;
    return change > maxChange ? f : max;
  });
  
  // District analysis
  const topDistrict = DISTRICT_SPENDING[0];
  const avgDistrictSpending = DISTRICT_SPENDING.reduce((s, d) => s + d.spending, 0) / DISTRICT_SPENDING.length;
  
  const analysis = {
    summary: `Analysis of ${FEDERAL_SUMMARY.totalStates} states and territories reveals significant variation in Federal Medical Assistance Percentage (FMAP) rates, ranging from ${lowestFMAP.fy2024}% to ${highestFMAP.fy2024}%. ${expansionStates.length} states have expanded Medicaid under the ACA, with an average FMAP of ${avgExpansionFMAP.toFixed(1)}%, compared to ${avgNonExpansionFMAP.toFixed(1)}% for non-expansion states. Federal funding flows through ${FEDERAL_SUMMARY.totalDistricts} congressional districts, with substantial geographic concentration in high-population states.`,
    
    insights: [
      {
        category: 'FMAP Distribution',
        title: `${statesAtFloor.length} States at Federal Minimum`,
        finding: `${statesAtFloor.map(s => s.stateCode).join(', ')} receive the statutory minimum FMAP of 50%. These are typically higher-income states where per-capita income exceeds the national average.`,
        implication: 'These states bear a higher share of Medicaid costs relative to federal contribution, potentially affecting program generosity and provider reimbursement rates.',
        severity: 'notable' as const
      },
      {
        category: 'Expansion Impact',
        title: `Expansion States Average ${(avgExpansionFMAP - avgNonExpansionFMAP).toFixed(1)}% Higher FMAP`,
        finding: `States that expanded Medicaid have an average FMAP of ${avgExpansionFMAP.toFixed(1)}%, while non-expansion states average ${avgNonExpansionFMAP.toFixed(1)}%. This ${(avgExpansionFMAP - avgNonExpansionFMAP).toFixed(1)} percentage point difference reflects the correlation between expansion decisions and state economic factors.`,
        implication: 'Higher FMAP rates in expansion states may indicate that federal matching incentives successfully encouraged expansion in states where the financial benefit was greatest.',
        severity: 'significant' as const
      },
      {
        category: 'Geographic Concentration',
        title: `${highestFMAP.stateName} Leads at ${highestFMAP.fy2024}% FMAP`,
        finding: `${highestFMAP.stateName} has the highest FMAP rate at ${highestFMAP.fy2024}%, meaning the federal government covers nearly ${Math.round(highestFMAP.fy2024)}% of Medicaid costs. This reflects the state's lower per-capita income relative to national averages.`,
        implication: 'High FMAP states receive proportionally more federal support, which can enable broader coverage but also creates dependency on federal funding decisions.',
        severity: 'info' as const
      },
      {
        category: 'Trend Analysis',
        title: `${biggestIncrease.stateName} Saw Largest FMAP Increase`,
        finding: `From FY2022 to FY2024, ${biggestIncrease.stateName} experienced the largest FMAP increase of ${(biggestIncrease.fy2024 - biggestIncrease.fy2022).toFixed(2)} percentage points (${biggestIncrease.fy2022}% to ${biggestIncrease.fy2024}%).`,
        implication: 'FMAP changes reflect economic shifts in state per-capita income relative to national averages, affecting state budget planning for Medicaid.',
        severity: 'info' as const
      },
      {
        category: 'Congressional Districts',
        title: `Top District: ${topDistrict.districtCode}`,
        finding: `${topDistrict.districtCode} has the highest estimated Medicaid spending at $${(topDistrict.spending / 1e9).toFixed(2)}B, which is ${(topDistrict.spending / avgDistrictSpending).toFixed(1)}x the average district spending of $${(avgDistrictSpending / 1e9).toFixed(2)}B.`,
        implication: 'High-spending districts often represent areas with greater healthcare needs, larger populations, or higher healthcare costs.',
        severity: 'notable' as const
      },
      {
        category: 'Non-Expansion Analysis',
        title: `${nonExpansionStates.length} States Have Not Expanded Medicaid`,
        finding: `${nonExpansionStates.map(s => s.stateCode).join(', ')} have not adopted Medicaid expansion. These states leave federal matching funds unclaimed and maintain coverage gaps for adults with incomes between 100-138% of poverty.`,
        implication: 'An estimated 2+ million uninsured adults fall into the coverage gap in non-expansion states, with significant implications for healthcare access and outcomes.',
        severity: 'significant' as const
      }
    ],
    
    keyMetrics: [
      {
        label: 'Average FMAP',
        value: `${FEDERAL_SUMMARY.avgFMAP}%`,
        context: 'Federal share of Medicaid costs'
      },
      {
        label: 'FMAP Range',
        value: `${lowestFMAP.fy2024}% - ${highestFMAP.fy2024}%`,
        context: 'Lowest to highest rate'
      },
      {
        label: 'Expansion Gap',
        value: `${(avgExpansionFMAP - avgNonExpansionFMAP).toFixed(1)}%`,
        context: 'Avg difference in FMAP'
      }
    ],
    
    policyImplications: [
      `The ${statesAtFloor.length} states at the 50% FMAP floor account for a disproportionate share of total Medicaid spending, as they include the most populous states (CA, NY, NJ, MA, etc.).`,
      `Non-expansion states collectively forgo billions in federal matching funds annually, affecting healthcare access for low-income adults and hospital financial stability.`,
      `FMAP formula changes would have outsized impacts on high-rate states like ${highestFMAP.stateName} (${highestFMAP.fy2024}%), where state budgets are heavily dependent on federal Medicaid matching.`,
      `Congressional districts in high-FMAP states receive more federal healthcare dollars per capita, creating geographic disparities in federal health spending.`,
      `The correlation between expansion status and FMAP rates suggests economic factors play a significant role in expansion decisions, beyond political considerations.`
    ],
    
    methodology: 'Analysis based on CMS Federal Medical Assistance Percentage (FMAP) rates for FY2022-2024, state Medicaid expansion status as of 2024, and estimated congressional district spending derived from state-level Medicaid expenditure data. District spending is estimated by proportionally distributing state totals across congressional districts within each state. FMAP rates determine the federal share of most Medicaid expenditures, with rates recalculated annually based on state per-capita income relative to national averages.',
    
    generatedAt: new Date().toISOString()
  };

  return NextResponse.json(analysis);
}
