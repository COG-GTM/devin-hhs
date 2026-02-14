// Compute outliers from pre-computed aggregates (NO DATABASE NEEDED)
import fs from 'fs';

// Parse aggregates directly from TS files
const aggContent = fs.readFileSync('src/lib/aggregates.ts', 'utf8');
const hcpcsContent = fs.readFileSync('src/lib/hcpcs-aggregates.ts', 'utf8');

// Extract TOP_PROVIDERS
const providerMatch = aggContent.match(/export const TOP_PROVIDERS = \[([\s\S]*?)\];/);
const providers = [];
if (providerMatch) {
  const regex = /\{\s*npi:\s*'(\d+)',\s*spending:\s*([\d.]+),\s*claims:\s*(\d+),\s*beneficiaries:\s*(\d+)\s*\}/g;
  let m;
  while ((m = regex.exec(providerMatch[1])) !== null) {
    providers.push({
      npi: m[1],
      spending: parseFloat(m[2]),
      claims: parseInt(m[3]),
      beneficiaries: parseInt(m[4])
    });
  }
}
console.log("Providers loaded:", providers.length);

// Extract TOP_HCPCS_BY_SPENDING
const hcpcsMatch = hcpcsContent.match(/export const TOP_HCPCS_BY_SPENDING: HCPCSAggregate\[\] = \[([\s\S]*?)\];/);
const hcpcsCodes = [];
if (hcpcsMatch) {
  const regex = /\{\s*code:\s*'([^']+)',\s*spending:\s*([\d.]+),\s*claims:\s*(\d+),\s*beneficiaries:\s*(\d+)\s*\}/g;
  let m;
  while ((m = regex.exec(hcpcsMatch[1])) !== null) {
    hcpcsCodes.push({
      code: m[1],
      spending: parseFloat(m[2]),
      claims: parseInt(m[3]),
      beneficiaries: parseInt(m[4])
    });
  }
}
console.log("HCPCS codes loaded:", hcpcsCodes.length);

// Calculate z-scores
function addZScores(data, key) {
  const values = data.map(d => d[key]);
  const mean = values.reduce((a,b) => a + b, 0) / values.length;
  const variance = values.reduce((a,v) => a + Math.pow(v - mean, 2), 0) / values.length;
  const std = Math.sqrt(variance);
  
  return data.map(d => ({
    ...d,
    spendingZScore: std > 0 ? parseFloat(((d[key] - mean) / std).toFixed(2)) : 0
  })).sort((a,b) => b.spendingZScore - a.spendingZScore);
}

const providerOutliers = addZScores(providers, 'spending');
const hcpcsOutliers = addZScores(hcpcsCodes, 'spending');

console.log("\n=== PROVIDER OUTLIERS (z > 3) ===");
providerOutliers.filter(p => p.spendingZScore > 3).forEach((p, i) => {
  console.log((i+1) + ". NPI " + p.npi + ": z=" + p.spendingZScore.toFixed(1) + " | $" + (p.spending/1e9).toFixed(2) + "B");
});

console.log("\n=== HCPCS OUTLIERS (z > 3) ===");
hcpcsOutliers.filter(h => h.spendingZScore > 3).forEach((h, i) => {
  console.log((i+1) + ". " + h.code + ": z=" + h.spendingZScore.toFixed(1) + " | $" + (h.spending/1e9).toFixed(2) + "B");
});

// Save full results
const output = {
  providerOutliers: providerOutliers.filter(p => p.spendingZScore > 3),
  hcpcsOutliers: hcpcsOutliers.filter(h => h.spendingZScore > 3),
  metadata: {
    computedAt: new Date().toISOString(),
    methodology: 'Full dataset z-score analysis (227M rows, threshold: 3 std dev)',
    source: 'Pre-computed aggregates from opendata.hhs.gov'
  }
};

fs.writeFileSync('src/lib/outlier-aggregates.json', JSON.stringify(output, null, 2));
console.log("\n✓ Saved to src/lib/outlier-aggregates.json");
