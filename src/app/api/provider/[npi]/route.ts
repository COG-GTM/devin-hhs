import { NextResponse } from 'next/server';
import { getProviderByNPI, getMonthlySpendingByNPI } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ npi: string }> }
) {
  try {
    const { npi } = await params;
    
    const [providerData, monthlySpending] = await Promise.all([
      getProviderByNPI(npi),
      getMonthlySpendingByNPI(npi)
    ]);

    if (providerData.length === 0) {
      return NextResponse.json(
        { error: 'Provider not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      provider: providerData,
      monthlySpending: monthlySpending
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch provider data' },
      { status: 500 }
    );
  }
}
