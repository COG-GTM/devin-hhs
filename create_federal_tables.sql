-- Federal funding by state and year
CREATE TABLE IF NOT EXISTS federal_funding (
  id SERIAL PRIMARY KEY,
  state_code CHAR(2) NOT NULL,
  state_name VARCHAR(50),
  fiscal_year INTEGER NOT NULL,
  fmap_rate DECIMAL(5,2),
  expansion_status CHAR(1),
  federal_spending DECIMAL(18,2),
  state_spending DECIMAL(18,2),
  total_spending DECIMAL(18,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(state_code, fiscal_year)
);

-- Congressional district reference
CREATE TABLE IF NOT EXISTS congressional_districts (
  id SERIAL PRIMARY KEY,
  district_code VARCHAR(10) NOT NULL UNIQUE,
  state_code CHAR(2) NOT NULL,
  state_fips CHAR(2),
  district_number VARCHAR(2) NOT NULL,
  district_name VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Pre-computed district spending aggregates
CREATE TABLE IF NOT EXISTS district_spending (
  id SERIAL PRIMARY KEY,
  district_code VARCHAR(10) NOT NULL,
  fiscal_year INTEGER,
  total_spending DECIMAL(18,2),
  total_claims BIGINT,
  total_beneficiaries BIGINT,
  provider_count INTEGER,
  spending_z_score DECIMAL(8,2),
  per_capita DECIMAL(10,2),
  top_hcpcs_codes JSONB,
  analogy JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(district_code, fiscal_year)
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_federal_funding_state ON federal_funding(state_code);
CREATE INDEX IF NOT EXISTS idx_federal_funding_year ON federal_funding(fiscal_year);
CREATE INDEX IF NOT EXISTS idx_district_spending_code ON district_spending(district_code);
CREATE INDEX IF NOT EXISTS idx_districts_state ON congressional_districts(state_code);
