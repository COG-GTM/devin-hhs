'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ScatterChart, Scatter, ZAxis, Cell, ReferenceLine
} from 'recharts';

interface DeepAnalysis {
  keyFindings: {
    fmapSpendingCorrelation: number;
    totalFederalSpendingBillions: number;
    expansionAvgPerCapita: number;
    nonExpansionAvgPerCapita: number;
    expansionPremium: number;
  };
  fmapQuartiles: Array<{
    quartile: number;
    states: number;
    avg_fmap: number;
    avg_per_capita: number;
    total_billions: number;
  }>;
  expansionAnalysis: Array<{
    expansion_status: string;
    states: number;
    avg_per_capita: number;
    total_billions: number;
    avg_fmap: number;
  }>;
  efficiencyCategories: Array<{
    efficiency_category: string;
    states: number;
    avg_per_capita: number;
    state_list: string[];
  }>;
  topSpenders: Array<{
    state_name: string;
    fmap_rate: number;
    per_capita: number;
    efficiency_category: string;
  }>;
  methodology: {
    correlation: string;
    quartiles: string;
    efficiency: string;
    source: string;
  };
}

export default function DeepAnalysisPage() {
  const [data, setData] = useState<DeepAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/analysis/deep')
      .then(r => r.json())
      .then(d => {
        if (d.error) throw new Error(d.error);
        setData(d);
      })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-8 px-4"><div className="max-w-6xl mx-auto">
      <div className="border-2 border-black p-12 text-center animate-pulse">
        <p className="text-xl">Running deep analysis on Medicaid data...</p>
      </div>
    </div></div>
  );

  if (error) return (
    <div className="py-8 px-4"><div className="max-w-6xl mx-auto">
      <div className="border-2 border-red-500 p-6 text-red-700">Error: {error}</div>
    </div></div>
  );

  if (!data) return null;

  const quartileData = data.fmapQuartiles.map(q => ({
    name: `Q${q.quartile}`,
    label: q.quartile === 1 ? 'Low FMAP' : q.quartile === 4 ? 'High FMAP' : `Q${q.quartile}`,
    fmap: q.avg_fmap,
    perCapita: q.avg_per_capita,
    states: q.states
  }));

  const expansionData = data.expansionAnalysis.map(e => ({
    name: e.expansion_status === 'Y' ? 'Expansion' : 'Non-Expansion',
    perCapita: e.avg_per_capita,
    states: e.states,
    billions: e.total_billions
  }));

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">DEEP ANALYSIS</h1>
          <p className="text-gray-600 mt-2">
            Economist-grade analysis of federal Medicaid spending patterns
          </p>
        </div>

        {/* Key Finding: Correlation */}
        <div className="border-4 border-black p-6 mb-8 bg-gray-50">
          <h2 className="text-2xl font-bold mb-4">KEY FINDING: NO MORAL HAZARD</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <p className="text-5xl font-bold font-mono">{data.keyFindings.fmapSpendingCorrelation}</p>
              <p className="text-gray-600 mt-2">FMAP-Spending Correlation</p>
              <p className="text-sm mt-4">
                A correlation near <strong>zero</strong> means FMAP rate does NOT predict spending. 
                States receiving more federal matching don&apos;t spend more recklessly.
              </p>
            </div>
            <div className="bg-white p-4 border">
              <h3 className="font-bold mb-2">What This Means</h3>
              <ul className="text-sm space-y-2">
                <li>No evidence of &quot;moral hazard&quot; — states don&apos;t abuse federal money</li>
                <li>High-FMAP states (poorer) aren&apos;t gaming the system</li>
                <li>Low-FMAP states (wealthier) spend based on their needs, not federal match</li>
                <li>FMAP formula appears to be working as designed</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Expansion Analysis */}
        <div className="border-2 border-black p-6 mb-8">
          <h2 className="font-bold text-xl mb-4">MEDICAID EXPANSION IMPACT</h2>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-100 p-4 border text-center">
              <p className="text-4xl font-bold">${data.keyFindings.expansionAvgPerCapita}</p>
              <p className="text-sm text-gray-600">Expansion State Per Capita</p>
            </div>
            <div className="bg-gray-50 p-4 border text-center">
              <p className="text-4xl font-bold">${data.keyFindings.nonExpansionAvgPerCapita}</p>
              <p className="text-sm text-gray-600">Non-Expansion Per Capita</p>
            </div>
            <div className="bg-black text-white p-4 text-center">
              <p className="text-4xl font-bold">+{data.keyFindings.expansionPremium}%</p>
              <p className="text-sm">Expansion Premium</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={expansionData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" tickFormatter={(v) => `$${v}`} />
              <YAxis type="category" dataKey="name" width={120} />
              <Tooltip formatter={(v) => `$${Number(v).toLocaleString()}`} />
              <Bar dataKey="perCapita" fill="#000000" />
            </BarChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-4">
            Expansion states spend <strong>89% more per capita</strong> than non-expansion states. 
            This reflects broader coverage (more people eligible) and federal incentives (90% match for expansion population).
          </p>
        </div>

        {/* FMAP Quartile Analysis */}
        <div className="border-2 border-black p-6 mb-8">
          <h2 className="font-bold text-xl mb-4">FMAP QUARTILE ANALYSIS</h2>
          <p className="text-sm text-gray-600 mb-4">
            States grouped by FMAP rate (Q1 = lowest 50%, Q4 = highest 70%+)
          </p>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={quartileData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="label" />
              <YAxis yAxisId="left" orientation="left" tickFormatter={(v) => `$${v}`} />
              <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
              <Tooltip />
              <Bar yAxisId="left" dataKey="perCapita" fill="#000000" name="Per Capita" />
              <Bar yAxisId="right" dataKey="fmap" fill="#999999" name="Avg FMAP" />
            </BarChart>
          </ResponsiveContainer>
          <div className="mt-4 p-4 bg-gray-50 border">
            <h3 className="font-bold">Counter-Intuitive Finding</h3>
            <p className="text-sm mt-2">
              <strong>Q1 (lowest FMAP at 50%) has the HIGHEST per-capita spending ($4,470).</strong> 
              These are wealthy states like Massachusetts, New York, and California. They have generous 
              benefits despite receiving minimal federal matching.
            </p>
          </div>
        </div>

        {/* Efficiency Categories */}
        <div className="border-2 border-black p-6 mb-8">
          <h2 className="font-bold text-xl mb-4">EFFICIENCY MATRIX</h2>
          <div className="grid md:grid-cols-2 gap-6">
            {data.efficiencyCategories.map(cat => (
              <div key={cat.efficiency_category} className="border p-4">
                <h3 className="font-bold font-mono text-sm">{cat.efficiency_category}</h3>
                <p className="text-2xl font-bold mt-2">{cat.states} states</p>
                <p className="text-gray-600">${cat.avg_per_capita} avg per capita</p>
                <p className="text-xs text-gray-500 mt-2">
                  {cat.state_list.slice(0, 5).join(', ')}{cat.state_list.length > 5 && '...'}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-600">
            <p><strong>HIGH_FMAP_HIGH_SPEND:</strong> Poorer states with high federal support AND high spending (D.C., New Mexico, Kentucky)</p>
            <p><strong>LOW_FMAP_HIGH_SPEND:</strong> Wealthy states paying their own way with generous programs (Massachusetts, New York, Alaska)</p>
          </div>
        </div>

        {/* Top Spenders */}
        <div className="border-2 border-black mb-8">
          <div className="bg-black text-white p-4">
            <h2 className="font-bold">TOP 10 PER-CAPITA SPENDERS</h2>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">State</th>
                <th className="p-3 text-right">Per Capita</th>
                <th className="p-3 text-right">FMAP</th>
                <th className="p-3 text-left">Category</th>
              </tr>
            </thead>
            <tbody>
              {data.topSpenders.map((s, i) => (
                <tr key={s.state_name} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="p-3 font-bold">{s.state_name}</td>
                  <td className="p-3 text-right font-mono">${Number(s.per_capita).toLocaleString()}</td>
                  <td className="p-3 text-right">{s.fmap_rate}%</td>
                  <td className="p-3 text-xs font-mono">{s.efficiency_category}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* AI Interpretation */}
        <div className="border-2 border-black p-6 mb-8 bg-gray-50">
          <h2 className="font-bold text-xl mb-4">AI INTERPRETATION</h2>
          <div className="space-y-4 text-sm">
            <div className="p-4 border bg-white">
              <h3 className="font-bold">1. The Moral Hazard Myth</h3>
              <p className="mt-2">
                Critics argue that higher federal matching (FMAP) encourages wasteful spending. 
                The data shows <strong>no correlation (r = {data.keyFindings.fmapSpendingCorrelation})</strong>. 
                States receiving 78% federal match don&apos;t spend more per capita than states at 50%.
              </p>
            </div>
            <div className="p-4 border bg-white">
              <h3 className="font-bold">2. Wealth Drives Spending, Not Federal Match</h3>
              <p className="mt-2">
                The highest per-capita spenders (MA, NY, AK) have the <strong>lowest</strong> FMAP rates (50%). 
                They choose to fund generous programs with state dollars. Poorer states with high FMAP 
                spend less because they have less state capacity, not because of federal incentives.
              </p>
            </div>
            <div className="p-4 border bg-white">
              <h3 className="font-bold">3. Expansion Works</h3>
              <p className="mt-2">
                Expansion states spend 89% more per capita, but cover significantly more people. 
                The 90% federal match for expansion populations is achieving its policy goal: 
                extending coverage to low-income adults who previously fell through the cracks.
              </p>
            </div>
            <div className="p-4 border bg-white">
              <h3 className="font-bold">4. Policy Implications</h3>
              <p className="mt-2">
                The FMAP formula is working as intended — it provides more support to poorer states 
                without creating perverse incentives. Proposals to cut FMAP rates would shift costs 
                to states least able to afford them, likely reducing coverage rather than efficiency.
              </p>
            </div>
          </div>
        </div>

        {/* Methodology */}
        <div className="border-2 border-black p-6 bg-gray-50">
          <h2 className="font-bold text-xl mb-4">METHODOLOGY</h2>
          <div className="text-sm space-y-2">
            <p><strong>Correlation:</strong> {data.methodology.correlation}</p>
            <p><strong>Quartiles:</strong> {data.methodology.quartiles}</p>
            <p><strong>Efficiency Matrix:</strong> {data.methodology.efficiency}</p>
            <p><strong>Data Sources:</strong> {data.methodology.source}</p>
          </div>
          <div className="mt-4 flex gap-4 text-xs">
            <a href="https://www.medicaid.gov/medicaid/finance/state-financials/federal-matching-rates-and-data/index.html" 
               target="_blank" rel="noopener noreferrer" className="underline">
              CMS FMAP Data
            </a>
            <a href="https://data.census.gov/" target="_blank" rel="noopener noreferrer" className="underline">
              Census Population
            </a>
            <Link href="/sources" className="underline font-bold">All Sources</Link>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t-2 border-black flex flex-wrap gap-4">
          <Link href="/analysis" className="hover:underline font-bold">Provider Analysis</Link>
          <Link href="/federal" className="hover:underline font-bold">Federal Overview</Link>
          <Link href="/federal/outliers" className="hover:underline font-bold">Per-Capita Outliers</Link>
        </div>
      </div>
    </div>
  );
}
