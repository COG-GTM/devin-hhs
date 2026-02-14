import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false },
  statement_timeout: 600000
});

async function run() {
  console.log("=".repeat(60));
  console.log("FULL DATASET OUTLIER ANALYSIS");
  console.log("=".repeat(60));

  console.log("\n1. Computing provider outliers (full 227M rows)...");
  const providerResult = await pool.query(`
    WITH provider_stats AS (
      SELECT 
        billing_provider_npi as npi,
        SUM(total_paid)::numeric as total_spending,
        SUM(total_claims)::bigint as total_claims,
        SUM(total_unique_beneficiaries)::bigint as beneficiaries,
        ROUND(SUM(total_paid)/NULLIF(SUM(total_claims),0), 2)::numeric as avg_per_claim
      FROM medicaid_provider_spending
      GROUP BY billing_provider_npi
      HAVING SUM(total_claims) > 100
    ),
    stats AS (
      SELECT 
        AVG(total_spending) as avg_spending,
        STDDEV(total_spending) as std_spending,
        AVG(avg_per_claim) as avg_cost,
        STDDEV(avg_per_claim) as std_cost
      FROM provider_stats
    )
    SELECT 
      p.npi,
      p.total_spending,
      p.total_claims,
      p.beneficiaries,
      p.avg_per_claim,
      ROUND((p.total_spending - s.avg_spending) / NULLIF(s.std_spending, 0), 2)::numeric as spending_zscore,
      ROUND((p.avg_per_claim - s.avg_cost) / NULLIF(s.std_cost, 0), 2)::numeric as cost_zscore
    FROM provider_stats p, stats s
    WHERE (p.total_spending - s.avg_spending) / NULLIF(s.std_spending, 0) > 3
    ORDER BY (p.total_spending - s.avg_spending) / NULLIF(s.std_spending, 0) DESC
  `);
  console.log("  Found " + providerResult.rows.length + " provider outliers (z > 3)");

  console.log("\n2. Computing HCPCS outliers...");
  const hcpcsResult = await pool.query(`
    WITH code_stats AS (
      SELECT 
        hcpcs_code as code,
        SUM(total_paid)::numeric as total_spending,
        SUM(total_claims)::bigint as total_claims,
        ROUND(SUM(total_paid)/NULLIF(SUM(total_claims),0), 2)::numeric as avg_per_claim,
        COUNT(DISTINCT billing_provider_npi)::int as provider_count
      FROM medicaid_provider_spending
      GROUP BY hcpcs_code
      HAVING SUM(total_claims) > 100
    ),
    stats AS (
      SELECT 
        AVG(total_spending) as avg_spending,
        STDDEV(total_spending) as std_spending,
        AVG(avg_per_claim) as avg_cost,
        STDDEV(avg_per_claim) as std_cost
      FROM code_stats
    )
    SELECT 
      c.code,
      c.total_spending,
      c.total_claims,
      c.avg_per_claim,
      c.provider_count,
      ROUND((c.total_spending - s.avg_spending) / NULLIF(s.std_spending, 0), 2)::numeric as spending_zscore,
      ROUND((c.avg_per_claim - s.avg_cost) / NULLIF(s.std_cost, 0), 2)::numeric as cost_zscore
    FROM code_stats c, stats s
    WHERE (c.total_spending - s.avg_spending) / NULLIF(s.std_spending, 0) > 3
    ORDER BY (c.total_spending - s.avg_spending) / NULLIF(s.std_spending, 0) DESC
  `);
  console.log("  Found " + hcpcsResult.rows.length + " HCPCS outliers (z > 3)");

  console.log("\n3. Computing billing mismatches...");
  const mismatchResult = await pool.query(`
    WITH mismatch_stats AS (
      SELECT 
        billing_provider_npi,
        servicing_provider_npi,
        SUM(total_paid)::numeric as spending,
        SUM(total_claims)::bigint as claims,
        COUNT(DISTINCT hcpcs_code)::int as unique_codes
      FROM medicaid_provider_spending
      WHERE billing_provider_npi != servicing_provider_npi
      GROUP BY billing_provider_npi, servicing_provider_npi
      HAVING SUM(total_claims) > 100
    ),
    stats AS (
      SELECT AVG(spending) as avg_spending, STDDEV(spending) as std_spending FROM mismatch_stats
    )
    SELECT 
      m.*,
      ROUND((m.spending - s.avg_spending) / NULLIF(s.std_spending, 0), 2)::numeric as spending_zscore
    FROM mismatch_stats m, stats s
    WHERE (m.spending - s.avg_spending) / NULLIF(s.std_spending, 0) > 3
    ORDER BY (m.spending - s.avg_spending) / NULLIF(s.std_spending, 0) DESC
  `);
  console.log("  Found " + mismatchResult.rows.length + " billing mismatch outliers (z > 3)");

  console.log("\n" + "=".repeat(60));
  console.log("TOP 10 PROVIDER OUTLIERS BY SPENDING Z-SCORE:");
  console.log("=".repeat(60));
  providerResult.rows.slice(0, 10).forEach((r, i) => {
    console.log("  " + (i+1) + ". NPI " + r.npi + ": z=" + r.spending_zscore + " | $" + (Number(r.total_spending)/1e9).toFixed(2) + "B");
  });

  console.log("\n" + "=".repeat(60));
  console.log("TOP 10 HCPCS OUTLIERS BY SPENDING Z-SCORE:");
  console.log("=".repeat(60));
  hcpcsResult.rows.slice(0, 10).forEach((r, i) => {
    console.log("  " + (i+1) + ". " + r.code + ": z=" + r.spending_zscore + " | $" + (Number(r.total_spending)/1e9).toFixed(2) + "B");
  });

  const data = {
    providerOutliers: providerResult.rows.map(r => ({
      npi: r.npi,
      totalSpending: Number(r.total_spending),
      totalClaims: Number(r.total_claims),
      beneficiaries: Number(r.beneficiaries),
      avgPerClaim: Number(r.avg_per_claim),
      spendingZScore: Number(r.spending_zscore),
      costZScore: Number(r.cost_zscore)
    })),
    hcpcsOutliers: hcpcsResult.rows.map(r => ({
      code: r.code,
      totalSpending: Number(r.total_spending),
      totalClaims: Number(r.total_claims),
      avgPerClaim: Number(r.avg_per_claim),
      providerCount: r.provider_count,
      spendingZScore: Number(r.spending_zscore),
      costZScore: Number(r.cost_zscore)
    })),
    billingMismatches: mismatchResult.rows.map(r => ({
      billingNPI: r.billing_provider_npi,
      servicingNPI: r.servicing_provider_npi,
      spending: Number(r.spending),
      claims: Number(r.claims),
      uniqueCodes: r.unique_codes,
      spendingZScore: Number(r.spending_zscore)
    })),
    metadata: {
      computedAt: new Date().toISOString(),
      methodology: 'Full dataset analysis (227M rows, z-score threshold: 3)',
      providerCount: providerResult.rows.length,
      hcpcsCount: hcpcsResult.rows.length,
      mismatchCount: mismatchResult.rows.length
    }
  };

  fs.writeFileSync('/tmp/outliers_full.json', JSON.stringify(data, null, 2));
  console.log("\nSaved to /tmp/outliers_full.json");

  await pool.end();
}

run().catch(e => { console.error(e); process.exit(1); });
