// Common HCPCS code definitions
export const HCPCS_DEFINITIONS: Record<string, string> = {
  // TOP MEDICAID CODES (from full data analysis)
  'T1019': 'Personal care services, per 15 min',
  'T1015': 'Clinic visit/encounter',
  'T2016': 'Habilitation residential, per diem',
  'S5125': 'Attendant care services, per 15 min',
  'S5126': 'Attendant care services, per hour',
  'T2033': 'Supported residential, per diem',
  'H2015': 'Comprehensive community support, 15 min',
  'H2016': 'Comprehensive community support, per diem',
  'S5170': 'Home delivered meals',
  'T1016': 'Case management, per 15 min',
  'H0043': 'Assertive community treatment, per diem',
  'T2003': 'Non-emergency transport, encounter',
  'S5102': 'Adult day care, per hour',
  'A0100': 'Non-emergency transport, flat rate',
  'H0038': 'Self-help/peer services, per 15 min',
  'J2326': 'Nusinersen injection (Spinraza)',
  'J1426': 'Voretigene neparvovec-rzyl (Luxturna)',
  'J7170': 'Emicizumab-kxwh injection (Hemlibra)',
  'J1428': 'Eteplirsen injection (Exondys 51)',
  'H2014': 'Skills training, per 15 min',
  
  // HIGH-REPEAT PROCEDURES (most claims per beneficiary)
  '1286Z': 'COVID-19 vaccine administration (multi-dose)',
  '1286A': 'COVID-19 vaccine administration (booster)',
  '1286C': 'COVID-19 vaccine administration (pediatric)',
  'X5635': 'ESRD dialysis training, per session',
  'W0038': 'Behavioral health assessment, extended',
  'W00R2': 'Telehealth behavioral health visit',
  'S9326': 'Home infusion therapy, per hour',
  'W9047': 'Complex case management, per 15 min',
  'T2012': 'Habilitation day program, per diem',
  '1431Z': 'Monoclonal antibody admin (COVID-19)',
  'T2027': 'Specialized training, per 15 min',
  '90947': 'Dialysis procedure, complex',
  'M0167': 'COVID-19 monoclonal antibody infusion',
  'M0122': 'COVID-19 antiviral therapy administration',
  'M0151': 'Therapeutic drug monitoring, complex',
  'M0123': 'COVID-19 treatment pathway management',
  'M0166': 'COVID-19 antibody infusion (sotrovimab)',
  'M0150': 'Therapeutic plasma exchange',
  'M0152': 'Complex infusion therapy management',
  'M0125': 'COVID-19 oral antiviral administration',
  '1437Z': 'Immunization administration (influenza)',
  'M0124': 'COVID-19 post-exposure prophylaxis',
  '1439Z': 'Vaccine administration (pediatric series)',
  'W1793': 'Chronic care management, per month',

  // Evaluation & Management
  '99201': 'Office visit, new patient, minimal',
  '99202': 'Office visit, new patient, low complexity',
  '99203': 'Office visit, new patient, moderate complexity',
  '99204': 'Office visit, new patient, high complexity',
  '99205': 'Office visit, new patient, highest complexity',
  '99211': 'Office visit, established patient, minimal',
  '99212': 'Office visit, established patient, straightforward',
  '99213': 'Office visit, established patient, low complexity',
  '99214': 'Office visit, established patient, moderate complexity',
  '99215': 'Office visit, established patient, high complexity',
  '99281': 'Emergency dept visit, minimal',
  '99282': 'Emergency dept visit, low complexity',
  '99283': 'Emergency dept visit, moderate complexity',
  '99284': 'Emergency dept visit, high complexity',
  '99285': 'Emergency dept visit, highest complexity',
  '99291': 'Critical care, first 30-74 min',
  '99292': 'Critical care, each additional 30 min',
  
  // Preventive Care
  '99381': 'Preventive visit, new patient, infant',
  '99382': 'Preventive visit, new patient, 1-4 years',
  '99383': 'Preventive visit, new patient, 5-11 years',
  '99384': 'Preventive visit, new patient, 12-17 years',
  '99385': 'Preventive visit, new patient, 18-39 years',
  '99386': 'Preventive visit, new patient, 40-64 years',
  '99387': 'Preventive visit, new patient, 65+ years',
  '99391': 'Preventive visit, established, infant',
  '99392': 'Preventive visit, established, 1-4 years',
  '99393': 'Preventive visit, established, 5-11 years',
  '99394': 'Preventive visit, established, 12-17 years',
  '99395': 'Preventive visit, established, 18-39 years',
  '99396': 'Preventive visit, established, 40-64 years',
  '99397': 'Preventive visit, established, 65+ years',
  
  // Mental Health
  '90834': 'Psychotherapy, 45 min',
  '90837': 'Psychotherapy, 60 min',
  '90847': 'Family psychotherapy with patient',
  '90853': 'Group psychotherapy',
  '96110': 'Developmental screening',
  '96127': 'Brief emotional/behavioral assessment',
  
  // Lab & Diagnostics
  '80053': 'Comprehensive metabolic panel',
  '80061': 'Lipid panel',
  '81001': 'Urinalysis with microscopy',
  '82947': 'Glucose test',
  '83036': 'Hemoglobin A1C',
  '84443': 'Thyroid stimulating hormone (TSH)',
  '84445': 'Thyroid stimulating immune globulins',
  '85018': 'Hemoglobin',
  '85025': 'Complete blood count (CBC)',
  '85027': 'Complete blood count, automated',
  '36415': 'Blood draw, venipuncture',
  
  // Imaging
  '70553': 'Brain MRI with/without contrast',
  '71046': 'Chest X-ray, 2 views',
  '71250': 'CT scan, chest without contrast',
  '72110': 'Spine X-ray, complete',
  '72148': 'MRI lumbar spine without contrast',
  '73721': 'MRI joint lower extremity',
  '76856': 'Pelvic ultrasound',
  '77067': 'Screening mammography',
  '93000': 'Electrocardiogram (ECG/EKG)',
  
  // Procedures
  '11102': 'Tangential biopsy, skin',
  '17110': 'Destruction of benign lesions',
  '20610': 'Joint injection, large',
  '43239': 'Upper GI endoscopy with biopsy',
  '45380': 'Colonoscopy with biopsy',
  '96372': 'Therapeutic injection',
  '96415': 'Chemotherapy infusion',
  
  // Dental
  'D0120': 'Periodic oral evaluation',
  'D0140': 'Limited oral evaluation',
  'D0150': 'Comprehensive oral evaluation',
  'D0210': 'Intraoral X-rays, complete series',
  'D0220': 'Intraoral X-ray, first film',
  'D0230': 'Intraoral X-ray, each additional',
  'D0274': 'Bitewings, four films',
  'D1110': 'Prophylaxis (cleaning), adult',
  'D1120': 'Prophylaxis (cleaning), child',
  'D1206': 'Topical fluoride varnish',
  'D1351': 'Sealant, per tooth',
  'D2140': 'Amalgam filling, one surface',
  'D2150': 'Amalgam filling, two surfaces',
  'D2330': 'Resin filling, one surface, anterior',
  'D2391': 'Resin filling, one surface, posterior',
  'D2392': 'Resin filling, two surfaces, posterior',
  'D7140': 'Extraction, erupted tooth',
  'D7210': 'Extraction, surgical',
  'D8660': 'Pre-orthodontic visit',
  
  // Vision
  'V2020': 'Single vision lens, glass or plastic',
  'V2100': 'Single vision lens, sphere only',
  'V2300': 'Bifocal lens, sphere only',
  'S0620': 'Routine ophthalmological exam',
  '92014': 'Comprehensive eye exam, established',
  
  // Vaccines
  '90460': 'Immunization admin, first component',
  '90471': 'Immunization admin, one vaccine',
  '90472': 'Immunization admin, each additional',
  '90651': 'HPV vaccine, 9-valent',
  '90658': 'Flu vaccine, trivalent',
  '90686': 'Flu vaccine, quadrivalent',
  '90715': 'Tdap vaccine',
  '90732': 'Pneumococcal vaccine',
  '0001A': 'COVID-19 vaccine admin, Pfizer, 1st dose',
  '0002A': 'COVID-19 vaccine admin, Pfizer, 2nd dose',
  '0003A': 'COVID-19 vaccine admin, Moderna, 1st dose',
  '0004A': 'COVID-19 vaccine admin, Moderna, 2nd dose',
  
  // DME & Supplies
  'A0425': 'Ground mileage, ambulance',
  'A0429': 'Ambulance, BLS emergency',
  'A0433': 'Ambulance, ALS level 2',
  'E0570': 'Nebulizer with compressor',
  
  // Physical/Occupational Therapy
  '97110': 'Therapeutic exercises',
  '97112': 'Neuromuscular re-education',
  '97140': 'Manual therapy techniques',
  '97530': 'Therapeutic activities',
  '97535': 'Self-care training',
};

export function getHCPCSDefinition(code: string): string {
  return HCPCS_DEFINITIONS[code] || 'Procedure code';
}

export function getHCPCSCategory(code: string): string {
  if (code.startsWith('99')) return 'Evaluation & Management';
  if (code.startsWith('90')) return 'Medicine/Vaccines';
  if (code.startsWith('8')) return 'Lab/Pathology';
  if (code.startsWith('7')) return 'Radiology/Imaging';
  if (code.startsWith('9')) return 'Medicine';
  if (code.startsWith('D')) return 'Dental';
  if (code.startsWith('V')) return 'Vision';
  if (code.startsWith('A')) return 'Ambulance/Transport';
  if (code.startsWith('E')) return 'DME Equipment';
  if (code.startsWith('0')) return 'Temporary/New Codes';
  return 'Other';
}
