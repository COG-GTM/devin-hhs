import { NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Key insights
    const insights = await pool.query('SELECT * FROM mv_key_insights');
    
    // FMAP quartiles
    const quartiles = await pool.query('SELECT * FROM mv_fmap_quartile_summary ORDER BY quartile');
    
    // Efficiency analysis
    const efficiency = await pool.query(`
      SELECT state_name, fmap_rate, per_capita, total_spending, expansion_status, efficiency_category
      FROM mv_fmap_efficiency_analysis
      ORDER BY per_capita DESC
    `);
    
    // Calculate correlation properly
    const correlation = await pool.query(`
      SELECT ROUND(CORR(f.fy2024, s.per_capita)::numeric, 3) as corr
      FROM federal_fmap f
      JOIN federal_state_spending s ON f.state_code = s.state_code
    `);

    // Expansion impact
    const expansionImpact = await pool.query(`
      SELECT 
        expansion_status,
        COUNT(*) as states,
        ROUND(AVG(s.per_capita)::numeric, 0) as avg_per_capita,
        ROUND(SUM(s.total_spending) / 1e9, 1) as total_billions,
        ROUND(AVG(f.fy2024)::numeric, 2) as avg_fmap
      FROM federal_fmap f
      JOIN federal_state_spending s ON f.state_code = s.state_code
      GROUP BY expansion_status
    `);

    // Category breakdown
    const categories = await pool.query(`
      SELECT 
        efficiency_category,
        COUNT(*) as states,
        ROUND(AVG(per_capita)::numeric, 0) as avg_per_capita,
        array_agg(state_name ORDER BY per_capita DESC) as state_list
      FROM mv_fmap_efficiency_analysis
      WHERE efficiency_category != 'MIDDLE'
      GROUP BY efficiency_category
    `);

    // Outliers
    const outliers = await pool.query(`
      SELECT state_name, fmap_rate, per_capita, efficiency_category
      FROM mv_fmap_efficiency_analysis
      WHERE efficiency_category IN ('HIGH_FMAP_HIGH_SPEND', 'LOW_FMAP_HIGH_SPEND')
      ORDER BY per_capita DESC
      LIMIT 10
    `);

    const insightMap: Record<string, string> = {};
    insights.rows.forEach((r: { metric: string; value: string }) => {
      insightMap[r.metric] = r.value;
    });

    return NextResponse.json({
      keyFindings: {
        fmapSpendingCorrelation: parseFloat(correlation.rows[0].corr),
        totalFederalSpendingBillions: parseFloat(insightMap.total_federal_spending_billions),
        expansionAvgPerCapita: parseFloat(insightMap.expansion_state_avg_percapita),
        nonExpansionAvgPerCapita: parseFloat(insightMap.non_expansion_state_avg_percapita),
        expansionPremium: Math.round(
          ((parseFloat(insightMap.expansion_state_avg_percapita) / 
            parseFloat(insightMap.non_expansion_state_avg_percapita)) - 1) * 100
        )
      },
      fmapQuartiles: quartiles.rows,
      expansionAnalysis: expansionImpact.rows,
      efficiencyCategories: categories.rows,
      topSpenders: outliers.rows,
      allStates: efficiency.rows,
      methodology: {
        correlation: 'Pearson correlation between FMAP rate and per-capita spending',
        quartiles: 'States divided into 4 equal groups by FMAP rate',
        efficiency: 'Cross-tabulation of FMAP quartile and spending quartile',
        source: 'CMS FMAP rates, Census 2020 population, HHS Medicaid spending'
      }
    });
  } catch (error) {
    console.error('Deep analysis error:', error);
    return NextResponse.json({ 
      error: 'Analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
