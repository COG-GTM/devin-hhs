#!/usr/bin/env python3
"""
Build Congressional District mapping using state-level data
For exact ZIP-to-CD, we need the Census relationship files (offline download)
This creates a pragmatic initial mapping based on state aggregation
"""
import json
import csv
from collections import defaultdict

# Load congressional districts
with open('congressional_districts.csv') as f:
    reader = csv.DictReader(f)
    districts = list(reader)

# Count CDs per state
cds_per_state = defaultdict(list)
for d in districts:
    state_fips = d['state_fips']
    cds_per_state[state_fips].append({
        'district': d['district_number'],
        'name': d['district_name']
    })

# State FIPS to code mapping
FIPS_TO_STATE = {
    '01': 'AL', '02': 'AK', '04': 'AZ', '05': 'AR', '06': 'CA',
    '08': 'CO', '09': 'CT', '10': 'DE', '11': 'DC', '12': 'FL',
    '13': 'GA', '15': 'HI', '16': 'ID', '17': 'IL', '18': 'IN',
    '19': 'IA', '20': 'KS', '21': 'KY', '22': 'LA', '23': 'ME',
    '24': 'MD', '25': 'MA', '26': 'MI', '27': 'MN', '28': 'MS',
    '29': 'MO', '30': 'MT', '31': 'NE', '32': 'NV', '33': 'NH',
    '34': 'NJ', '35': 'NM', '36': 'NY', '37': 'NC', '38': 'ND',
    '39': 'OH', '40': 'OK', '41': 'OR', '42': 'PA', '44': 'RI',
    '45': 'SC', '46': 'SD', '47': 'TN', '48': 'TX', '49': 'UT',
    '50': 'VT', '51': 'VA', '53': 'WA', '54': 'WV', '55': 'WI',
    '56': 'WY', '72': 'PR', '78': 'VI', '66': 'GU', '60': 'AS',
    '69': 'MP'
}

# Create CD reference file
cd_output = []
for state_fips, cds in cds_per_state.items():
    state_code = FIPS_TO_STATE.get(state_fips, state_fips)
    for cd in cds:
        district_code = f"{state_code}-{cd['district']}"
        cd_output.append({
            'district_code': district_code,
            'state_code': state_code,
            'state_fips': state_fips,
            'district_number': cd['district'],
            'district_name': cd['name']
        })

# Save CD reference
with open('cd_reference.json', 'w') as f:
    json.dump(cd_output, f, indent=2)

print(f"Created {len(cd_output)} congressional district references")

# Create summary
state_cd_count = {FIPS_TO_STATE.get(k, k): len(v) for k, v in cds_per_state.items()}
print(f"\nCDs by state (sample):")
for state in ['CA', 'TX', 'FL', 'NY', 'PA']:
    if state in state_cd_count:
        print(f"  {state}: {state_cd_count[state]} districts")
