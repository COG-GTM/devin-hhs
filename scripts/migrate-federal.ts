import { Pool } from 'pg';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// FMAP Data with sources
const FMAP_DATA = [
  { stateCode: 'AL', stateName: 'Alabama', fy2024: 73.10, fy2023: 72.64, fy2022: 72.18, expansionStatus: 'N' },
  { stateCode: 'AK', stateName: 'Alaska', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'AZ', stateName: 'Arizona', fy2024: 76.30, fy2023: 74.36, fy2022: 73.63, expansionStatus: 'Y' },
  { stateCode: 'AR', stateName: 'Arkansas', fy2024: 73.43, fy2023: 70.99, fy2022: 70.58, expansionStatus: 'Y' },
  { stateCode: 'CA', stateName: 'California', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'CO', stateName: 'Colorado', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'CT', stateName: 'Connecticut', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'DE', stateName: 'Delaware', fy2024: 60.34, fy2023: 58.46, fy2022: 58.15, expansionStatus: 'Y' },
  { stateCode: 'DC', stateName: 'District of Columbia', fy2024: 70.00, fy2023: 70.00, fy2022: 70.00, expansionStatus: 'Y' },
  { stateCode: 'FL', stateName: 'Florida', fy2024: 65.06, fy2023: 62.91, fy2022: 61.87, expansionStatus: 'N' },
  { stateCode: 'GA', stateName: 'Georgia', fy2024: 67.03, fy2023: 66.68, fy2022: 66.71, expansionStatus: 'N' },
  { stateCode: 'HI', stateName: 'Hawaii', fy2024: 53.05, fy2023: 50.47, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'ID', stateName: 'Idaho', fy2024: 70.39, fy2023: 70.01, fy2022: 70.73, expansionStatus: 'Y' },
  { stateCode: 'IL', stateName: 'Illinois', fy2024: 52.07, fy2023: 50.07, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'IN', stateName: 'Indiana', fy2024: 67.93, fy2023: 67.02, fy2022: 66.61, expansionStatus: 'Y' },
  { stateCode: 'IA', stateName: 'Iowa', fy2024: 63.09, fy2023: 63.15, fy2022: 62.34, expansionStatus: 'Y' },
  { stateCode: 'KS', stateName: 'Kansas', fy2024: 61.20, fy2023: 59.68, fy2022: 59.45, expansionStatus: 'N' },
  { stateCode: 'KY', stateName: 'Kentucky', fy2024: 74.42, fy2023: 72.02, fy2022: 71.98, expansionStatus: 'Y' },
  { stateCode: 'LA', stateName: 'Louisiana', fy2024: 66.39, fy2023: 64.49, fy2022: 64.01, expansionStatus: 'Y' },
  { stateCode: 'ME', stateName: 'Maine', fy2024: 66.03, fy2023: 65.65, fy2022: 65.79, expansionStatus: 'Y' },
  { stateCode: 'MD', stateName: 'Maryland', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'MA', stateName: 'Massachusetts', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'MI', stateName: 'Michigan', fy2024: 66.89, fy2023: 65.51, fy2022: 65.54, expansionStatus: 'Y' },
  { stateCode: 'MN', stateName: 'Minnesota', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'MS', stateName: 'Mississippi', fy2024: 78.82, fy2023: 78.03, fy2022: 77.77, expansionStatus: 'N' },
  { stateCode: 'MO', stateName: 'Missouri', fy2024: 66.77, fy2023: 66.29, fy2022: 66.03, expansionStatus: 'Y' },
  { stateCode: 'MT', stateName: 'Montana', fy2024: 65.74, fy2023: 64.71, fy2022: 65.02, expansionStatus: 'Y' },
  { stateCode: 'NE', stateName: 'Nebraska', fy2024: 53.93, fy2023: 52.17, fy2022: 51.72, expansionStatus: 'Y' },
  { stateCode: 'NV', stateName: 'Nevada', fy2024: 66.21, fy2023: 65.67, fy2022: 66.08, expansionStatus: 'Y' },
  { stateCode: 'NH', stateName: 'New Hampshire', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'NJ', stateName: 'New Jersey', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'NM', stateName: 'New Mexico', fy2024: 74.11, fy2023: 72.49, fy2022: 72.76, expansionStatus: 'Y' },
  { stateCode: 'NY', stateName: 'New York', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'NC', stateName: 'North Carolina', fy2024: 67.78, fy2023: 66.63, fy2022: 66.38, expansionStatus: 'Y' },
  { stateCode: 'ND', stateName: 'North Dakota', fy2024: 54.49, fy2023: 52.42, fy2022: 52.24, expansionStatus: 'Y' },
  { stateCode: 'OH', stateName: 'Ohio', fy2024: 64.41, fy2023: 63.04, fy2022: 62.77, expansionStatus: 'Y' },
  { stateCode: 'OK', stateName: 'Oklahoma', fy2024: 67.43, fy2023: 66.13, fy2022: 65.33, expansionStatus: 'Y' },
  { stateCode: 'OR', stateName: 'Oregon', fy2024: 63.87, fy2023: 62.60, fy2022: 62.99, expansionStatus: 'Y' },
  { stateCode: 'PA', stateName: 'Pennsylvania', fy2024: 54.02, fy2023: 52.25, fy2022: 51.94, expansionStatus: 'Y' },
  { stateCode: 'RI', stateName: 'Rhode Island', fy2024: 54.06, fy2023: 52.23, fy2022: 52.18, expansionStatus: 'Y' },
  { stateCode: 'SC', stateName: 'South Carolina', fy2024: 72.21, fy2023: 71.98, fy2022: 71.30, expansionStatus: 'N' },
  { stateCode: 'SD', stateName: 'South Dakota', fy2024: 58.66, fy2023: 55.20, fy2022: 55.22, expansionStatus: 'Y' },
  { stateCode: 'TN', stateName: 'Tennessee', fy2024: 66.83, fy2023: 66.07, fy2022: 65.68, expansionStatus: 'N' },
  { stateCode: 'TX', stateName: 'Texas', fy2024: 61.05, fy2023: 58.48, fy2022: 58.00, expansionStatus: 'N' },
  { stateCode: 'UT', stateName: 'Utah', fy2024: 69.63, fy2023: 68.31, fy2022: 69.16, expansionStatus: 'Y' },
  { stateCode: 'VT', stateName: 'Vermont', fy2024: 58.86, fy2023: 59.81, fy2022: 59.03, expansionStatus: 'Y' },
  { stateCode: 'VA', stateName: 'Virginia', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'WA', stateName: 'Washington', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'Y' },
  { stateCode: 'WV', stateName: 'West Virginia', fy2024: 76.46, fy2023: 75.40, fy2022: 75.25, expansionStatus: 'Y' },
  { stateCode: 'WI', stateName: 'Wisconsin', fy2024: 61.43, fy2023: 60.22, fy2022: 59.66, expansionStatus: 'N' },
  { stateCode: 'WY', stateName: 'Wyoming', fy2024: 50.00, fy2023: 50.00, fy2022: 50.00, expansionStatus: 'N' },
];

// State spending from geo-aggregates with Census population
const STATE_SPENDING = [
  { state: 'NY', spending: 137514151481.5, population: 20201249, perCapita: 6807.21 },
  { state: 'CA', spending: 129397416548.98, population: 39538223, perCapita: 3272.72 },
  { state: 'TX', spending: 56213173602.22, population: 29145505, perCapita: 1928.71 },
  { state: 'MA', spending: 56012122535.04, population: 7029917, perCapita: 7967.68 },
  { state: 'NJ', spending: 46945145475.12, population: 9288994, perCapita: 5053.85 },
  { state: 'MI', spending: 38848847876.72, population: 10077331, perCapita: 3855.07 },
  { state: 'OH', spending: 36958177884.22, population: 11799448, perCapita: 3132.2 },
  { state: 'NC', spending: 34823554528.73, population: 10439388, perCapita: 3335.79 },
  { state: 'FL', spending: 34022877769.1, population: 21538187, perCapita: 1579.65 },
  { state: 'AZ', spending: 33013494371.69, population: 7151502, perCapita: 4616.3 },
  { state: 'VA', spending: 29477020256.62, population: 8631393, perCapita: 3415.09 },
  { state: 'MO', spending: 27987815835.36, population: 6154913, perCapita: 4547.23 },
  { state: 'PA', spending: 27843948565.09, population: 13002700, perCapita: 2141.4 },
  { state: 'MN', spending: 25246515574.34, population: 5706494, perCapita: 4424.17 },
  { state: 'KY', spending: 23522172186.76, population: 4505836, perCapita: 5220.38 },
  { state: 'CO', spending: 21592454585.61, population: 5773714, perCapita: 3739.79 },
  { state: 'TN', spending: 20388322502.8, population: 6910840, perCapita: 2950.19 },
  { state: 'IL', spending: 19820860647.22, population: 12812508, perCapita: 1546.99 },
  { state: 'LA', spending: 19371109841.84, population: 4657757, perCapita: 4158.89 },
  { state: 'MD', spending: 18861742862.12, population: 6177224, perCapita: 3053.43 },
  { state: 'IN', spending: 17388889823.34, population: 6785528, perCapita: 2562.64 },
  { state: 'WA', spending: 16648425726.82, population: 7705281, perCapita: 2160.65 },
  { state: 'CT', spending: 13997282841.57, population: 3605944, perCapita: 3881.72 },
  { state: 'NM', spending: 13687857972.89, population: 2117522, perCapita: 6464.09 },
  { state: 'GA', spending: 12967579483.15, population: 10711908, perCapita: 1210.58 },
  { state: 'IA', spending: 11664822182.23, population: 3190369, perCapita: 3656.26 },
  { state: 'AL', spending: 10340754530.83, population: 5024279, perCapita: 2058.16 },
  { state: 'SC', spending: 10329407472.61, population: 5118425, perCapita: 2018.08 },
  { state: 'MS', spending: 10053208675.71, population: 2961279, perCapita: 3394.89 },
  { state: 'WI', spending: 9799818431.86, population: 5893718, perCapita: 1662.76 },
  { state: 'OK', spending: 9496532688.95, population: 3959353, perCapita: 2398.51 },
  { state: 'ME', spending: 9485102412.67, population: 1362359, perCapita: 6962.26 },
  { state: 'WV', spending: 8555568557.75, population: 1793716, perCapita: 4769.75 },
  { state: 'AR', spending: 8469039106.3, population: 3011524, perCapita: 2812.21 },
  { state: 'KS', spending: 8403764180.0, population: 2937880, perCapita: 2860.49 },
  { state: 'NV', spending: 8058810005.27, population: 3104614, perCapita: 2595.75 },
  { state: 'OR', spending: 7713657866.24, population: 4237256, perCapita: 1820.44 },
  { state: 'RI', spending: 6922199007.0, population: 1097379, perCapita: 6307.94 },
  { state: 'AK', spending: 6176735170.13, population: 733391, perCapita: 8422.16 },
  { state: 'DC', spending: 6105991887.76, population: 689545, perCapita: 8855.1 },
  { state: 'NH', spending: 5990934061.97, population: 1377529, perCapita: 4349.04 },
  { state: 'MT', spending: 5364046928.31, population: 1084225, perCapita: 4947.36 },
  { state: 'UT', spending: 5189980635.69, population: 3271616, perCapita: 1586.37 },
  { state: 'DE', spending: 3953615914.52, population: 989948, perCapita: 3993.76 },
  { state: 'ID', spending: 3549084625.73, population: 1839106, perCapita: 1929.79 },
  { state: 'HI', spending: 2999841924.58, population: 1455271, perCapita: 2061.36 },
  { state: 'VT', spending: 2969162481.61, population: 643077, perCapita: 4617.12 },
  { state: 'SD', spending: 2509806331.19, population: 886667, perCapita: 2830.61 },
  { state: 'NE', spending: 2329339494.48, population: 1961504, perCapita: 1187.53 },
  { state: 'ND', spending: 2156837692.2, population: 779094, perCapita: 2768.39 },
  { state: 'WY', spending: 897779235.77, population: 576851, perCapita: 1556.35 },
];

async function migrate() {
  console.log('Starting federal data migration...');
  
  // Create tables
  console.log('Creating tables...');
  
  await pool.query(`
    CREATE TABLE IF NOT EXISTS federal_fmap (
      id SERIAL PRIMARY KEY,
      state_code VARCHAR(2) NOT NULL,
      state_name VARCHAR(50) NOT NULL,
      fy2024 DECIMAL(5,2) NOT NULL,
      fy2023 DECIMAL(5,2) NOT NULL,
      fy2022 DECIMAL(5,2) NOT NULL,
      expansion_status VARCHAR(1) NOT NULL,
      source_url TEXT DEFAULT 'https://www.medicaid.gov/medicaid/finance/state-financials/federal-matching-rates-and-data/index.html',
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(state_code)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS federal_state_spending (
      id SERIAL PRIMARY KEY,
      state_code VARCHAR(2) NOT NULL,
      total_spending DECIMAL(15,2) NOT NULL,
      population INTEGER NOT NULL,
      per_capita DECIMAL(10,2) NOT NULL,
      census_year INTEGER DEFAULT 2020,
      source_url TEXT DEFAULT 'https://data.census.gov/',
      created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(state_code)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS data_sources (
      id SERIAL PRIMARY KEY,
      source_name VARCHAR(100) NOT NULL,
      source_url TEXT NOT NULL,
      description TEXT,
      data_type VARCHAR(50),
      last_updated DATE,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `);

  console.log('Tables created.');

  // Insert FMAP data
  console.log('Inserting FMAP data...');
  for (const row of FMAP_DATA) {
    await pool.query(`
      INSERT INTO federal_fmap (state_code, state_name, fy2024, fy2023, fy2022, expansion_status)
      VALUES ($1, $2, $3, $4, $5, $6)
      ON CONFLICT (state_code) DO UPDATE SET
        fy2024 = EXCLUDED.fy2024,
        fy2023 = EXCLUDED.fy2023,
        fy2022 = EXCLUDED.fy2022,
        expansion_status = EXCLUDED.expansion_status
    `, [row.stateCode, row.stateName, row.fy2024, row.fy2023, row.fy2022, row.expansionStatus]);
  }
  console.log(`Inserted ${FMAP_DATA.length} FMAP records.`);

  // Insert state spending data
  console.log('Inserting state spending data...');
  for (const row of STATE_SPENDING) {
    await pool.query(`
      INSERT INTO federal_state_spending (state_code, total_spending, population, per_capita)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (state_code) DO UPDATE SET
        total_spending = EXCLUDED.total_spending,
        population = EXCLUDED.population,
        per_capita = EXCLUDED.per_capita
    `, [row.state, row.spending, row.population, row.perCapita]);
  }
  console.log(`Inserted ${STATE_SPENDING.length} state spending records.`);

  // Insert data sources
  console.log('Inserting data source references...');
  const sources = [
    {
      name: 'CMS FMAP Rates',
      url: 'https://www.medicaid.gov/medicaid/finance/state-financials/federal-matching-rates-and-data/index.html',
      description: 'Federal Medical Assistance Percentage (FMAP) rates published by CMS',
      type: 'fmap'
    },
    {
      name: 'Census 2020 Population',
      url: 'https://data.census.gov/',
      description: 'U.S. Census Bureau 2020 Decennial Census population data',
      type: 'population'
    },
    {
      name: 'HHS Medicaid Provider Utilization',
      url: 'https://data.cms.gov/provider-summary-by-type-of-service/medicare-physician-other-practitioners/medicaid-provider-utilization-and-payment-data',
      description: 'Medicaid provider spending and utilization data from HHS Open Data',
      type: 'spending'
    },
    {
      name: 'KFF Medicaid Expansion Status',
      url: 'https://www.kff.org/medicaid/issue-brief/status-of-state-medicaid-expansion-decisions-interactive-map/',
      description: 'Kaiser Family Foundation tracking of Medicaid expansion decisions by state',
      type: 'expansion'
    }
  ];

  for (const src of sources) {
    await pool.query(`
      INSERT INTO data_sources (source_name, source_url, description, data_type)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT DO NOTHING
    `, [src.name, src.url, src.description, src.type]);
  }
  console.log('Data sources inserted.');

  // Verify
  const fmapCount = await pool.query('SELECT COUNT(*) FROM federal_fmap');
  const spendingCount = await pool.query('SELECT COUNT(*) FROM federal_state_spending');
  const sourcesCount = await pool.query('SELECT COUNT(*) FROM data_sources');

  console.log('\n=== Migration Complete ===');
  console.log(`FMAP records: ${fmapCount.rows[0].count}`);
  console.log(`State spending records: ${spendingCount.rows[0].count}`);
  console.log(`Data sources: ${sourcesCount.rows[0].count}`);

  await pool.end();
}

migrate().catch(console.error);
