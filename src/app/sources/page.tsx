'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface DataSource {
  id: string;
  name: string;
  url: string;
  description: string;
  dataType: string;
  lastUpdated?: string;
  coverage?: string;
}

export default function SourcesPage() {
  const [sources, setSources] = useState<DataSource[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/sources')
      .then(r => r.json())
      .then(data => setSources(data.sources))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-8 px-4"><div className="max-w-6xl mx-auto">
      <div className="border-2 border-black p-12 text-center animate-pulse">
        <p className="text-xl">Loading data sources...</p>
      </div>
    </div></div>
  );

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">DATA SOURCES</h1>
          <p className="text-gray-600 mt-2">
            Full transparency: every dataset used in DEVIN//HHS with links to original sources
          </p>
        </div>

        {/* Transparency Statement */}
        <div className="border-2 border-black p-6 mb-8 bg-gray-50">
          <h2 className="font-bold text-lg mb-3">Our Commitment to Transparency</h2>
          <p className="text-sm text-gray-700">
            All data in DEVIN//HHS comes from <strong>publicly available government sources</strong>. 
            We do not modify or interpret the underlying data — we aggregate and visualize it to make 
            it more accessible. Click any source link below to verify the data yourself.
          </p>
        </div>

        {/* Sources Grid */}
        <div className="space-y-6">
          {sources.map((source) => (
            <div key={source.id} className="border-2 border-black">
              <div className="bg-black text-white p-4">
                <h3 className="font-bold text-lg">{source.name}</h3>
                <p className="text-sm text-gray-300">{source.dataType}</p>
              </div>
              <div className="p-6">
                <p className="text-gray-700 mb-4">{source.description}</p>
                
                <div className="grid md:grid-cols-3 gap-4 text-sm mb-4">
                  {source.lastUpdated && (
                    <div className="bg-gray-50 p-3 border">
                      <p className="text-gray-500">Last Updated</p>
                      <p className="font-bold">{source.lastUpdated}</p>
                    </div>
                  )}
                  {source.coverage && (
                    <div className="bg-gray-50 p-3 border">
                      <p className="text-gray-500">Coverage</p>
                      <p className="font-bold">{source.coverage}</p>
                    </div>
                  )}
                  <div className="bg-gray-50 p-3 border">
                    <p className="text-gray-500">Used For</p>
                    <p className="font-bold">{source.dataType}</p>
                  </div>
                </div>

                <a 
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 border-2 border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition-colors"
                >
                  View Original Source
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Methodology Note */}
        <div className="border-2 border-black p-6 mt-8">
          <h3 className="font-bold mb-4">DATA PROCESSING METHODOLOGY</h3>
          <div className="text-sm text-gray-700 space-y-3">
            <p>
              <strong>Provider Spending:</strong> We aggregate 227 million individual payment records 
              from the HHS Medicaid Provider Utilization dataset. Records are grouped by provider NPI, 
              HCPCS code, state, and time period.
            </p>
            <p>
              <strong>Per-Capita Calculations:</strong> Total state spending divided by Census 2020 
              population. Z-scores calculated using standard statistical methods to identify outliers.
            </p>
            <p>
              <strong>Congressional District Estimates:</strong> State spending is distributed across 
              districts proportionally. This is an estimate, as granular district-level spending data 
              is not publicly available.
            </p>
            <p>
              <strong>FMAP Rates:</strong> Taken directly from CMS publications without modification.
            </p>
          </div>
        </div>

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t-2 border-black flex flex-wrap gap-4">
          <Link href="/federal" className="hover:underline font-bold">
            Federal Funding
          </Link>
          <Link href="/explore" className="hover:underline font-bold">
            Explore Data
          </Link>
          <Link href="/about" className="hover:underline font-bold">
            About
          </Link>
        </div>
      </div>
    </div>
  );
}
