'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, ReferenceLine
} from 'recharts';

interface StateOutlier {
  state: string;
  stateName: string;
  spending: number;
  population: number;
  perCapita: number;
  perCapitaZScore: number;
  fmap: number;
  expansionStatus: 'Y' | 'N';
  analogy: {
    probability: string;
    analogy: string;
    severity: string;
  };
  analysis: string;
}

interface OutlierData {
  summary: {
    totalStates: number;
    nationalPerCapita: number;
    standardDeviation: number;
    highOutliers: number;
    lowOutliers: number;
    topOutlier: string;
    bottomOutlier: string;
  };
  highOutliers: StateOutlier[];
  lowOutliers: StateOutlier[];
  allStates: StateOutlier[];
  census: {
    source: string;
    url: string;
    methodology: string;
    computedAt: string;
  };
}

export default function FederalOutliersPage() {
  const [data, setData] = useState<OutlierData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'high' | 'low' | 'all' | 'methodology'>('high');

  useEffect(() => {
    fetch('/api/federal/outliers')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v: number) => v >= 1e9 ? `$${(v/1e9).toFixed(1)}B` : v >= 1e6 ? `$${(v/1e6).toFixed(0)}M` : `$${v.toFixed(0)}`;
  const fmtPop = (v: number) => v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : `${(v/1e3).toFixed(0)}K`;

  if (loading) return (
    <div className="py-8 px-4"><div className="max-w-6xl mx-auto">
      <div className="border-2 border-black p-12 text-center animate-pulse">
        <p className="text-xl">Analyzing per-capita spending patterns...</p>
      </div>
    </div></div>
  );

  if (!data) return null;

  // Chart data
  const scatterData = data.allStates.map(s => ({
    x: s.population / 1e6,
    y: s.perCapita,
    z: Math.abs(s.perCapitaZScore) * 100,
    name: s.state,
    fullName: s.stateName,
    outlier: s.perCapitaZScore > 2 ? 'high' : s.perCapitaZScore < -1.5 ? 'low' : 'normal'
  }));

  const topOutliersChart = data.highOutliers.slice(0, 8).map(s => ({
    name: s.state,
    fullName: s.stateName,
    perCapita: s.perCapita,
    national: data.summary.nationalPerCapita,
    excess: s.perCapita - data.summary.nationalPerCapita
  }));

  const lowOutliersChart = data.lowOutliers.slice(0, 8).map(s => ({
    name: s.state,
    fullName: s.stateName,
    perCapita: s.perCapita,
    national: data.summary.nationalPerCapita,
    deficit: data.summary.nationalPerCapita - s.perCapita
  }));

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-start">
          <div>
            <div className="text-sm text-gray-500 mb-2">
              <Link href="/federal" className="hover:underline">Federal Funding</Link> / Outliers
            </div>
            <h1 className="text-3xl md:text-4xl font-bold">PER-CAPITA SPENDING OUTLIERS</h1>
            <p className="text-gray-600 mt-2">
              Statistical analysis of Medicaid spending per person using Census 2020 population data
            </p>
          </div>
        </div>

        {/* Explainer Box */}
        <div className="border-2 border-black p-6 mb-8 bg-gray-50">
          <h2 className="font-bold text-lg mb-3">What This Analysis Shows</h2>
          <p className="text-sm text-gray-700 mb-4">
            We divided each state&apos;s total Medicaid spending by its Census population to get 
            <strong> per-capita spending</strong> — how much is spent per person in each state. 
            States significantly above or below the national average of <strong>${data.summary.nationalPerCapita.toLocaleString()}</strong> per 
            person are flagged as outliers.
          </p>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-3 border">
              <p className="font-bold">High Outliers (z &gt; 2.0)</p>
              <p className="text-gray-600">Spending significantly above average — may indicate generous benefits, high costs, or unique demographics</p>
            </div>
            <div className="bg-white p-3 border">
              <p className="font-bold">Low Outliers (z &lt; -1.5)</p>
              <p className="text-gray-600">Spending significantly below average — may indicate restricted eligibility or younger populations</p>
            </div>
            <div className="bg-white p-3 border">
              <p className="font-bold">Z-Score</p>
              <p className="text-gray-600">Measures how many standard deviations from average. |z| &gt; 2 is statistically unusual.</p>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="border-2 border-black p-4">
            <p className="text-sm text-gray-500">National Average</p>
            <p className="text-2xl font-bold">${data.summary.nationalPerCapita.toLocaleString()}</p>
            <p className="text-xs text-gray-500">per person</p>
          </div>
          <div className="border-2 border-black p-4">
            <p className="text-sm text-gray-500">Std Deviation</p>
            <p className="text-2xl font-bold">${data.summary.standardDeviation.toLocaleString()}</p>
            <p className="text-xs text-gray-500">spread around average</p>
          </div>
          <div className="border-2 border-black p-4 bg-gray-100">
            <p className="text-sm text-gray-500">High Outliers</p>
            <p className="text-2xl font-bold">{data.summary.highOutliers}</p>
            <p className="text-xs text-gray-500">states above z=2</p>
          </div>
          <div className="border-2 border-black p-4 bg-gray-100">
            <p className="text-sm text-gray-500">Low Outliers</p>
            <p className="text-2xl font-bold">{data.summary.lowOutliers}</p>
            <p className="text-xs text-gray-500">states below z=-1.5</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['high', 'low', 'all', 'methodology'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-bold border-2 border-black ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              {tab === 'high' ? 'High Spenders' : tab === 'low' ? 'Low Spenders' : tab === 'all' ? 'All States' : 'Methodology'}
            </button>
          ))}
        </div>

        {/* High Outliers Tab */}
        {activeTab === 'high' && (
          <div className="space-y-6">
            {/* Chart */}
            <div className="border-2 border-black p-6">
              <h3 className="font-bold mb-2">STATES SPENDING ABOVE AVERAGE</h3>
              <p className="text-xs text-gray-500 mb-4">Per-capita spending vs national average of ${data.summary.nationalPerCapita.toLocaleString()}</p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={topOutliersChart} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip 
                    formatter={(v) => `$${Number(v).toLocaleString()}`}
                    labelFormatter={(label) => {
                      const item = topOutliersChart.find(d => d.name === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <ReferenceLine x={data.summary.nationalPerCapita} stroke="#999" strokeDasharray="5 5" label="Avg" />
                  <Bar dataKey="perCapita" fill="#000000" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="border-2 border-black">
              <div className="bg-gray-50 p-4 border-b-2 border-black">
                <h3 className="font-bold">HIGH SPENDING OUTLIERS</h3>
                <p className="text-xs text-gray-500">States with per-capita spending more than 2 standard deviations above average</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="p-3 text-left">State</th>
                      <th className="p-3 text-right">Per Capita</th>
                      <th className="p-3 text-right">Z-Score</th>
                      <th className="p-3 text-right">Population</th>
                      <th className="p-3 text-left">Analysis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.highOutliers.map((s, i) => (
                      <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3">
                          <span className="font-bold">{s.stateName}</span>
                          <span className="text-gray-500 ml-2">({s.state})</span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold">${s.perCapita.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <span className="bg-gray-200 px-2 py-1 font-mono">+{s.perCapitaZScore}</span>
                        </td>
                        <td className="p-3 text-right">{fmtPop(s.population)}</td>
                        <td className="p-3 text-xs text-gray-600 max-w-xs">{s.analysis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Analogies */}
            <div className="border-2 border-black p-6">
              <h3 className="font-bold mb-4">PROBABILITY CONTEXT</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {data.highOutliers.slice(0, 4).map(s => (
                  <div key={s.state} className="bg-gray-50 p-4 border">
                    <p className="font-bold">{s.stateName}: z = +{s.perCapitaZScore}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      Probability: <strong>{s.analogy.probability}</strong>
                    </p>
                    <p className="text-xs text-gray-500 mt-1 italic">
                      &quot;{s.analogy.analogy}&quot;
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Low Outliers Tab */}
        {activeTab === 'low' && (
          <div className="space-y-6">
            {/* Chart */}
            <div className="border-2 border-black p-6">
              <h3 className="font-bold mb-2">STATES SPENDING BELOW AVERAGE</h3>
              <p className="text-xs text-gray-500 mb-4">Per-capita spending vs national average of ${data.summary.nationalPerCapita.toLocaleString()}</p>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={lowOutliersChart} layout="vertical" margin={{ left: 30 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`} />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip 
                    formatter={(v) => `$${Number(v).toLocaleString()}`}
                    labelFormatter={(label) => {
                      const item = lowOutliersChart.find(d => d.name === label);
                      return item ? item.fullName : label;
                    }}
                  />
                  <ReferenceLine x={data.summary.nationalPerCapita} stroke="#999" strokeDasharray="5 5" label="Avg" />
                  <Bar dataKey="perCapita" fill="#666666" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Table */}
            <div className="border-2 border-black">
              <div className="bg-gray-50 p-4 border-b-2 border-black">
                <h3 className="font-bold">LOW SPENDING OUTLIERS</h3>
                <p className="text-xs text-gray-500">States with per-capita spending more than 1.5 standard deviations below average</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-black text-white">
                    <tr>
                      <th className="p-3 text-left">State</th>
                      <th className="p-3 text-right">Per Capita</th>
                      <th className="p-3 text-right">Z-Score</th>
                      <th className="p-3 text-center">Expanded?</th>
                      <th className="p-3 text-left">Analysis</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.lowOutliers.map((s, i) => (
                      <tr key={s.state} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="p-3">
                          <span className="font-bold">{s.stateName}</span>
                          <span className="text-gray-500 ml-2">({s.state})</span>
                        </td>
                        <td className="p-3 text-right font-mono font-bold">${s.perCapita.toLocaleString()}</td>
                        <td className="p-3 text-right">
                          <span className="bg-gray-200 px-2 py-1 font-mono">{s.perCapitaZScore}</span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`px-2 py-1 text-xs ${s.expansionStatus === 'Y' ? 'bg-gray-200' : 'bg-red-100'}`}>
                            {s.expansionStatus === 'Y' ? 'Yes' : 'No'}
                          </span>
                        </td>
                        <td className="p-3 text-xs text-gray-600 max-w-xs">{s.analysis}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* All States Tab */}
        {activeTab === 'all' && (
          <div className="space-y-6">
            {/* Scatter Plot */}
            <div className="border-2 border-black p-6">
              <h3 className="font-bold mb-2">POPULATION VS PER-CAPITA SPENDING</h3>
              <p className="text-xs text-gray-500 mb-4">Each dot is a state. Larger dots = higher z-score (more unusual)</p>
              <ResponsiveContainer width="100%" height={400}>
                <ScatterChart margin={{ bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Population" 
                    tickFormatter={(v) => `${v}M`}
                    label={{ value: 'Population (millions)', position: 'bottom', offset: 0 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Per Capita" 
                    tickFormatter={(v) => `$${(v/1000).toFixed(0)}K`}
                  />
                  <ZAxis type="number" dataKey="z" range={[50, 400]} />
                  <Tooltip 
                    formatter={(value, name) => {
                      if (name === 'Population') return `${value}M`;
                      if (name === 'Per Capita') return `$${Number(value).toLocaleString()}`;
                      return value;
                    }}
                    labelFormatter={(_, payload) => {
                      const item = payload?.[0]?.payload;
                      return item ? item.fullName : '';
                    }}
                  />
                  <ReferenceLine y={data.summary.nationalPerCapita} stroke="#999" strokeDasharray="5 5" />
                  <Scatter name="States" data={scatterData}>
                    {scatterData.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.outlier === 'high' ? '#000000' : entry.outlier === 'low' ? '#999999' : '#CCCCCC'} 
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>

            {/* Full Table */}
            <div className="border-2 border-black">
              <div className="bg-gray-50 p-4 border-b-2 border-black">
                <h3 className="font-bold">ALL STATES RANKED BY PER-CAPITA SPENDING</h3>
              </div>
              <div className="overflow-x-auto max-h-96">
                <table className="w-full text-sm">
                  <thead className="bg-black text-white sticky top-0">
                    <tr>
                      <th className="p-2 text-left">#</th>
                      <th className="p-2 text-left">State</th>
                      <th className="p-2 text-right">Per Capita</th>
                      <th className="p-2 text-right">Z-Score</th>
                      <th className="p-2 text-right">Total Spending</th>
                      <th className="p-2 text-right">Population</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.allStates.map((s, i) => (
                      <tr 
                        key={s.state} 
                        className={`${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'} ${s.perCapitaZScore > 2 ? 'font-bold' : s.perCapitaZScore < -1.5 ? 'text-gray-500' : ''}`}
                      >
                        <td className="p-2">{i + 1}</td>
                        <td className="p-2">{s.stateName}</td>
                        <td className="p-2 text-right font-mono">${s.perCapita.toLocaleString()}</td>
                        <td className="p-2 text-right font-mono">
                          {s.perCapitaZScore > 0 ? '+' : ''}{s.perCapitaZScore}
                        </td>
                        <td className="p-2 text-right">{fmt(s.spending)}</td>
                        <td className="p-2 text-right">{fmtPop(s.population)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Methodology Tab */}
        {activeTab === 'methodology' && (
          <div className="space-y-6">
            <div className="border-2 border-black p-6">
              <h3 className="font-bold text-lg mb-4">DATA SOURCES</h3>
              <div className="space-y-4 text-sm">
                <div className="bg-gray-50 p-4 border">
                  <p className="font-bold">Medicaid Spending Data</p>
                  <p className="text-gray-600">HHS Open Data - Medicaid Provider Utilization</p>
                  <p className="text-gray-500 text-xs mt-1">227 million individual payment records aggregated by state</p>
                </div>
                <div className="bg-gray-50 p-4 border">
                  <p className="font-bold">Population Data</p>
                  <p className="text-gray-600">{data.census.source}</p>
                  <a href={data.census.url} className="text-blue-600 hover:underline text-xs" target="_blank" rel="noopener noreferrer">
                    {data.census.url}
                  </a>
                </div>
              </div>
            </div>

            <div className="border-2 border-black p-6">
              <h3 className="font-bold text-lg mb-4">METHODOLOGY</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-bold">Per-Capita Calculation</p>
                  <p className="text-gray-600 font-mono bg-gray-50 p-2 mt-1">
                    Per Capita = Total State Medicaid Spending / Census 2020 Population
                  </p>
                </div>
                <div>
                  <p className="font-bold">Z-Score Calculation</p>
                  <p className="text-gray-600 font-mono bg-gray-50 p-2 mt-1">
                    Z = (State Per Capita - National Average) / Standard Deviation
                  </p>
                  <p className="text-gray-500 text-xs mt-1">
                    National Average: ${data.summary.nationalPerCapita.toLocaleString()} | 
                    Std Dev: ${data.summary.standardDeviation.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="font-bold">Outlier Thresholds</p>
                  <ul className="text-gray-600 list-disc ml-6 mt-1">
                    <li><strong>High Outlier:</strong> Z-score &gt; 2.0 (top ~2.5% of distribution)</li>
                    <li><strong>Low Outlier:</strong> Z-score &lt; -1.5 (bottom ~7% of distribution)</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-2 border-black p-6">
              <h3 className="font-bold text-lg mb-4">LIMITATIONS</h3>
              <ul className="text-sm text-gray-600 list-disc ml-6 space-y-2">
                <li>Census 2020 data may not reflect current population distributions</li>
                <li>Medicaid spending reflects provider billing, not actual healthcare utilization</li>
                <li>Per-capita figures don&apos;t account for differences in cost of living or healthcare costs</li>
                <li>Some states have different eligibility criteria, affecting who qualifies for Medicaid</li>
                <li>Expansion states cover more adults, which affects both spending and per-capita figures</li>
              </ul>
            </div>
          </div>
        )}

        {/* Footer Links */}
        <div className="mt-8 pt-6 border-t-2 border-black flex flex-wrap gap-4">
          <Link href="/federal" className="hover:underline font-bold">
            Back to Federal Overview
          </Link>
          <Link href="/federal/analysis" className="hover:underline font-bold">
            Federal AI Analysis
          </Link>
          <Link href="/outliers" className="hover:underline font-bold">
            Provider Outliers
          </Link>
        </div>
      </div>
    </div>
  );
}
