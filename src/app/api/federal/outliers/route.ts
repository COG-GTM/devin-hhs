import { NextResponse } from 'next/server';
import {
  STATE_OUTLIERS,
  HIGH_OUTLIERS,
  LOW_OUTLIERS,
  FEDERAL_OUTLIER_SUMMARY,
  CENSUS_METADATA
} from '@/lib/federal-outliers';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  return NextResponse.json({
    summary: FEDERAL_OUTLIER_SUMMARY,
    highOutliers: HIGH_OUTLIERS,
    lowOutliers: LOW_OUTLIERS,
    allStates: STATE_OUTLIERS,
    census: CENSUS_METADATA
  });
}
