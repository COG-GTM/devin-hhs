import pg from 'pg';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  const res = await pool.query(`
    SELECT table_name, pg_size_pretty(pg_total_relation_size(quote_ident(table_name))) as size
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY pg_total_relation_size(quote_ident(table_name)) DESC
  `);
  
  console.log('Tables in database:');
  res.rows.forEach(r => console.log('  ' + r.table_name + ': ' + r.size));
  
  // Check provider_locations count
  const plCount = await pool.query('SELECT COUNT(*) FROM provider_locations');
  console.log('\nprovider_locations count:', plCount.rows[0].count);
  
  await pool.end();
}

run().catch(console.error);
