'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface FederalInsight {
  category: string;
  title: string;
  finding: string;
  implication: string;
  severity: 'info' | 'notable' | 'significant';
}

interface FederalAnalysisData {
  summary: string;
  insights: FederalInsight[];
  keyMetrics: {
    label: string;
    value: string;
    context: string;
  }[];
  policyImplications: string[];
  methodology: string;
  generatedAt: string;
}

export default function FederalAnalysisPage() {
  const [data, setData] = useState<FederalAnalysisData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/federal/analysis')
      .then(r => {
        if (!r.ok) throw new Error('Failed to load analysis');
        return r.json();
      })
      .then(setData)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="border-2 border-black p-12 text-center animate-pulse">
          <p className="text-xl">Analyzing federal funding patterns...</p>
          <p className="text-sm text-gray-500 mt-2">Computing insights from FMAP and congressional data</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="border-2 border-black p-8 text-center">
          <p className="text-xl text-red-600">Error loading analysis</p>
          <p className="text-sm mt-2">{error}</p>
          <Link href="/federal" className="inline-block mt-4 border-2 border-black px-4 py-2 hover:bg-black hover:text-white">
            Back to Federal
          </Link>
        </div>
      </div>
    </div>
  );

  if (!data) return null;

  const severityStyles = {
    info: 'border-gray-300 bg-gray-50',
    notable: 'border-gray-400 bg-gray-100',
    significant: 'border-black bg-gray-200'
  };

  return (
    <div className="py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
            <Link href="/federal" className="hover:underline">Federal</Link>
            <span>/</span>
            <span>Analysis</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold">FEDERAL FUNDING ANALYSIS</h1>
          <p className="text-gray-600 mt-2">AI-powered insights on FMAP rates and congressional spending</p>
        </div>

        {/* Executive Summary */}
        <div className="border-2 border-black p-6 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-3">Executive Summary</h2>
          <p className="text-lg leading-relaxed">{data.summary}</p>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-3 gap-4 mb-8">
          {data.keyMetrics.map((metric, i) => (
            <div key={i} className="border-2 border-black p-4">
              <p className="text-sm text-gray-500">{metric.label}</p>
              <p className="text-2xl font-bold">{metric.value}</p>
              <p className="text-xs text-gray-600 mt-1">{metric.context}</p>
            </div>
          ))}
        </div>

        {/* Insights */}
        <div className="mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">Key Findings</h2>
          <div className="space-y-4">
            {data.insights.map((insight, i) => (
              <div key={i} className={`border-2 p-4 ${severityStyles[insight.severity]}`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold uppercase bg-black text-white px-2 py-0.5">
                    {insight.category}
                  </span>
                  <span className={`text-xs px-2 py-0.5 ${
                    insight.severity === 'significant' ? 'bg-gray-800 text-white' :
                    insight.severity === 'notable' ? 'bg-gray-500 text-white' :
                    'bg-gray-300'
                  }`}>
                    {insight.severity}
                  </span>
                </div>
                <h3 className="font-bold mb-2">{insight.title}</h3>
                <p className="text-sm mb-2">{insight.finding}</p>
                <p className="text-sm text-gray-600 italic">{insight.implication}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Policy Implications */}
        <div className="border-2 border-black p-6 mb-8">
          <h2 className="text-sm font-bold uppercase tracking-wide text-gray-500 mb-4">Policy Implications</h2>
          <ul className="space-y-3">
            {data.policyImplications.map((implication, i) => (
              <li key={i} className="flex gap-3">
                <span className="font-bold text-gray-400">{i + 1}.</span>
                <span>{implication}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Methodology */}
        <div className="border-2 border-black p-4 bg-gray-50 mb-8">
          <h3 className="font-bold mb-2">Methodology</h3>
          <p className="text-sm text-gray-600">{data.methodology}</p>
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-sm text-gray-500">
          <span>Generated: {new Date(data.generatedAt).toLocaleString()}</span>
          <Link href="/federal" className="border-2 border-black px-4 py-2 font-bold hover:bg-black hover:text-white">
            Back to Federal Data
          </Link>
        </div>
      </div>
    </div>
  );
}
