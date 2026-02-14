import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false },
  statement_timeout: 0  // No timeout for DDL
});

async function run() {
  console.log('Creating materialized views for geo aggregates...');
  
  // Create state aggregation view
  console.log('Creating state_spending_mv...');
  await pool.query(`
    DROP MATERIALIZED VIEW IF EXISTS state_spending_mv;
    CREATE MATERIALIZED VIEW state_spending_mv AS
    SELECT 
      pl.state,
      COUNT(DISTINCT pl.npi)::int as providers,
      SUM(m.total_paid)::numeric as spending,
      SUM(m.total_claims)::bigint as claims,
      SUM(m.total_unique_beneficiaries)::bigint as beneficiaries
    FROM provider_locations pl
    JOIN medicaid_provider_spending m ON pl.npi = m.billing_provider_npi
    WHERE pl.state IS NOT NULL AND LENGTH(pl.state) = 2
    GROUP BY pl.state
    ORDER BY spending DESC
  `);
  console.log('state_spending_mv created!');

  // Create city aggregation view
  console.log('Creating city_spending_mv...');
  await pool.query(`
    DROP MATERIALIZED VIEW IF EXISTS city_spending_mv;
    CREATE MATERIALIZED VIEW city_spending_mv AS
    SELECT 
      pl.city,
      pl.state,
      COUNT(DISTINCT pl.npi)::int as providers,
      SUM(m.total_paid)::numeric as spending,
      SUM(m.total_claims)::bigint as claims
    FROM provider_locations pl
    JOIN medicaid_provider_spending m ON pl.npi = m.billing_provider_npi
    WHERE pl.city IS NOT NULL AND LENGTH(pl.state) = 2
    GROUP BY pl.city, pl.state
    ORDER BY spending DESC
    LIMIT 500
  `);
  console.log('city_spending_mv created!');

  // Query results
  console.log('\nQuerying state results...');
  const states = await pool.query('SELECT * FROM state_spending_mv LIMIT 15');
  console.log('\n=== TOP 15 STATES ===');
  states.rows.forEach(s => {
    console.log(s.state + ': $' + (Number(s.spending)/1e9).toFixed(2) + 'B (' + s.providers.toLocaleString() + ' providers)');
  });

  const cities = await pool.query('SELECT * FROM city_spending_mv LIMIT 15');
  console.log('\n=== TOP 15 CITIES ===');
  cities.rows.forEach(c => {
    console.log(c.city + ', ' + c.state + ': $' + (Number(c.spending)/1e9).toFixed(2) + 'B');
  });

  // Save to JSON
  const fs = await import('fs');
  fs.default.writeFileSync('/tmp/state_spending_db.json', JSON.stringify(states.rows, null, 2));
  fs.default.writeFileSync('/tmp/city_spending_db.json', JSON.stringify(cities.rows, null, 2));
  
  console.log('\nMaterialized views created and results saved!');
  
  await pool.end();
}

run().catch(console.error);
