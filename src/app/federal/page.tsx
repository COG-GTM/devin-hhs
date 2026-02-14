'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend
} from 'recharts';

interface FMAPData {
  stateCode: string;
  stateName: string;
  fy2024: number;
  fy2023: number;
  fy2022: number;
  expansionStatus: 'Y' | 'N';
}

interface DistrictSpending {
  districtCode: string;
  stateCode: string;
  spending: number;
  zScore: number;
}

interface FederalData {
  summary: {
    totalStates: number;
    expansionStates: number;
    nonExpansionStates: number;
    avgFMAP: number;
    totalDistricts: number;
  };
  statesByFMAP: FMAPData[];
  topDistricts: DistrictSpending[];
  expansionAnalysis: {
    expansionCount: number;
    nonExpansionCount: number;
    avgExpansionFMAP: number;
    avgNonExpansionFMAP: number;
  };
}

const COLORS = ['#000000', '#666666', '#999999', '#CCCCCC'];

export default function FederalPage() {
  const [data, setData] = useState<FederalData | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'states' | 'districts' | 'charts'>('overview');

  useEffect(() => {
    fetch('/api/federal')
      .then(r => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v: number) => v >= 1e9 ? `$${(v/1e9).toFixed(1)}B` : v >= 1e6 ? `$${(v/1e6).toFixed(1)}M` : `$${v.toFixed(0)}`;

  if (loading) return (
    <div className="py-8 px-4"><div className="max-w-6xl mx-auto">
      <div className="border-2 border-black p-12 text-center animate-pulse">
        <p className="text-xl">Loading federal funding data...</p>
      </div>
    </div></div>
  );

  if (!data) return null;

  // Prepare chart data
  const top10FMAP = data.statesByFMAP.slice(0, 10).map(s => ({
    name: s.stateCode,
    fmap: s.fy2024,
    expansion: s.expansionStatus === 'Y' ? 'Expansion' : 'Non-Expansion'
  }));

  const expansionPieData = [
    { name: 'Expansion States', value: data.expansionAnalysis.expansionCount },
    { name: 'Non-Expansion', value: data.expansionAnalysis.nonExpansionCount }
  ];

  const fmapTrendData = data.statesByFMAP.slice(0, 5).map(s => ({
    name: s.stateCode,
    'FY2022': s.fy2022,
    'FY2023': s.fy2023,
    'FY2024': s.fy2024
  }));

  const expansionComparison = [
    { name: 'Expansion States', avgFMAP: data.expansionAnalysis.avgExpansionFMAP },
    { name: 'Non-Expansion', avgFMAP: data.expansionAnalysis.avgNonExpansionFMAP }
  ];

  const top10Districts = data.topDistricts.slice(0, 10).map(d => ({
    name: d.districtCode,
    spending: d.spending / 1e9,
    zScore: d.zScore
  }));

  // FMAP distribution buckets
  const fmapDistribution = [
    { range: '50-55%', count: data.statesByFMAP.filter(s => s.fy2024 >= 50 && s.fy2024 < 55).length },
    { range: '55-60%', count: data.statesByFMAP.filter(s => s.fy2024 >= 55 && s.fy2024 < 60).length },
    { range: '60-65%', count: data.statesByFMAP.filter(s => s.fy2024 >= 60 && s.fy2024 < 65).length },
    { range: '65-70%', count: data.statesByFMAP.filter(s => s.fy2024 >= 65 && s.fy2024 < 70).length },
    { range: '70-75%', count: data.statesByFMAP.filter(s => s.fy2024 >= 70 && s.fy2024 < 75).length },
    { range: '75-80%', count: data.statesByFMAP.filter(s => s.fy2024 >= 75 && s.fy2024 < 80).length },
  ];

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold">FEDERAL FUNDING</h1>
            <p className="text-gray-600 mt-2">FMAP rates and congressional district analysis</p>
          </div>
          <Link 
            href="/federal/analysis"
            className="border-2 border-black px-4 py-2 font-bold hover:bg-black hover:text-white transition-colors"
          >
            AI Analysis
          </Link>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="border-2 border-black p-4">
            <p className="text-sm text-gray-500">States + DC</p>
            <p className="text-2xl font-bold">{data.summary.totalStates}</p>
          </div>
          <div className="border-2 border-black p-4">
            <p className="text-sm text-gray-500">Avg FMAP</p>
            <p className="text-2xl font-bold">{data.summary.avgFMAP}%</p>
          </div>
          <div className="border-2 border-black p-4">
            <p className="text-sm text-gray-500">Expansion</p>
            <p className="text-2xl font-bold">{data.summary.expansionStates}</p>
          </div>
          <div className="border-2 border-black p-4">
            <p className="text-sm text-gray-500">Non-Expansion</p>
            <p className="text-2xl font-bold">{data.summary.nonExpansionStates}</p>
          </div>
          <div className="border-2 border-black p-4">
            <p className="text-sm text-gray-500">Districts</p>
            <p className="text-2xl font-bold">{data.summary.totalDistricts}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(['overview', 'charts', 'states', 'districts'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-bold border-2 border-black ${activeTab === tab ? 'bg-black text-white' : 'hover:bg-gray-100'}`}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Expansion Analysis */}
            <div className="border-2 border-black p-6">
              <h2 className="font-bold mb-4">MEDICAID EXPANSION ANALYSIS</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-100 p-4 border border-gray-300">
                  <p className="text-sm text-gray-700">Expansion States ({data.expansionAnalysis.expansionCount})</p>
                  <p className="text-2xl font-bold">{data.expansionAnalysis.avgExpansionFMAP.toFixed(1)}% avg FMAP</p>
                </div>
                <div className="bg-gray-50 p-4 border border-gray-300">
                  <p className="text-sm text-gray-700">Non-Expansion States ({data.expansionAnalysis.nonExpansionCount})</p>
                  <p className="text-2xl font-bold">{data.expansionAnalysis.avgNonExpansionFMAP.toFixed(1)}% avg FMAP</p>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border-2 border-black p-6">
                <h3 className="font-bold mb-4">HIGHEST FMAP RATES (FY2024)</h3>
                <div className="space-y-2">
                  {data.statesByFMAP.slice(0, 5).map((s, i) => (
                    <div key={s.stateCode} className="flex justify-between items-center border-b pb-2">
                      <span className="font-mono">{i+1}. {s.stateName}</span>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 ${s.expansionStatus === 'Y' ? 'bg-gray-200' : 'bg-gray-100'}`}>
                          {s.expansionStatus === 'Y' ? 'EXP' : 'NON'}
                        </span>
                        <span className="font-bold">{s.fy2024}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-2 border-black p-6">
                <h3 className="font-bold mb-4">TOP DISTRICTS BY SPENDING</h3>
                <div className="space-y-2">
                  {data.topDistricts.slice(0, 5).map((d, i) => (
                    <div key={d.districtCode} className="flex justify-between items-center border-b pb-2">
                      <span className="font-mono">{i+1}. {d.districtCode}</span>
                      <span className="font-bold">{fmt(d.spending)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Charts Tab */}
        {activeTab === 'charts' && (
          <div className="space-y-8">
            {/* Row 1: FMAP Charts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Top 10 FMAP */}
              <div className="border-2 border-black p-6">
                <h3 className="font-bold mb-4">TOP 10 STATES BY FMAP RATE</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={top10FMAP} layout="vertical" margin={{ left: 40 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" domain={[50, 80]} tickFormatter={(v) => `${v}%`} />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(v) => v != null ? `${v}%` : ""} />
                    <Bar dataKey="fmap" fill="#000000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Expansion Pie */}
              <div className="border-2 border-black p-6">
                <h3 className="font-bold mb-4">EXPANSION STATUS</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={expansionPieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={100}
                      fill="#000"
                      dataKey="value"
                      label={({ name, value }) => `${name}: ${value}`}
                    >
                      {expansionPieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 2: Trend and Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* FMAP Trend */}
              <div className="border-2 border-black p-6">
                <h3 className="font-bold mb-4">FMAP TREND (TOP 5 STATES)</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={fmapTrendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[70, 82]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v) => v != null ? `${v}%` : ""} />
                    <Legend />
                    <Line type="monotone" dataKey="FY2022" stroke="#999999" strokeWidth={2} />
                    <Line type="monotone" dataKey="FY2023" stroke="#666666" strokeWidth={2} />
                    <Line type="monotone" dataKey="FY2024" stroke="#000000" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Expansion Comparison */}
              <div className="border-2 border-black p-6">
                <h3 className="font-bold mb-4">AVG FMAP: EXPANSION VS NON-EXPANSION</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={expansionComparison}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis domain={[50, 75]} tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v) => v != null ? `${Number(v).toFixed(1)}%` : ""} />
                    <Bar dataKey="avgFMAP" fill="#000000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Row 3: Distribution and Districts */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* FMAP Distribution */}
              <div className="border-2 border-black p-6">
                <h3 className="font-bold mb-4">FMAP DISTRIBUTION</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={fmapDistribution}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#000000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Top Districts */}
              <div className="border-2 border-black p-6">
                <h3 className="font-bold mb-4">TOP 10 DISTRICTS BY SPENDING</h3>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={top10Districts} layout="vertical" margin={{ left: 50 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={(v) => `$${v}B`} />
                    <YAxis type="category" dataKey="name" />
                    <Tooltip formatter={(v) => v != null ? `$${Number(v).toFixed(2)}B` : ""} />
                    <Bar dataKey="spending" fill="#000000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}

        {/* States Tab */}
        {activeTab === 'states' && (
          <div className="border-2 border-black">
            <div className="bg-gray-50 p-4 border-b-2 border-black">
              <h2 className="font-bold">ALL STATES BY FMAP RATE</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-3 text-left">State</th>
                    <th className="p-3 text-right">FY2024</th>
                    <th className="p-3 text-right">FY2023</th>
                    <th className="p-3 text-right">FY2022</th>
                    <th className="p-3 text-center">Expansion</th>
                  </tr>
                </thead>
                <tbody>
                  {data.statesByFMAP.map((s, i) => (
                    <tr key={s.stateCode} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3 font-mono">{s.stateName}</td>
                      <td className="p-3 text-right font-bold">{s.fy2024}%</td>
                      <td className="p-3 text-right">{s.fy2023}%</td>
                      <td className="p-3 text-right">{s.fy2022}%</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-1 text-xs ${s.expansionStatus === 'Y' ? 'bg-gray-200' : 'bg-gray-100'}`}>
                          {s.expansionStatus === 'Y' ? 'Yes' : 'No'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Districts Tab */}
        {activeTab === 'districts' && (
          <div className="border-2 border-black">
            <div className="bg-gray-50 p-4 border-b-2 border-black">
              <h2 className="font-bold">CONGRESSIONAL DISTRICTS BY SPENDING</h2>
              <p className="text-sm text-gray-600">State spending distributed proportionally across districts</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-black text-white">
                  <tr>
                    <th className="p-3 text-left">Rank</th>
                    <th className="p-3 text-left">District</th>
                    <th className="p-3 text-right">Spending</th>
                    <th className="p-3 text-right">Z-Score</th>
                  </tr>
                </thead>
                <tbody>
                  {data.topDistricts.slice(0, 50).map((d, i) => (
                    <tr key={d.districtCode} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="p-3">{i + 1}</td>
                      <td className="p-3 font-mono">{d.districtCode}</td>
                      <td className="p-3 text-right font-bold">{fmt(d.spending)}</td>
                      <td className="p-3 text-right">
                        {d.zScore > 3 ? (
                          <span className="bg-gray-200 px-2 py-1">{d.zScore}σ</span>
                        ) : (
                          <span>{d.zScore}σ</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Methodology */}
        <div className="border-2 border-black p-4 mt-8 bg-gray-50">
          <h3 className="font-bold mb-2">Methodology</h3>
          <p className="text-sm text-gray-600">
            FMAP (Federal Medical Assistance Percentage) rates from CMS determine the federal share of Medicaid costs.
            District spending is estimated by distributing state totals proportionally across congressional districts.
            Data sources: CMS FMAP rates (FY2022-2024), Census congressional district boundaries, HHS Medicaid spending data.
          </p>
        </div>
      </div>
    </div>
  );
}
