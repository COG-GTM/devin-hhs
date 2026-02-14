import pg from 'pg';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

async function run() {
  // First check schema
  console.log('Checking medicaid_provider_spending schema...');
  const schema = await pool.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'medicaid_provider_spending'
    LIMIT 15
  `);
  schema.rows.forEach(r => console.log('  ' + r.column_name + ': ' + r.data_type));
  
  await pool.end();
}

run().catch(console.error);
