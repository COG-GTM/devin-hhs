'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface ProviderRecord {
  npi: string;
  hcpcs: string;
  beneficiaries: number;
  claims: number;
  paid: number;
}

type SortField = 'paid' | 'claims' | 'beneficiaries';

export default function ExplorePage() {
  const [data, setData] = useState<ProviderRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<SortField>('paid'); // Default to Amount Paid
  const [totalPages] = useState(25); // 1250 items / 50 per page

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const url = `/api/rankings?sort=${sortBy}&page=${page}&limit=50`;
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      
      if (result.data && Array.isArray(result.data)) {
        setData(result.data);
      } else if (result.error) {
        setError(result.error);
        setData([]);
      } else {
        setData([]);
      }
    } catch (err) {
      console.error('Error fetching data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load data');
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, sortBy]);

  const handleSort = (field: SortField) => {
    setSortBy(field);
    setPage(1);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // For now, search redirects to provider page
    if (search.trim()) {
      window.location.href = `/provider/${search.trim()}`;
    }
  };

  const formatCurrency = (amount: number) => {
    if (amount >= 1e9) return `$${(amount/1e9).toFixed(2)}B`;
    if (amount >= 1e6) return `$${(amount/1e6).toFixed(1)}M`;
    if (amount >= 1e3) return `$${(amount/1e3).toFixed(0)}K`;
    return `$${amount.toFixed(0)}`;
  };

  const formatNumber = (num: number) => {
    if (num >= 1e9) return `${(num/1e9).toFixed(2)}B`;
    if (num >= 1e6) return `${(num/1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num/1e3).toFixed(0)}K`;
    return new Intl.NumberFormat('en-US').format(num);
  };

  // Calculate rank based on page and position
  const getRank = (index: number) => (page - 1) * 50 + index + 1;

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">EXPLORE DATA</h1>
          <p className="text-gray-600 mt-2">
            Top 1,250 provider-procedure combinations ranked by spending, claims, or beneficiaries.
          </p>
        </div>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-6">
          <div className="flex gap-4">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter NPI to lookup provider..."
              className="flex-1 border-2 border-black px-4 py-3 font-mono text-sm focus:outline-none focus:ring-0"
            />
            <button
              type="submit"
              className="bg-black text-white px-6 py-3 font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
            >
              Lookup
            </button>
          </div>
        </form>

        {/* Sort Controls */}
        <div className="mb-6 flex flex-wrap gap-2">
          <span className="text-sm font-bold py-2">RANK BY:</span>
          <button
            onClick={() => handleSort('paid')}
            className={`px-4 py-2 text-sm font-bold border-2 transition-colors ${
              sortBy === 'paid' 
                ? 'border-black bg-black text-white' 
                : 'border-gray-300 hover:border-black'
            }`}
          >
            Amount Paid
          </button>
          <button
            onClick={() => handleSort('claims')}
            className={`px-4 py-2 text-sm font-bold border-2 transition-colors ${
              sortBy === 'claims' 
                ? 'border-black bg-black text-white' 
                : 'border-gray-300 hover:border-black'
            }`}
          >
            Claims
          </button>
          <button
            onClick={() => handleSort('beneficiaries')}
            className={`px-4 py-2 text-sm font-bold border-2 transition-colors ${
              sortBy === 'beneficiaries' 
                ? 'border-black bg-black text-white' 
                : 'border-gray-300 hover:border-black'
            }`}
          >
            Beneficiaries
          </button>
        </div>

        {/* Active Filter Indicator */}
        <div className="mb-4 p-3 bg-gray-100 border-l-4 border-black text-sm">
          Showing <strong>Top {totalPages * 50}</strong> by <strong>
            {sortBy === 'paid' ? 'Amount Paid' : sortBy === 'claims' ? 'Claims' : 'Beneficiaries'}
          </strong> (highest to lowest) • Page {page} of {totalPages}
        </div>

        {/* Results */}
        <div className="border-2 border-black">
          {/* Table Header */}
          <div className="grid grid-cols-6 gap-4 p-4 bg-black text-white text-xs font-bold uppercase tracking-wide">
            <div className="text-center">Rank</div>
            <div>Provider NPI</div>
            <div>HCPCS</div>
            <div className={`text-right ${sortBy === 'beneficiaries' ? 'text-yellow-300' : ''}`}>
              Beneficiaries {sortBy === 'beneficiaries' && '↓'}
            </div>
            <div className={`text-right ${sortBy === 'claims' ? 'text-yellow-300' : ''}`}>
              Claims {sortBy === 'claims' && '↓'}
            </div>
            <div className={`text-right ${sortBy === 'paid' ? 'text-yellow-300' : ''}`}>
              Amount Paid {sortBy === 'paid' && '↓'}
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="p-12 text-center text-gray-500">
              Loading...
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="p-12 text-center">
              <p className="text-red-600 mb-2">Error: {error}</p>
              <button 
                onClick={fetchData}
                className="text-sm underline hover:text-black"
              >
                Try again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && data.length === 0 && (
            <div className="p-12 text-center">
              <p className="text-gray-500 mb-2">No records found</p>
            </div>
          )}

          {/* Data Rows */}
          {!loading && data.length > 0 && (
            <div className="divide-y divide-gray-200">
              {data.map((row, idx) => (
                <div 
                  key={`${row.npi}-${row.hcpcs}-${idx}`} 
                  className="grid grid-cols-6 gap-4 p-4 text-sm hover:bg-gray-50 transition-colors"
                >
                  <div className="text-center">
                    <span className={`inline-block w-10 h-10 leading-10 text-center font-bold rounded ${
                      getRank(idx) <= 3 ? 'bg-yellow-400 text-black' : 
                      getRank(idx) <= 10 ? 'bg-gray-200' : 'bg-gray-100'
                    }`}>
                      {getRank(idx)}
                    </span>
                  </div>
                  <div>
                    <Link 
                      href={`/provider/${row.npi}`}
                      className="text-blue-600 hover:underline font-mono"
                    >
                      {row.npi}
                    </Link>
                  </div>
                  <div>
                    <Link 
                      href={`/hcpcs/${row.hcpcs}`}
                      className="text-blue-600 hover:underline font-mono"
                    >
                      {row.hcpcs}
                    </Link>
                  </div>
                  <div className={`text-right ${sortBy === 'beneficiaries' ? 'font-bold' : ''}`}>
                    {formatNumber(row.beneficiaries)}
                  </div>
                  <div className={`text-right ${sortBy === 'claims' ? 'font-bold' : ''}`}>
                    {formatNumber(row.claims)}
                  </div>
                  <div className={`text-right ${sortBy === 'paid' ? 'font-bold text-green-700' : ''}`}>
                    {formatCurrency(row.paid)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!loading && data.length > 0 && (
          <div className="mt-6 flex justify-center items-center gap-2">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="border-2 border-black px-3 py-2 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
            >
              ««
            </button>
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="border-2 border-black px-4 py-2 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
            >
              ‹ Prev
            </button>
            
            {/* Page numbers */}
            <div className="flex gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum: number;
                if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                
                if (pageNum < 1 || pageNum > totalPages) return null;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setPage(pageNum)}
                    className={`w-10 h-10 text-sm font-bold border-2 transition-colors ${
                      page === pageNum 
                        ? 'border-black bg-black text-white' 
                        : 'border-gray-300 hover:border-black'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page >= totalPages}
              className="border-2 border-black px-4 py-2 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
            >
              Next ›
            </button>
            <button
              onClick={() => setPage(totalPages)}
              disabled={page >= totalPages}
              className="border-2 border-black px-3 py-2 text-sm font-bold disabled:opacity-30 disabled:cursor-not-allowed hover:bg-black hover:text-white transition-colors"
            >
              »»
            </button>
          </div>
        )}

        {/* Info */}
        <p className="mt-6 text-center text-xs text-gray-500">
          Pre-computed rankings from full 227M record analysis. Data source: opendata.hhs.gov
        </p>
      </div>
    </div>
  );
}
