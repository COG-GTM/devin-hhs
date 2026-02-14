import { NextResponse } from 'next/server';
import { DATA_SOURCES } from '@/lib/data-sources';

export const dynamic = 'force-static';
export const revalidate = 86400;

export async function GET() {
  return NextResponse.json({
    sources: DATA_SOURCES,
    count: DATA_SOURCES.length,
    note: 'All data used in DEVIN//HHS is from publicly available government sources.'
  });
}
