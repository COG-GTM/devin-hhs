import { NextResponse } from 'next/server';
import { getHcpcsAnalysis, getMonthlySpendingByHCPCS } from '@/lib/db';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ code: string }> }
) {
  try {
    const { code: rawCode } = await params;
    const code = rawCode.toUpperCase();
    
    const [analysisData, monthlySpending] = await Promise.all([
      getHcpcsAnalysis(code),
      getMonthlySpendingByHCPCS(code)
    ]);

    if (analysisData.length === 0) {
      return NextResponse.json(
        { error: 'HCPCS code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      code: code,
      data: analysisData,
      monthlySpending: monthlySpending
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch HCPCS data' },
      { status: 500 }
    );
  }
}
