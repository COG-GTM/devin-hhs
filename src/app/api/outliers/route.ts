import { NextResponse } from 'next/server';
import { 
  PROVIDER_OUTLIERS, 
  HCPCS_OUTLIERS, 
  COST_PER_CLAIM_OUTLIERS,
  REPEAT_PROCEDURE_OUTLIERS,
  OUTLIER_METADATA
} from '@/lib/outlier-aggregates';

export const dynamic = 'force-static';
export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  // Data already includes unique analogies - just sort by z-score
  const sortedProviders = [...PROVIDER_OUTLIERS].sort((a, b) => b.spendingZScore - a.spendingZScore);
  const sortedHCPCS = [...HCPCS_OUTLIERS].sort((a, b) => b.spendingZScore - a.spendingZScore);
  const sortedCostOutliers = [...COST_PER_CLAIM_OUTLIERS].sort((a, b) => b.spendingZScore - a.spendingZScore);
  const sortedRepeatOutliers = [...REPEAT_PROCEDURE_OUTLIERS].sort((a, b) => b.spendingZScore - a.spendingZScore);

  return NextResponse.json({
    providerOutliers: sortedProviders,
    hcpcsOutliers: sortedHCPCS,
    costPerClaimOutliers: sortedCostOutliers,
    repeatProcedureOutliers: sortedRepeatOutliers,
    metadata: {
      ...OUTLIER_METADATA,
      methodology: 'Full dataset z-score analysis (227M rows)',
      note: 'All categories sorted by Spending Z-Score (highest first). Each outlier has a unique, mathematically accurate probability analogy.'
    }
  });
}
