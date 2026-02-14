import { NextResponse } from 'next/server';
import { TOP_BY_PAID, TOP_BY_CLAIMS, TOP_BY_BENEFICIARIES } from '@/lib/rankings';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const sort = searchParams.get('sort') || 'paid';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    
    // Get the appropriate ranking
    let rankings: any[];
    switch (sort) {
      case 'claims':
        rankings = TOP_BY_CLAIMS;
        break;
      case 'beneficiaries':
        rankings = TOP_BY_BENEFICIARIES;
        break;
      case 'paid':
      default:
        rankings = TOP_BY_PAID;
    }
    
    // Paginate
    const start = (page - 1) * limit;
    const end = start + limit;
    const data = rankings.slice(start, end);
    
    return NextResponse.json({
      data,
      page,
      limit,
      total: rankings.length,
      sort
    });
  } catch (error) {
    console.error('Rankings API Error:', error);
    return NextResponse.json({ error: 'Failed to fetch rankings' }, { status: 500 });
  }
}
