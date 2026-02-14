import Link from 'next/link';
import { YEARLY_DATA, TOTAL_SPENDING, TOTAL_CLAIMS, TOP_PROVIDERS, TOTAL_ROWS } from '@/lib/aggregates';
import ProviderSearch from '@/components/ProviderSearch';

export const dynamic = 'force-dynamic';

function formatNumber(num: number | string | null): string {
  if (!num) return '—';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (n >= 1e9) return `${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  return new Intl.NumberFormat('en-US').format(n);
}

function formatCurrency(num: number | string | null): string {
  if (!num) return '—';
  const n = typeof num === 'string' ? parseFloat(num) : num;
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(1)}M`;
  return `$${formatNumber(n)}`;
}

export default function Home() {
  return (
    <div>
      {/* Hero Section */}
      <section className="py-16 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="max-w-4xl">
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-none">
              <span className="block">DEVIN //</span>
              <span className="block mt-2">HHS</span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-gray-600 max-w-2xl">
              Full transparency into Medicaid provider spending across the United States. 
              Real data from opendata.hhs.gov — no filters, no spin, just facts.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link 
                href="/explore" 
                className="inline-block bg-black text-white px-6 py-3 font-bold text-sm uppercase tracking-wide hover:bg-gray-800 transition-colors"
              >
                Explore Data
              </Link>
              <Link 
                href="/charts" 
                className="inline-block border-2 border-black px-6 py-3 font-bold text-sm uppercase tracking-wide hover:bg-black hover:text-white transition-colors"
              >
                View Charts
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Total Stats */}
      <section className="border-t-2 border-black py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-8">
            Full Dataset Analysis (227M Records)
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="bg-white border-2 border-black p-6">
              <p className="text-3xl md:text-4xl font-bold text-green-700">
                {formatCurrency(TOTAL_SPENDING)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Total Spending</p>
            </div>
            
            <div className="bg-white border-2 border-black p-6">
              <p className="text-3xl md:text-4xl font-bold">
                {formatNumber(TOTAL_CLAIMS)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Total Claims</p>
            </div>
            
            <div className="bg-white border-2 border-black p-6">
              <p className="text-3xl md:text-4xl font-bold">
                500K+
              </p>
              <p className="text-sm text-gray-600 mt-2">Providers</p>
            </div>
            
            <div className="bg-white border-2 border-black p-6">
              <p className="text-3xl md:text-4xl font-bold">
                {formatNumber(TOTAL_ROWS)}
              </p>
              <p className="text-sm text-gray-600 mt-2">Records</p>
            </div>
          </div>
        </div>
      </section>

      {/* Yearly Spending Breakdown */}
      <section className="py-12 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-8">
            Yearly Spending Breakdown
          </h2>
          <div className="border-2 border-black overflow-x-auto">
            <table className="w-full">
              <thead className="bg-black text-white">
                <tr>
                  <th className="text-left p-4 text-sm font-bold uppercase">Year</th>
                  <th className="text-right p-4 text-sm font-bold uppercase">Spending</th>
                  <th className="text-right p-4 text-sm font-bold uppercase">Claims</th>
                  <th className="text-right p-4 text-sm font-bold uppercase">Beneficiaries</th>
                  <th className="text-right p-4 text-sm font-bold uppercase">YoY Change</th>
                </tr>
              </thead>
              <tbody>
                {YEARLY_DATA.map((year, i) => {
                  const prevSpending = i > 0 ? YEARLY_DATA[i - 1].spending : 0;
                  const growth = prevSpending > 0 
                    ? ((year.spending - prevSpending) / prevSpending * 100).toFixed(0)
                    : '—';
                  const isPositive = Number(growth) > 0;
                  
                  return (
                    <tr key={year.year} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-4 font-bold">{year.year}</td>
                      <td className="p-4 text-right font-mono">{formatCurrency(year.spending)}</td>
                      <td className="p-4 text-right font-mono">{formatNumber(year.claims)}</td>
                      <td className="p-4 text-right font-mono">{formatNumber(year.beneficiaries)}</td>
                      <td className={`p-4 text-right font-mono ${
                        growth === '—' ? 'text-gray-400' : isPositive ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {growth === '—' ? '—' : `${isPositive ? '+' : ''}${growth}%`}
                      </td>
                    </tr>
                  );
                })}
                <tr className="bg-black text-white font-bold">
                  <td className="p-4">TOTAL</td>
                  <td className="p-4 text-right font-mono">{formatCurrency(TOTAL_SPENDING)}</td>
                  <td className="p-4 text-right font-mono">{formatNumber(TOTAL_CLAIMS)}</td>
                  <td className="p-4 text-right font-mono">—</td>
                  <td className="p-4 text-right font-mono">—</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Top Outlier Providers */}
      <section className="py-12 px-4 bg-gray-50 border-t-2 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Top Outlier Providers (By Spending)
            </h2>
            <Link href="/outliers" className="text-sm font-bold underline hover:text-gray-600">
              View All Outliers
            </Link>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOP_PROVIDERS.slice(0, 6).map((provider, i) => (
              <Link 
                key={provider.npi}
                href={`/provider/${provider.npi}`}
                className="bg-white border-2 border-black p-6 hover:bg-black hover:text-white transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <span className="text-3xl font-bold text-gray-300 group-hover:text-gray-600">
                    #{i + 1}
                  </span>
                  <span className="text-xs font-mono bg-red-100 text-red-800 px-2 py-1 rounded group-hover:bg-red-200">
                    OUTLIER
                  </span>
                </div>
                <p className="text-sm font-mono text-gray-500 group-hover:text-gray-300 mt-4">
                  NPI {provider.npi}
                </p>
                <p className="text-2xl font-bold mt-2 text-green-700 group-hover:text-green-400">
                  {formatCurrency(provider.spending)}
                </p>
                <p className="text-sm text-gray-600 group-hover:text-gray-300 mt-1">
                  {formatNumber(provider.claims)} claims
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Federal Funding Overview */}
      <section className="py-12 px-4 border-t-2 border-black">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">
              Federal Funding Overview
            </h2>
            <Link href="/federal" className="text-sm font-bold underline hover:text-gray-600">
              View Federal Analysis
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div className="bg-white border-2 border-black p-6">
              <p className="text-3xl md:text-4xl font-bold">51</p>
              <p className="text-sm text-gray-600 mt-2">States & Territories</p>
            </div>
            <div className="bg-white border-2 border-black p-6">
              <p className="text-3xl md:text-4xl font-bold">61.4%</p>
              <p className="text-sm text-gray-600 mt-2">Avg FMAP Rate</p>
            </div>
            <div className="bg-white border-2 border-black p-6">
              <p className="text-3xl md:text-4xl font-bold">41</p>
              <p className="text-sm text-gray-600 mt-2">Expansion States</p>
            </div>
            <div className="bg-white border-2 border-black p-6">
              <p className="text-3xl md:text-4xl font-bold">436</p>
              <p className="text-sm text-gray-600 mt-2">Congressional Districts</p>
            </div>
          </div>
          <div className="grid md:grid-cols-2 gap-6">
            <Link href="/federal" className="block border-2 border-black p-6 hover:bg-black hover:text-white transition-colors group">
              <h3 className="text-xl font-bold mb-2">FMAP Analysis</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-300">
                Federal Medical Assistance Percentage rates by state, expansion status comparison, and trend analysis.
              </p>
            </Link>
            <Link href="/federal/analysis" className="block border-2 border-black p-6 hover:bg-black hover:text-white transition-colors group">
              <h3 className="text-xl font-bold mb-2">Federal AI Insights</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-300">
                Policy implications, key findings, and economist-grade analysis of federal Medicaid funding.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 px-4 border-t-2 border-black">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-8">
            Get Started
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Link href="/explore" className="block border-2 border-black p-6 hover:bg-black hover:text-white transition-colors group">
              <h3 className="text-xl font-bold mb-2">Explore Data</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-300">
                Search and filter through all 227M Medicaid provider spending records.
              </p>
            </Link>
            
            <div className="border-2 border-black p-6 bg-gray-50">
              <h3 className="text-xl font-bold mb-2">Provider Lookup</h3>
              <p className="text-sm text-gray-600 mb-4">
                Search by NPI number to see provider spending history.
              </p>
              <ProviderSearch />
            </div>
            
            <Link href="/analysis" className="block border-2 border-black p-6 hover:bg-black hover:text-white transition-colors group">
              <h3 className="text-xl font-bold mb-2">AI Analysis</h3>
              <p className="text-sm text-gray-600 group-hover:text-gray-300">
                Economist-grade insights generated from the full dataset.
              </p>
            </Link>
          </div>
        </div>
      </section>

      {/* Data Source */}
      <section className="border-t-2 border-black py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-sm text-gray-600">
            <strong>Data Source:</strong>{' '}
            <a 
              href="https://opendata.hhs.gov" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:text-black"
            >
              opendata.hhs.gov
            </a>
            {' '}— Medicaid Provider Utilization Data (2018-2024)
          </p>
          <p className="text-xs text-gray-400 mt-2">
            227,083,361 records | 10 GB | Full data analyzed — no sampling
          </p>
        </div>
      </section>
    </div>
  );
}
