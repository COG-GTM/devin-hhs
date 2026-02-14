import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false }
});

async function run() {
  // Top 6 NPIs from homepage
  const TOP_NPIS = [
    '1417262056', // PUBLIC PARTNERSHIPS LLC
    '1699703827', // LA COUNTY MENTAL HEALTH
    '1376609297', // TEMPUS UNLIMITED
    '1356614135', // #4
    '1164788846', // #5
    '1013332655'  // #6
  ];

  console.log('Creating indexes for top 6 provider NPIs...');
  
  // Create partial index for these specific NPIs (very fast lookups)
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_medicaid_top_npis 
    ON medicaid_provider_spending (billing_provider_npi)
    WHERE billing_provider_npi IN ('1417262056', '1699703827', '1376609297', '1356614135', '1164788846', '1013332655')
  `);
  console.log('Created partial index: idx_medicaid_top_npis');

  // Also create general NPI index if not exists
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_medicaid_billing_npi 
    ON medicaid_provider_spending (billing_provider_npi)
  `);
  console.log('Created general index: idx_medicaid_billing_npi');

  // Provider locations index
  await pool.query(`
    CREATE INDEX IF NOT EXISTS idx_provider_locations_npi 
    ON provider_locations (npi)
  `);
  console.log('Created index: idx_provider_locations_npi');

  // Test query speed
  console.log('\nTesting query speed for top NPI...');
  console.time('query');
  const result = await pool.query(`
    SELECT billing_provider_npi, SUM(total_paid) as total
    FROM medicaid_provider_spending 
    WHERE billing_provider_npi = '1417262056'
    GROUP BY billing_provider_npi
  `);
  console.timeEnd('query');
  console.log('Result:', result.rows[0]);

  await pool.end();
  console.log('\nIndexes created successfully!');
}

run().catch(console.error);
