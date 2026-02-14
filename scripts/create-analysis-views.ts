import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function createAnalysisViews() {
  console.log('Creating comprehensive analysis views...\n');

  // =========================================================================
  // 1. PROVIDER RISK SCORING
  // =========================================================================
  console.log('1. Creating provider risk analysis views...');

  // Provider billing intensity (claims per beneficiary)
  await pool.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_provider_intensity AS
    SELECT 
      billing_provider_npi as npi,
      COUNT(DISTINCT hcpcs_code) as unique_codes,
      SUM(total_claims) as total_claims,
      SUM(total_unique_beneficiaries) as total_beneficiaries,
      SUM(total_paid) as total_paid,
      ROUND((SUM(total_claims)::numeric / NULLIF(SUM(total_unique_beneficiaries), 0)), 2) as claims_per_beneficiary,
      ROUND((SUM(total_paid)::numeric / NULLIF(SUM(total_unique_beneficiaries), 0)), 2) as cost_per_beneficiary,
      ROUND((SUM(total_paid)::numeric / NULLIF(SUM(total_claims), 0)), 2) as cost_per_claim
    FROM medicaid_provider_spending
    GROUP BY billing_provider_npi
    HAVING SUM(total_claims) > 100
  `);
  console.log('   Created: mv_provider_intensity');

  // Provider risk scores (multi-factor)
  await pool.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_provider_risk_scores AS
    WITH stats AS (
      SELECT 
        AVG(claims_per_beneficiary) as avg_claims_per_bene,
        STDDEV(claims_per_beneficiary) as std_claims_per_bene,
        AVG(cost_per_beneficiary) as avg_cost_per_bene,
        STDDEV(cost_per_beneficiary) as std_cost_per_bene,
        AVG(cost_per_claim) as avg_cost_per_claim,
        STDDEV(cost_per_claim) as std_cost_per_claim
      FROM mv_provider_intensity
      WHERE claims_per_beneficiary < 1000  -- Exclude extreme outliers from stats
    )
    SELECT 
      p.npi,
      p.total_claims,
      p.total_beneficiaries,
      p.total_paid,
      p.claims_per_beneficiary,
      p.cost_per_beneficiary,
      p.cost_per_claim,
      p.unique_codes,
      -- Z-scores for each metric
      ROUND(((p.claims_per_beneficiary - s.avg_claims_per_bene) / NULLIF(s.std_claims_per_bene, 0))::numeric, 2) as z_claims_intensity,
      ROUND(((p.cost_per_beneficiary - s.avg_cost_per_bene) / NULLIF(s.std_cost_per_bene, 0))::numeric, 2) as z_cost_per_bene,
      ROUND(((p.cost_per_claim - s.avg_cost_per_claim) / NULLIF(s.std_cost_per_claim, 0))::numeric, 2) as z_cost_per_claim,
      -- Composite risk score (average of absolute z-scores)
      ROUND((
        ABS((p.claims_per_beneficiary - s.avg_claims_per_bene) / NULLIF(s.std_claims_per_bene, 0)) +
        ABS((p.cost_per_beneficiary - s.avg_cost_per_bene) / NULLIF(s.std_cost_per_bene, 0)) +
        ABS((p.cost_per_claim - s.avg_cost_per_claim) / NULLIF(s.std_cost_per_claim, 0))
      )::numeric / 3, 2) as composite_risk_score,
      -- Code concentration (1 = only bills one code, potential mill)
      CASE WHEN p.unique_codes = 1 THEN 'SINGLE_CODE' 
           WHEN p.unique_codes <= 3 THEN 'LOW_DIVERSITY'
           ELSE 'NORMAL' END as code_diversity_flag
    FROM mv_provider_intensity p, stats s
    ORDER BY composite_risk_score DESC NULLS LAST
  `);
  console.log('   Created: mv_provider_risk_scores');

  // =========================================================================
  // 2. HCPCS CODE ANALYSIS
  // =========================================================================
  console.log('\n2. Creating HCPCS analysis views...');

  // HCPCS spending summary with growth
  await pool.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_hcpcs_summary AS
    SELECT 
      hcpcs_code,
      COUNT(DISTINCT billing_provider_npi) as provider_count,
      SUM(total_claims) as total_claims,
      SUM(total_unique_beneficiaries) as total_beneficiaries,
      SUM(total_paid) as total_spending,
      ROUND(AVG(total_paid / NULLIF(total_claims, 0))::numeric, 2) as avg_cost_per_claim,
      ROUND(STDDEV(total_paid / NULLIF(total_claims, 0))::numeric, 2) as std_cost_per_claim,
      -- Concentration: what % of spending comes from top provider?
      ROUND((MAX(total_paid) / NULLIF(SUM(total_paid), 0) * 100)::numeric, 2) as top_provider_concentration
    FROM medicaid_provider_spending
    GROUP BY hcpcs_code
    HAVING SUM(total_paid) > 10000
    ORDER BY total_spending DESC
  `);
  console.log('   Created: mv_hcpcs_summary');

  // HCPCS price variance (same code, different prices)
  await pool.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_hcpcs_price_variance AS
    SELECT 
      hcpcs_code,
      COUNT(DISTINCT billing_provider_npi) as providers,
      MIN(total_paid / NULLIF(total_claims, 0)) as min_price,
      MAX(total_paid / NULLIF(total_claims, 0)) as max_price,
      ROUND(AVG(total_paid / NULLIF(total_claims, 0))::numeric, 2) as avg_price,
      ROUND((MAX(total_paid / NULLIF(total_claims, 0)) / NULLIF(MIN(total_paid / NULLIF(total_claims, 0)), 0))::numeric, 2) as price_ratio,
      ROUND((STDDEV(total_paid / NULLIF(total_claims, 0)) / NULLIF(AVG(total_paid / NULLIF(total_claims, 0)), 0) * 100)::numeric, 2) as coefficient_of_variation
    FROM medicaid_provider_spending
    WHERE total_claims > 0
    GROUP BY hcpcs_code
    HAVING COUNT(DISTINCT billing_provider_npi) >= 10
    ORDER BY price_ratio DESC NULLS LAST
  `);
  console.log('   Created: mv_hcpcs_price_variance');

  // =========================================================================
  // 3. STATE EFFICIENCY ANALYSIS
  // =========================================================================
  console.log('\n3. Creating state efficiency views...');

  // State efficiency metrics with FMAP correlation
  await pool.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_state_efficiency AS
    SELECT 
      f.state_code,
      f.state_name,
      f.fy2024 as fmap_rate,
      f.expansion_status,
      s.total_spending,
      s.population,
      s.per_capita,
      -- Efficiency metrics
      ROUND((s.per_capita / NULLIF(f.fy2024, 0) * 100)::numeric, 2) as spending_fmap_ratio,
      -- Federal burden
      ROUND((s.total_spending * f.fy2024 / 100)::numeric, 2) as federal_dollars,
      ROUND((s.total_spending * (100 - f.fy2024) / 100)::numeric, 2) as state_dollars,
      -- Rank
      RANK() OVER (ORDER BY s.per_capita DESC) as percapita_rank,
      RANK() OVER (ORDER BY f.fy2024 DESC) as fmap_rank
    FROM federal_fmap f
    JOIN federal_state_spending s ON f.state_code = s.state_code
    ORDER BY s.per_capita DESC
  `);
  console.log('   Created: mv_state_efficiency');

  // FMAP moral hazard analysis (do high-FMAP states spend more?)
  await pool.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_fmap_moral_hazard AS
    WITH quartiles AS (
      SELECT 
        state_code,
        fy2024,
        NTILE(4) OVER (ORDER BY fy2024) as fmap_quartile
      FROM federal_fmap
    )
    SELECT 
      q.fmap_quartile,
      CASE q.fmap_quartile 
        WHEN 1 THEN 'Low FMAP (50-58%)'
        WHEN 2 THEN 'Medium-Low (58-65%)'
        WHEN 3 THEN 'Medium-High (65-70%)'
        WHEN 4 THEN 'High FMAP (70-79%)'
      END as quartile_label,
      COUNT(*) as state_count,
      ROUND(AVG(q.fy2024)::numeric, 2) as avg_fmap,
      ROUND(AVG(s.per_capita)::numeric, 2) as avg_per_capita,
      ROUND(SUM(s.total_spending)::numeric, 2) as total_spending,
      ROUND(AVG(s.per_capita * q.fy2024 / 100)::numeric, 2) as avg_federal_per_capita
    FROM quartiles q
    JOIN federal_state_spending s ON q.state_code = s.state_code
    GROUP BY q.fmap_quartile
    ORDER BY q.fmap_quartile
  `);
  console.log('   Created: mv_fmap_moral_hazard');

  // =========================================================================
  // 4. TEMPORAL ANALYSIS
  // =========================================================================
  console.log('\n4. Creating temporal analysis views...');

  // Monthly spending trends
  await pool.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_monthly_trends AS
    SELECT 
      claim_month,
      EXTRACT(YEAR FROM TO_DATE(claim_month, 'YYYY-MM')) as year,
      EXTRACT(MONTH FROM TO_DATE(claim_month, 'YYYY-MM')) as month,
      COUNT(DISTINCT billing_provider_npi) as active_providers,
      SUM(total_claims) as total_claims,
      SUM(total_unique_beneficiaries) as total_beneficiaries,
      SUM(total_paid) as total_spending,
      ROUND(AVG(total_paid / NULLIF(total_claims, 0))::numeric, 2) as avg_cost_per_claim
    FROM medicaid_provider_spending
    GROUP BY claim_month
    ORDER BY claim_month
  `);
  console.log('   Created: mv_monthly_trends');

  // Year-over-year growth by HCPCS
  await pool.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_hcpcs_yoy_growth AS
    WITH yearly AS (
      SELECT 
        hcpcs_code,
        EXTRACT(YEAR FROM TO_DATE(claim_month, 'YYYY-MM'))::int as year,
        SUM(total_paid) as spending
      FROM medicaid_provider_spending
      GROUP BY hcpcs_code, EXTRACT(YEAR FROM TO_DATE(claim_month, 'YYYY-MM'))
      HAVING SUM(total_paid) > 100000
    ),
    growth AS (
      SELECT 
        y1.hcpcs_code,
        y1.year as year,
        y1.spending,
        LAG(y1.spending) OVER (PARTITION BY y1.hcpcs_code ORDER BY y1.year) as prev_spending,
        ROUND(((y1.spending - LAG(y1.spending) OVER (PARTITION BY y1.hcpcs_code ORDER BY y1.year)) 
          / NULLIF(LAG(y1.spending) OVER (PARTITION BY y1.hcpcs_code ORDER BY y1.year), 0) * 100)::numeric, 2) as yoy_growth_pct
      FROM yearly y1
    )
    SELECT * FROM growth
    WHERE prev_spending IS NOT NULL
    ORDER BY yoy_growth_pct DESC NULLS LAST
  `);
  console.log('   Created: mv_hcpcs_yoy_growth');

  // =========================================================================
  // 5. GEOGRAPHIC ANALYSIS
  // =========================================================================
  console.log('\n5. Creating geographic analysis views...');

  // State provider density
  await pool.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_state_provider_density AS
    SELECT 
      f.state_code,
      f.state_name,
      s.population,
      s.total_spending,
      -- Would need provider_locations join for accurate count
      -- Using estimate from spending data
      COUNT(DISTINCT m.billing_provider_npi) as est_providers,
      ROUND((s.population::numeric / NULLIF(COUNT(DISTINCT m.billing_provider_npi), 0))::numeric, 0) as pop_per_provider,
      ROUND((s.total_spending / NULLIF(COUNT(DISTINCT m.billing_provider_npi), 0))::numeric, 2) as spending_per_provider
    FROM federal_fmap f
    JOIN federal_state_spending s ON f.state_code = s.state_code
    LEFT JOIN medicaid_provider_spending m ON TRUE  -- This is expensive, but we limit
    GROUP BY f.state_code, f.state_name, s.population, s.total_spending
    LIMIT 51
  `);
  console.log('   Created: mv_state_provider_density (limited)');

  // =========================================================================
  // 6. SUMMARY STATISTICS
  // =========================================================================
  console.log('\n6. Creating summary statistics view...');

  await pool.query(`
    CREATE MATERIALIZED VIEW IF NOT EXISTS mv_analysis_summary AS
    SELECT 
      'providers' as metric,
      (SELECT COUNT(DISTINCT npi) FROM mv_provider_intensity)::text as value
    UNION ALL
    SELECT 'high_risk_providers', 
      (SELECT COUNT(*) FROM mv_provider_risk_scores WHERE composite_risk_score > 3)::text
    UNION ALL
    SELECT 'single_code_providers',
      (SELECT COUNT(*) FROM mv_provider_risk_scores WHERE code_diversity_flag = 'SINGLE_CODE')::text
    UNION ALL
    SELECT 'hcpcs_codes',
      (SELECT COUNT(*) FROM mv_hcpcs_summary)::text
    UNION ALL
    SELECT 'high_variance_codes',
      (SELECT COUNT(*) FROM mv_hcpcs_price_variance WHERE price_ratio > 10)::text
    UNION ALL
    SELECT 'total_spending',
      (SELECT ROUND(SUM(total_spending)::numeric, 0)::text FROM mv_hcpcs_summary)
    UNION ALL
    SELECT 'avg_state_per_capita',
      (SELECT ROUND(AVG(per_capita)::numeric, 2)::text FROM mv_state_efficiency)
    UNION ALL
    SELECT 'fmap_spending_correlation',
      (SELECT ROUND(CORR(fmap_rate, per_capita)::numeric, 3)::text FROM mv_state_efficiency)
  `);
  console.log('   Created: mv_analysis_summary');

  // =========================================================================
  // 7. CREATE INDEXES
  // =========================================================================
  console.log('\n7. Creating indexes...');

  await pool.query(`CREATE INDEX IF NOT EXISTS idx_risk_composite ON mv_provider_risk_scores(composite_risk_score DESC)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_risk_npi ON mv_provider_risk_scores(npi)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_hcpcs_spending ON mv_hcpcs_summary(total_spending DESC)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_price_variance ON mv_hcpcs_price_variance(price_ratio DESC)`);
  await pool.query(`CREATE INDEX IF NOT EXISTS idx_yoy_growth ON mv_hcpcs_yoy_growth(yoy_growth_pct DESC)`);
  console.log('   Created indexes on analysis views');

  // =========================================================================
  // VERIFY
  // =========================================================================
  console.log('\n=== VERIFICATION ===');
  
  const views = await pool.query(`
    SELECT matviewname, pg_size_pretty(pg_relation_size(matviewname::regclass)) as size
    FROM pg_matviews 
    WHERE schemaname = 'public' AND matviewname LIKE 'mv_%'
    ORDER BY matviewname
  `);
  console.log('\nMaterialized Views:');
  views.rows.forEach(r => console.log(`  ${r.matviewname}: ${r.size}`));

  const summary = await pool.query('SELECT * FROM mv_analysis_summary');
  console.log('\nAnalysis Summary:');
  summary.rows.forEach(r => console.log(`  ${r.metric}: ${r.value}`));

  await pool.end();
  console.log('\nDone!');
}

createAnalysisViews().catch(e => {
  console.error('Error:', e.message);
  process.exit(1);
});
