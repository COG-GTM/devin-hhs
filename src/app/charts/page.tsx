'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from 'recharts';

const COLORS = ['#000', '#1a1a1a', '#333', '#4d4d4d', '#666', '#808080', '#999', '#b3b3b3'];
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function ChartsPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/charts')
      .then(r => r.json())
      .then(d => { if (d.error) throw new Error(d.error); setData(d); })
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const fmt = (v: number) => v >= 1e9 ? `$${(v/1e9).toFixed(1)}B` : v >= 1e6 ? `$${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `$${(v/1e3).toFixed(0)}K` : `$${v.toFixed(0)}`;
  const fmtNum = (v: number) => v >= 1e6 ? `${(v/1e6).toFixed(1)}M` : v >= 1e3 ? `${(v/1e3).toFixed(0)}K` : v.toString();

  const CodeTooltip = ({ code, definition, category }: { code: string; definition: string; category: string }) => (
    <div className="text-xs">
      <div className="font-bold font-mono">{code}</div>
      <div className="text-gray-300">{definition}</div>
      <div className="text-gray-500 text-[10px]">{category}</div>
    </div>
  );

  if (loading) return (
    <div className="py-8 px-4"><div className="max-w-6xl mx-auto">
      <div className="border-2 border-black p-12 text-center">
        <div className="animate-pulse">
          <div className="text-2xl font-bold mb-2">⏳</div>
          <p className="text-gray-500">Loading visualizations...</p>
        </div>
      </div>
    </div></div>
  );

  if (error) return (
    <div className="py-8 px-4"><div className="max-w-6xl mx-auto">
      <div className="border-2 border-black p-12 text-center">
        <p className="text-red-600 mb-4">{error}</p>
        <button onClick={() => window.location.reload()} className="border-2 border-black px-4 py-2 font-bold hover:bg-black hover:text-white">Retry</button>
      </div>
    </div></div>
  );

  if (!data) return null;

  return (
    <div className="py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold">CHARTS & ANALYTICS</h1>
          <p className="text-gray-600 mt-2">Deep dive into Medicaid spending patterns</p>
        </div>

        {/* HCPCS Code Legend */}
        <div className="border-2 border-black p-4 mb-8 bg-gray-50">
          <p className="text-xs text-gray-600">
            <strong>Tip:</strong> Hover over HCPCS codes in charts to see definitions. 
            Common codes: 99213 (Office visit), D7140 (Tooth extraction), 90834 (Psychotherapy), 85025 (Blood test)
          </p>
        </div>

        <div className="space-y-8">
          {/* ========== TIME ANALYSIS ========== */}
          <section>
            <div className="border-b-2 border-black pb-2 mb-6">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Time-Based Analysis</h2>
            </div>

            {/* Yearly with Growth */}
            <div className="border-2 border-black p-6 mb-6">
              <h3 className="text-xl font-bold mb-1">Spending by Year</h3>
              <p className="text-xs text-gray-500 mb-4">Total Medicaid spending with year-over-year growth</p>
              <div className="h-72">
                <ResponsiveContainer>
                  <ComposedChart data={data.yearly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="year" />
                    <YAxis yAxisId="left" tickFormatter={fmt} />
                    <YAxis yAxisId="right" orientation="right" tickFormatter={(v) => `${v}%`} />
                    <Tooltip formatter={(v, name) => [name === 'growth' ? `${v}%` : fmt(Number(v)), name === 'growth' ? 'YoY Growth' : 'Spending']} />
                    <Bar yAxisId="left" dataKey="spending" fill="#000" />
                    <Line yAxisId="right" dataKey="growth" stroke="#666" strokeWidth={2} dot />
                  </ComposedChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Quarterly */}
              <div className="border-2 border-black p-6">
                <h3 className="text-lg font-bold mb-4">Quarterly Trend</h3>
                <div className="h-56">
                  <ResponsiveContainer>
                    <AreaChart data={data.quarterly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="quarter" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={fmt} />
                      <Tooltip formatter={(v) => [fmt(Number(v)), 'Spending']} />
                      <Area type="monotone" dataKey="spending" fill="#333" stroke="#000" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Seasonal */}
              <div className="border-2 border-black p-6">
                <h3 className="text-lg font-bold mb-4">Seasonal Patterns</h3>
                <div className="h-56">
                  <ResponsiveContainer>
                    <BarChart data={data.seasonal?.map((s: any) => ({ ...s, monthName: MONTHS[parseInt(s.month) - 1] }))}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="monthName" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={fmt} />
                      <Tooltip formatter={(v) => [fmt(Number(v)), 'Avg Spending']} />
                      <Bar dataKey="spending" fill="#666" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Monthly Trend */}
            <div className="border-2 border-black p-6">
              <h3 className="text-xl font-bold mb-4">Monthly Spending Trend</h3>
              <div className="h-72">
                <ResponsiveContainer>
                  <LineChart data={data.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" tick={{ fontSize: 9 }} interval="preserveStartEnd" />
                    <YAxis tickFormatter={fmt} />
                    <Tooltip formatter={(v) => [fmt(Number(v)), 'Spending']} />
                    <Line type="monotone" dataKey="spending" stroke="#000" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* ========== HCPCS ANALYSIS ========== */}
          <section>
            <div className="border-b-2 border-black pb-2 mb-6 mt-12">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">HCPCS Code Analysis</h2>
            </div>

            {/* Category Breakdown */}
            <div className="border-2 border-black p-6 mb-6">
              <h3 className="text-xl font-bold mb-1">Spending by Category</h3>
              <p className="text-xs text-gray-500 mb-4">Healthcare service categories</p>
              <div className="h-72">
                <ResponsiveContainer>
                  <BarChart data={data.categories} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={fmt} />
                    <YAxis type="category" dataKey="category" width={140} tick={{ fontSize: 11 }} />
                    <Tooltip formatter={(v) => [fmt(Number(v)), 'Spending']} />
                    <Bar dataKey="spending" fill="#000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Top HCPCS */}
            <div className="border-2 border-black p-6 mb-6">
              <h3 className="text-xl font-bold mb-1">Top 25 Procedure Codes by Spending</h3>
              <p className="text-xs text-gray-500 mb-4">Hover for procedure descriptions</p>
              <div className="h-[600px]">
                <ResponsiveContainer>
                  <BarChart data={data.topHCPCS} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={fmt} />
                    <YAxis type="category" dataKey="code" width={70} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                      <div className="bg-black text-white p-3 text-sm max-w-xs">
                        <CodeTooltip code={payload[0].payload.code} definition={payload[0].payload.definition} category={payload[0].payload.category} />
                        <div className="mt-2 text-green-400">{fmt(payload[0].payload.spending)}</div>
                      </div>
                    ) : null} />
                    <Bar dataKey="spending" fill="#000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* By Claims */}
              <div className="border-2 border-black p-6">
                <h3 className="text-lg font-bold mb-1">Most Frequent Procedures</h3>
                <p className="text-xs text-gray-500 mb-4">By claims volume</p>
                <div className="h-80">
                  <ResponsiveContainer>
                    <BarChart data={data.topByClaims} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={fmtNum} />
                      <YAxis type="category" dataKey="code" width={60} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                        <div className="bg-black text-white p-3 text-sm max-w-xs">
                          <CodeTooltip code={payload[0].payload.code} definition={payload[0].payload.definition} category={payload[0].payload.category} />
                          <div className="mt-2">{fmtNum(payload[0].payload.claims)} claims</div>
                        </div>
                      ) : null} />
                      <Bar dataKey="claims" fill="#444" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* By Beneficiaries */}
              <div className="border-2 border-black p-6">
                <h3 className="text-lg font-bold mb-1">Most Patients Served</h3>
                <p className="text-xs text-gray-500 mb-4">By unique beneficiaries</p>
                <div className="h-80">
                  <ResponsiveContainer>
                    <BarChart data={data.topByBeneficiaries} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={fmtNum} />
                      <YAxis type="category" dataKey="code" width={60} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                        <div className="bg-black text-white p-3 text-sm max-w-xs">
                          <CodeTooltip code={payload[0].payload.code} definition={payload[0].payload.definition} category={payload[0].payload.category} />
                          <div className="mt-2">{fmtNum(payload[0].payload.beneficiaries)} beneficiaries</div>
                        </div>
                      ) : null} />
                      <Bar dataKey="beneficiaries" fill="#666" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          {/* ========== COST EFFICIENCY ========== */}
          <section>
            <div className="border-b-2 border-black pb-2 mb-6 mt-12">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Cost Efficiency Analysis</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6 mb-6">
              {/* Cost per Claim */}
              <div className="border-2 border-black p-6">
                <h3 className="text-lg font-bold mb-1">Most Expensive per Claim</h3>
                <p className="text-xs text-gray-500 mb-4">Average cost per procedure</p>
                <div className="h-80">
                  <ResponsiveContainer>
                    <BarChart data={data.costPerClaim} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={fmt} />
                      <YAxis type="category" dataKey="code" width={60} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                        <div className="bg-black text-white p-3 text-sm max-w-xs">
                          <CodeTooltip code={payload[0].payload.code} definition={payload[0].payload.definition} category={payload[0].payload.category} />
                          <div className="mt-2 text-green-400">{fmt(payload[0].payload.costPerClaim)} per claim</div>
                        </div>
                      ) : null} />
                      <Bar dataKey="costPerClaim" fill="#000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Cost per Beneficiary */}
              <div className="border-2 border-black p-6">
                <h3 className="text-lg font-bold mb-1">Cost per Patient</h3>
                <p className="text-xs text-gray-500 mb-4">Average spending per beneficiary</p>
                <div className="h-80">
                  <ResponsiveContainer>
                    <BarChart data={data.costPerBeneficiary} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" tickFormatter={fmt} />
                      <YAxis type="category" dataKey="code" width={60} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                      <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                        <div className="bg-black text-white p-3 text-sm max-w-xs">
                          <CodeTooltip code={payload[0].payload.code} definition={payload[0].payload.definition} category={payload[0].payload.category} />
                          <div className="mt-2 text-green-400">{fmt(payload[0].payload.costPerBeneficiary)} per patient</div>
                        </div>
                      ) : null} />
                      <Bar dataKey="costPerBeneficiary" fill="#333" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Claims per Beneficiary */}
            <div className="border-2 border-black p-6">
              <h3 className="text-lg font-bold mb-1">Most Repeat Procedures</h3>
              <p className="text-xs text-gray-500 mb-4">Claims per beneficiary (recurring treatments)</p>
              <div className="h-64">
                <ResponsiveContainer>
                  <BarChart data={data.claimsPerBene} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis type="category" dataKey="code" width={60} tick={{ fontSize: 10, fontFamily: 'monospace' }} />
                    <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                      <div className="bg-black text-white p-3 text-sm max-w-xs">
                        <CodeTooltip code={payload[0].payload.code} definition={payload[0].payload.definition} category={payload[0].payload.category} />
                        <div className="mt-2">{payload[0].payload.claimsPerBene} claims per patient</div>
                      </div>
                    ) : null} />
                    <Bar dataKey="claimsPerBene" fill="#666" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </section>

          {/* ========== PROVIDER ANALYSIS ========== */}
          <section>
            <div className="border-b-2 border-black pb-2 mb-6 mt-12">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Provider Analysis</h2>
            </div>

            {/* Top Providers */}
            <div className="border-2 border-black p-6 mb-6">
              <h3 className="text-xl font-bold mb-4">Top 25 Providers by Spending</h3>
              <div className="h-[600px]">
                <ResponsiveContainer>
                  <BarChart data={data.topProviders} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" tickFormatter={fmt} />
                    <YAxis type="category" dataKey="npi" width={90} tick={{ fontSize: 9, fontFamily: 'monospace' }} />
                    <Tooltip formatter={(v) => [fmt(Number(v)), 'Spending']} />
                    <Bar dataKey="spending" fill="#000" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Provider Concentration */}
              <div className="border-2 border-black p-6">
                <h3 className="text-lg font-bold mb-4">Spending Concentration</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={data.concentration} dataKey="spending" nameKey="category" cx="50%" cy="50%" outerRadius={80} label>
                        {data.concentration.map((_: any, i: number) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [fmt(Number(v)), 'Spending']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">Share of total spending</p>
              </div>

              {/* Provider Tiers */}
              <div className="border-2 border-black p-6">
                <h3 className="text-lg font-bold mb-4">Provider Size Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <BarChart data={data.providerTiers}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="tier" tick={{ fontSize: 10 }} />
                      <YAxis tickFormatter={fmtNum} />
                      <Tooltip formatter={(v, name) => [name === 'count' ? fmtNum(Number(v)) : fmt(Number(v)), name === 'count' ? 'Providers' : 'Total Spending']} />
                      <Bar dataKey="count" fill="#000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">Number of providers by spending tier</p>
              </div>
            </div>
          </section>

          {/* ========== DISTRIBUTION ========== */}
          <section>
            <div className="border-b-2 border-black pb-2 mb-6 mt-12">
              <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Distribution Analysis</h2>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Billing vs Servicing */}
              <div className="border-2 border-black p-6">
                <h3 className="text-lg font-bold mb-4">Billing vs Servicing Provider</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={data.billingServicing} dataKey="spending" nameKey="type" cx="50%" cy="50%" outerRadius={80} label>
                        {data.billingServicing.map((_: any, i: number) => <Cell key={i} fill={COLORS[i]} />)}
                      </Pie>
                      <Tooltip formatter={(v) => [fmt(Number(v)), 'Spending']} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">Same provider = direct care; Different = referrals/facilities</p>
              </div>

              {/* Claims vs Spending */}
              <div className="border-2 border-black p-6">
                <h3 className="text-lg font-bold mb-4">Claims vs Spending Over Time</h3>
                <div className="h-64">
                  <ResponsiveContainer>
                    <LineChart data={data.monthly}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" tick={{ fontSize: 8 }} interval="preserveStartEnd" />
                      <YAxis yAxisId="left" tickFormatter={fmtNum} />
                      <YAxis yAxisId="right" orientation="right" tickFormatter={fmt} />
                      <Tooltip />
                      <Line yAxisId="left" dataKey="claims" stroke="#666" dot={false} name="Claims" />
                      <Line yAxisId="right" dataKey="spending" stroke="#000" dot={false} name="Spending" />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </section>

          {/* ========== GEOGRAPHIC ANALYSIS ========== */}
          {data.topStates && data.topStates.length > 0 && (
            <section>
              <div className="border-b-2 border-black pb-2 mb-6 mt-12">
                <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500">Geographic Analysis</h2>
              </div>

              {/* Top States */}
              <div className="border-2 border-black p-6 mb-6">
                <h3 className="text-xl font-bold mb-1">Top Jurisdictions by Provider Count</h3>
                <p className="text-xs text-gray-500 mb-4">Based on 9M registered healthcare providers (NPPES data)</p>
                <div className="h-80">
                  <ResponsiveContainer>
                    <BarChart data={data.topStates}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="state" tick={{ fontSize: 11 }} />
                      <YAxis tickFormatter={fmtNum} />
                      <Tooltip formatter={(v) => [fmtNum(Number(v)), 'Providers']} />
                      <Bar dataKey="providers" fill="#000" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Top Cities */}
              {data.topCities && data.topCities.length > 0 && (
                <div className="border-2 border-black p-6 mb-6">
                  <h3 className="text-xl font-bold mb-1">Top 25 Cities by Provider Count</h3>
                  <p className="text-xs text-gray-500 mb-4">Healthcare provider concentration by city</p>
                  <div className="h-[600px]">
                    <ResponsiveContainer>
                      <BarChart data={data.topCities} layout="vertical">
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" tickFormatter={fmtNum} />
                        <YAxis type="category" dataKey="city" width={120} tick={{ fontSize: 10 }} />
                        <Tooltip content={({ active, payload }) => active && payload?.[0] ? (
                          <div className="bg-black text-white p-3 text-sm">
                            <div className="font-bold">{payload[0].payload.city}, {payload[0].payload.state}</div>
                            <div className="mt-1">{fmtNum(payload[0].payload.providers)} providers</div>
                          </div>
                        ) : null} />
                        <Bar dataKey="providers" fill="#333" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* State/City Summary */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="border-2 border-black p-6">
                  <h3 className="text-lg font-bold mb-4">Top 5 Jurisdictions</h3>
                  <div className="space-y-2">
                    {data.topStates.slice(0, 5).map((s: any, i: number) => (
                      <div key={s.state} className="flex justify-between items-center">
                        <span className="font-mono">{i + 1}. {s.state}</span>
                        <span className="text-gray-600">{fmtNum(s.providers)} providers</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="border-2 border-black p-6">
                  <h3 className="text-lg font-bold mb-4">Top 5 Cities</h3>
                  <div className="space-y-2">
                    {data.topCities?.slice(0, 5).map((c: any, i: number) => (
                      <div key={c.city} className="flex justify-between items-center">
                        <span className="font-mono">{i + 1}. {c.city}</span>
                        <span className="text-gray-600">{fmtNum(c.providers)} ({c.state})</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Summary Stats */}
          <div className="border-2 border-black p-6 mt-8 bg-gray-50">
            <h3 className="text-xl font-bold mb-2">Dataset Summary</h3>
            <p className="text-xs text-gray-500 mb-4">50 U.S. states + D.C. + 3 territories (PR, VI, GU)</p>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
              <div className="text-center p-3">
                <p className="text-2xl font-bold">{data.yearly?.length || 0}</p>
                <p className="text-xs text-gray-600">Years</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold">{data.monthly?.length || 0}</p>
                <p className="text-xs text-gray-600">Months</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold">{data.categories?.length || 0}</p>
                <p className="text-xs text-gray-600">Categories</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold">{data.topHCPCS?.length || 0}+</p>
                <p className="text-xs text-gray-600">HCPCS Codes</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold">{data.topProviders?.length || 0}+</p>
                <p className="text-xs text-gray-600">Providers</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold">{data.topStates?.length || 0}</p>
                <p className="text-xs text-gray-600">Jurisdictions</p>
              </div>
              <div className="text-center p-3">
                <p className="text-2xl font-bold">{data.topCities?.length || 0}</p>
                <p className="text-xs text-gray-600">Cities</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link href="/" className="text-sm text-gray-600 hover:text-black">Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
