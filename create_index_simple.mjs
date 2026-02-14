import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new pg.Pool({ 
  connectionString: process.env.DATABASE_URL, 
  ssl: { rejectUnauthorized: false },
  statement_timeout: 0
});

async function run() {
  console.log('Creating NPI index (CONCURRENTLY - non-blocking)...');
  
  try {
    // Create index concurrently (doesn't lock table)
    await pool.query(`
      CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_billing_npi 
      ON medicaid_provider_spending (billing_provider_npi)
    `);
    console.log('Index created: idx_billing_npi');
  } catch (e) {
    console.log('Index may already exist or error:', e.message);
  }

  // Verify
  const indexes = await pool.query(`
    SELECT indexname, indexdef 
    FROM pg_indexes 
    WHERE tablename = 'medicaid_provider_spending'
  `);
  console.log('\nExisting indexes:');
  indexes.rows.forEach(i => console.log('  -', i.indexname));

  await pool.end();
}

run().catch(console.error);
