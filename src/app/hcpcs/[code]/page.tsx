'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface HcpcsRecord {
  billing_provider_npi: string;
  claim_month: string;
  total_unique_beneficiaries: number;
  total_claims: number;
  total_paid: string;
}

export default function HcpcsPage() {
  const params = useParams();
  const code = (params.code as string).toUpperCase();
  
  const [hcpcsData, setHcpcsData] = useState<HcpcsRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHcpcsData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/hcpcs/${code}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('HCPCS code not found');
          } else {
            setError('Failed to fetch HCPCS data');
          }
          return;
        }
        
        const result = await response.json();
        setHcpcsData(result.data || []);
      } catch (err) {
        console.error('Error fetching HCPCS data:', err);
        setError('Failed to fetch HCPCS data');
      } finally {
        setLoading(false);
      }
    };

    if (code) {
      fetchHcpcsData();
    }
  }, [code]);

  const formatCurrency = (amount: string) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return '—';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('en-US').format(num);
  };

  const calculateTotals = () => {
    if (hcpcsData.length === 0) return { totalSpending: 0, totalClaims: 0 };
    return hcpcsData.reduce((acc, record) => ({
      totalSpending: acc.totalSpending + parseFloat(record.total_paid || '0'),
      totalClaims: acc.totalClaims + (record.total_claims || 0),
    }), { totalSpending: 0, totalClaims: 0 });
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link href="/explore" className="text-sm text-gray-600 hover:text-black">
            ← Back to Explore
          </Link>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">HCPCS CODE</h1>
          <p className="text-xl font-mono text-gray-600 mt-2">{code}</p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="border-2 border-black p-12 text-center">
            <p className="text-gray-500">Loading HCPCS data...</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="border-2 border-black p-12 text-center">
            <p className="text-xl font-bold mb-2">Not Found</p>
            <p className="text-gray-500 mb-4">{error}</p>
            <p className="text-sm text-gray-400">
              Data is currently being imported (227M records). Try again later.
            </p>
          </div>
        )}

        {/* No Data */}
        {!loading && !error && hcpcsData.length === 0 && (
          <div className="border-2 border-black p-12 text-center">
            <p className="text-xl font-bold mb-2">No Records</p>
            <p className="text-gray-500">
              No claims found for this HCPCS code. Data may still be importing.
            </p>
          </div>
        )}

        {/* Data */}
        {!loading && !error && hcpcsData.length > 0 && (
          <>
            {/* Summary */}
            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="border-2 border-black p-6">
                <p className="text-3xl font-bold">
                  {formatCurrency(calculateTotals().totalSpending.toString())}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Spending</p>
              </div>
              <div className="border-2 border-black p-6">
                <p className="text-3xl font-bold">
                  {formatNumber(calculateTotals().totalClaims)}
                </p>
                <p className="text-sm text-gray-600 mt-1">Total Claims</p>
              </div>
            </div>

            {/* Records Table */}
            <div className="border-2 border-black">
              <div className="grid grid-cols-4 gap-4 p-4 bg-black text-white text-xs font-bold uppercase">
                <div>Provider NPI</div>
                <div>Month</div>
                <div className="text-right">Claims</div>
                <div className="text-right">Paid</div>
              </div>
              <div className="divide-y divide-gray-200">
                {hcpcsData.slice(0, 50).map((record, idx) => (
                  <div key={idx} className="grid grid-cols-4 gap-4 p-4 text-sm hover:bg-gray-50">
                    <div>
                      <Link 
                        href={`/provider/${record.billing_provider_npi}`}
                        className="text-blue-600 hover:underline font-mono"
                      >
                        {record.billing_provider_npi}
                      </Link>
                    </div>
                    <div className="text-gray-600">{record.claim_month}</div>
                    <div className="text-right">{formatNumber(record.total_claims)}</div>
                    <div className="text-right font-bold">{formatCurrency(record.total_paid)}</div>
                  </div>
                ))}
              </div>
            </div>
            
            {hcpcsData.length > 50 && (
              <p className="text-sm text-gray-500 mt-4 text-center">
                Showing 50 of {hcpcsData.length} records
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
