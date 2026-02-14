import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  console.log('Starting parallel geo aggregation from 227M rows...');
  
  const stateQuery = `
    SELECT 
      pl.state,
      COUNT(DISTINCT pl.npi)::int as providers,
      SUM(m.tot_mdcd_amt)::numeric as spending,
      SUM(m.tot_claims)::bigint as claims,
      SUM(m.tot_benes)::bigint as beneficiaries
    FROM provider_locations pl
    JOIN medicaid m ON pl.npi = m.billing_npi
    WHERE pl.state IS NOT NULL AND pl.state != '' AND LENGTH(pl.state) = 2
    GROUP BY pl.state
    ORDER BY spending DESC
    LIMIT 60
  `;

  const cityQuery = `
    SELECT 
      pl.city,
      pl.state,
      COUNT(DISTINCT pl.npi)::int as providers,
      SUM(m.tot_mdcd_amt)::numeric as spending,
      SUM(m.tot_claims)::bigint as claims
    FROM provider_locations pl
    JOIN medicaid m ON pl.npi = m.billing_npi
    WHERE pl.city IS NOT NULL AND pl.city != '' AND pl.state IS NOT NULL
    GROUP BY pl.city, pl.state
    ORDER BY spending DESC
    LIMIT 100
  `;

  console.time('parallel-query');
  const [states, cities] = await Promise.all([
    pool.query(stateQuery),
    pool.query(cityQuery)
  ]);
  console.timeEnd('parallel-query');

  console.log('\n=== TOP 10 STATES BY SPENDING ===');
  states.rows.slice(0, 10).forEach(s => {
    console.log(s.state + ': $' + (Number(s.spending)/1e9).toFixed(2) + 'B (' + s.providers + ' providers)');
  });

  console.log('\n=== TOP 10 CITIES BY SPENDING ===');
  cities.rows.slice(0, 10).forEach(c => {
    console.log(c.city + ', ' + c.state + ': $' + (Number(c.spending)/1e9).toFixed(2) + 'B');
  });

  fs.writeFileSync('/tmp/state_spending_db.json', JSON.stringify(states.rows, null, 2));
  fs.writeFileSync('/tmp/city_spending_db.json', JSON.stringify(cities.rows, null, 2));
  
  console.log('\nSaved results to /tmp/');
  
  await pool.end();
}

run().catch(console.error);
