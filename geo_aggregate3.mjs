import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false },
  statement_timeout: 180000 // 3 min timeout
});

async function run() {
  console.log('Starting parallel geo aggregation from 227M rows...');
  console.log('Using: medicaid_provider_spending (24GB) + provider_locations (1.3GB)');
  
  const stateQuery = `
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
  `;

  const cityQuery = `
    SELECT 
      pl.city,
      pl.state,
      COUNT(DISTINCT pl.npi)::int as providers,
      SUM(m.total_paid)::numeric as spending,
      SUM(m.total_claims)::bigint as claims
    FROM provider_locations pl
    JOIN medicaid_provider_spending m ON pl.npi = m.billing_provider_npi
    WHERE pl.city IS NOT NULL AND pl.state IS NOT NULL AND LENGTH(pl.state) = 2
    GROUP BY pl.city, pl.state
    ORDER BY spending DESC
    LIMIT 100
  `;

  console.time('parallel-geo-query');
  try {
    const [states, cities] = await Promise.all([
      pool.query(stateQuery),
      pool.query(cityQuery)
    ]);
    console.timeEnd('parallel-geo-query');

    console.log('\n=== TOP 15 STATES BY SPENDING ===');
    states.rows.slice(0, 15).forEach(s => {
      console.log(s.state + ': $' + (Number(s.spending)/1e9).toFixed(2) + 'B (' + s.providers.toLocaleString() + ' providers)');
    });

    console.log('\n=== TOP 15 CITIES BY SPENDING ===');
    cities.rows.slice(0, 15).forEach(c => {
      console.log(c.city + ', ' + c.state + ': $' + (Number(c.spending)/1e9).toFixed(2) + 'B');
    });

    fs.writeFileSync('/tmp/state_spending_db.json', JSON.stringify(states.rows, null, 2));
    fs.writeFileSync('/tmp/city_spending_db.json', JSON.stringify(cities.rows, null, 2));
    
    console.log('\nSaved ' + states.rows.length + ' states and ' + cities.rows.length + ' cities');
  } catch (err) {
    console.error('Query error:', err.message);
  }
  
  await pool.end();
}

run().catch(console.error);
