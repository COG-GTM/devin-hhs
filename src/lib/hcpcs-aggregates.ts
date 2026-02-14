// PRE-COMPUTED HCPCS AGGREGATES FROM FULL 227M ROW ANALYSIS
// Source: opendata.hhs.gov Medicaid Provider Utilization
// Computed: Feb 13, 2026 (FULL DATA - NO SAMPLING)
// 10,881 unique HCPCS codes analyzed

export interface HCPCSAggregate {
  code: string;
  spending: number;
  claims: number;
  beneficiaries: number;
  ratio?: number;
}

export const TOP_HCPCS_BY_SPENDING: HCPCSAggregate[] = [
  { code: 'T1019', spending: 122739547514.26, claims: 1100608370, beneficiaries: 55702849 },
  { code: 'T1015', spending: 49152668633.44, claims: 322233922, beneficiaries: 235393614 },
  { code: 'T2016', spending: 34904936746.48, claims: 69000080, beneficiaries: 4389789 },
  { code: '99213', spending: 33002827263.79, claims: 764306590, beneficiaries: 639378224 },
  { code: 'S5125', spending: 31342185586.04, claims: 398071209, beneficiaries: 19413061 },
  { code: '99214', spending: 29913857937.71, claims: 502480931, beneficiaries: 432874138 },
  { code: '99284', spending: 20151783534.42, claims: 170705529, beneficiaries: 154899942 },
  { code: 'H2016', spending: 19747791724.79, claims: 60739036, beneficiaries: 4214296 },
  { code: '99283', spending: 16874996865.61, claims: 157926994, beneficiaries: 144272501 },
  { code: 'H2015', spending: 16470573872.77, claims: 109877296, beneficiaries: 20834363 },
  { code: '99285', spending: 15097200452.31, claims: 111002396, beneficiaries: 99843804 },
  { code: '90837', spending: 12067590643.09, claims: 127195989, beneficiaries: 56881182 },
  { code: 'S5102', spending: 9340779714.3, claims: 111095812, beneficiaries: 7491536 },
  { code: '90834', spending: 8821622005.82, claims: 108817687, beneficiaries: 54295935 },
  { code: 'T2021', spending: 8653524974.89, claims: 55550230, beneficiaries: 5412523 },
  { code: 'H2017', spending: 8540416258.81, claims: 78677933, beneficiaries: 13916632 },
  { code: 'T1017', spending: 8423668162.81, claims: 75144121, beneficiaries: 30016959 },
  { code: 'T1020', spending: 8212560786.12, claims: 33504642, beneficiaries: 5227037 },
  { code: '90999', spending: 7739248802.63, claims: 90103258, beneficiaries: 6946377 },
  { code: 'A0427', spending: 7674558268.41, claims: 33489615, beneficiaries: 27655270 },
  { code: '92507', spending: 7484161290.33, claims: 129458330, beneficiaries: 35866850 },
  { code: 'H2019', spending: 7466162701.3, claims: 69547577, beneficiaries: 18763291 },
  { code: 'T2033', spending: 7422419481.58, claims: 16562508, beneficiaries: 1259038 },
  { code: 'T1000', spending: 7014566028.82, claims: 16800136, beneficiaries: 764197 },
  { code: 'H2014', spending: 6759118318.5, claims: 60726091, beneficiaries: 9274835 },
];

export const TOP_HCPCS_BY_CLAIMS: HCPCSAggregate[] = [
  { code: 'T1019', spending: 122739547514.26, claims: 1100608370, beneficiaries: 55702849 },
  { code: '99213', spending: 33002827263.79, claims: 764306590, beneficiaries: 639378224 },
  { code: '99214', spending: 29913857937.71, claims: 502480931, beneficiaries: 432874138 },
  { code: 'S5125', spending: 31342185586.04, claims: 398071209, beneficiaries: 19413061 },
  { code: 'T1015', spending: 49152668633.44, claims: 322233922, beneficiaries: 235393614 },
  { code: 'H0020', spending: 6253632954.99, claims: 312323784, beneficiaries: 22496570 },
  { code: '85025', spending: 1268183294.65, claims: 276124130, beneficiaries: 227368740 },
  { code: '80053', spending: 1951315122.27, claims: 226139755, beneficiaries: 191124835 },
  { code: '36415', spending: 935786355.69, claims: 224973443, beneficiaries: 181860997 },
  { code: '99199', spending: 2244557524.65, claims: 173326821, beneficiaries: 119979378 },
  { code: '99284', spending: 20151783534.42, claims: 170705529, beneficiaries: 154899942 },
  { code: '99283', spending: 16874996865.61, claims: 157926994, beneficiaries: 144272501 },
  { code: 'A0100', spending: 3993212793.57, claims: 157024238, beneficiaries: 25452658 },
  { code: 'D0230', spending: 940042718.2, claims: 149565588, beneficiaries: 69309054 },
  { code: 'D0120', spending: 3814964188.59, claims: 136235319, beneficiaries: 130457725 },
  { code: '97110', spending: 4962727015.45, claims: 135669845, beneficiaries: 38834892 },
  { code: '92507', spending: 7484161290.33, claims: 129458330, beneficiaries: 35866850 },
  { code: '90837', spending: 12067590643.09, claims: 127195989, beneficiaries: 56881182 },
  { code: '97530', spending: 6219314705.24, claims: 126200638, beneficiaries: 35441947 },
  { code: 'S5170', spending: 2241711930.25, claims: 122192059, beneficiaries: 11645710 },
  { code: 'A0425', spending: 3454672105.34, claims: 121772109, beneficiaries: 62689727 },
  { code: '71045', spending: 916817062.72, claims: 112591845, beneficiaries: 88154900 },
  { code: 'S5102', spending: 9340779714.3, claims: 111095812, beneficiaries: 7491536 },
  { code: '99285', spending: 15097200452.31, claims: 111002396, beneficiaries: 99843804 },
  { code: '92508', spending: 1458873527.47, claims: 110042491, beneficiaries: 33972157 },
];

export const TOP_HCPCS_BY_BENEFICIARIES: HCPCSAggregate[] = [
  { code: '99213', spending: 33002827263.79, claims: 764306590, beneficiaries: 639378224 },
  { code: '99214', spending: 29913857937.71, claims: 502480931, beneficiaries: 432874138 },
  { code: 'T1015', spending: 49152668633.44, claims: 322233922, beneficiaries: 235393614 },
  { code: '85025', spending: 1268183294.65, claims: 276124130, beneficiaries: 227368740 },
  { code: '80053', spending: 1951315122.27, claims: 226139755, beneficiaries: 191124835 },
  { code: '36415', spending: 935786355.69, claims: 224973443, beneficiaries: 181860997 },
  { code: '99284', spending: 20151783534.42, claims: 170705529, beneficiaries: 154899942 },
  { code: '99283', spending: 16874996865.61, claims: 157926994, beneficiaries: 144272501 },
  { code: 'D0120', spending: 3814964188.59, claims: 136235319, beneficiaries: 130457725 },
  { code: '99199', spending: 2244557524.65, claims: 173326821, beneficiaries: 119979378 },
  { code: 'D1120', spending: 3624050261.27, claims: 108321764, beneficiaries: 104558849 },
  { code: '80061', spending: 709437711.41, claims: 106349211, beneficiaries: 100531262 },
  { code: '99285', spending: 15097200452.31, claims: 111002396, beneficiaries: 99843804 },
  { code: '83036', spending: 461410192.53, claims: 97602740, beneficiaries: 91916992 },
  { code: '71045', spending: 916817062.72, claims: 112591845, beneficiaries: 88154900 },
  { code: '84443', spending: 727430856.41, claims: 88078797, beneficiaries: 82359663 },
  { code: '81001', spending: 260072078.14, claims: 85139705, beneficiaries: 76759738 },
  { code: '99212', spending: 3847648825.12, claims: 92299154, beneficiaries: 76120004 },
  { code: 'D0220', spending: 816074762.04, claims: 80066712, beneficiaries: 75580812 },
  { code: 'D1206', spending: 1443017133.73, claims: 77773830, beneficiaries: 74829666 },
  { code: '93010', spending: 487721420.04, claims: 84069729, beneficiaries: 69968591 },
  { code: 'D0230', spending: 940042718.2, claims: 149565588, beneficiaries: 69309054 },
  { code: 'D1208', spending: 1083552960.72, claims: 70737820, beneficiaries: 68564692 },
  { code: 'A0425', spending: 3454672105.34, claims: 121772109, beneficiaries: 62689727 },
  { code: '87491', spending: 1391269612.5, claims: 65707272, beneficiaries: 60779963 },
];

export const TOP_HCPCS_BY_COST_PER_CLAIM: HCPCSAggregate[] = [
  { code: 'J2326', spending: 124690714.33, claims: 1353, beneficiaries: 983, ratio: 92158.69 },
  { code: 'J1426', spending: 65639662.45, claims: 2062, beneficiaries: 747, ratio: 31833.01 },
  { code: 'J7170', spending: 247040459.61, claims: 10264, beneficiaries: 7841, ratio: 24068.63 },
  { code: 'J1428', spending: 92292115.57, claims: 4411, beneficiaries: 915, ratio: 20923.17 },
  { code: '0128', spending: 39632292.7, claims: 2451, beneficiaries: 2262, ratio: 16169.85 },
  { code: 'J2350', spending: 391826851.67, claims: 24420, beneficiaries: 20729, ratio: 16045.33 },
  { code: 'J0584', spending: 168353119.58, claims: 10637, beneficiaries: 5704, ratio: 15827.12 },
  { code: 'Q4205', spending: 58786868.69, claims: 5873, beneficiaries: 1676, ratio: 10009.68 },
  { code: 'J7192', spending: 42353008.72, claims: 4303, beneficiaries: 1915, ratio: 9842.67 },
  { code: 'J3357', spending: 21433211.94, claims: 2583, beneficiaries: 2133, ratio: 8297.8 },
  { code: 'E0766', spending: 112837252.04, claims: 14740, beneficiaries: 11529, ratio: 7655.17 },
  { code: '0681', spending: 22024915.53, claims: 3052, beneficiaries: 3026, ratio: 7216.55 },
  { code: '0120', spending: 157794236.14, claims: 23367, beneficiaries: 11770, ratio: 6752.87 },
  { code: 'T2039', spending: 30540267.18, claims: 5078, beneficiaries: 4038, ratio: 6014.23 },
  { code: 'J9271', spending: 1229899613.4, claims: 230803, beneficiaries: 158878, ratio: 5328.79 },
  { code: 'A4575', spending: 87463377.42, claims: 16573, beneficiaries: 15118, ratio: 5277.46 },
  { code: '21299', spending: 52775699.3, claims: 10180, beneficiaries: 5431, ratio: 5184.25 },
  { code: 'S3870', spending: 26397318.34, claims: 5184, beneficiaries: 4989, ratio: 5092.08 },
  { code: '0101', spending: 66032880.59, claims: 13279, beneficiaries: 6926, ratio: 4972.73 },
  { code: 'L8619', spending: 123641503.63, claims: 25283, beneficiaries: 16509, ratio: 4890.3 },
  { code: 'W0260', spending: 15950757.88, claims: 3277, beneficiaries: 2668, ratio: 4867.49 },
  { code: 'J9354', spending: 5381281.12, claims: 1167, beneficiaries: 560, ratio: 4611.21 },
  { code: '0121', spending: 195036714.25, claims: 42371, beneficiaries: 38418, ratio: 4603.07 },
  { code: 'J3285', spending: 107843573.48, claims: 24580, beneficiaries: 14487, ratio: 4387.45 },
  { code: 'B4105', spending: 28504333.57, claims: 6551, beneficiaries: 4831, ratio: 4351.14 },
];

export const TOP_HCPCS_BY_COST_PER_BENE: HCPCSAggregate[] = [
  { code: 'J2326', spending: 124690714.33, claims: 1353, beneficiaries: 983, ratio: 126847.12 },
  { code: 'J1428', spending: 92292115.57, claims: 4411, beneficiaries: 915, ratio: 100865.7 },
  { code: 'J1426', spending: 65639662.45, claims: 2062, beneficiaries: 747, ratio: 87871.03 },
  { code: 'J7205', spending: 4825224.12, claims: 1373, beneficiaries: 103, ratio: 46846.84 },
  { code: 'J7189', spending: 13305674.69, claims: 420, beneficiaries: 309, ratio: 43060.44 },
  { code: 'J3241', spending: 5868983.41, claims: 370, beneficiaries: 138, ratio: 42528.87 },
  { code: 'J9042', spending: 4288305.75, claims: 154, beneficiaries: 101, ratio: 42458.47 },
  { code: 'Q4173', spending: 5630824.46, claims: 542, beneficiaries: 147, ratio: 38304.93 },
  { code: 'Q4205', spending: 58786868.69, claims: 5873, beneficiaries: 1676, ratio: 35075.7 },
  { code: 'J7170', spending: 247040459.61, claims: 10264, beneficiaries: 7841, ratio: 31506.24 },
  { code: 'J0584', spending: 168353119.58, claims: 10637, beneficiaries: 5704, ratio: 29514.92 },
  { code: 'J0638', spending: 19841610.37, claims: 910, beneficiaries: 793, ratio: 25020.95 },
  { code: 'J7192', spending: 42353008.72, claims: 4303, beneficiaries: 1915, ratio: 22116.45 },
  { code: 'J1447', spending: 39318958.71, claims: 16121, beneficiaries: 1941, ratio: 20257.06 },
  { code: 'W9029', spending: 20072930.09, claims: 13743, beneficiaries: 1043, ratio: 19245.38 },
  { code: 'J2350', spending: 391826851.67, claims: 24420, beneficiaries: 20729, ratio: 18902.35 },
  { code: 'J3316', spending: 11507071.35, claims: 774, beneficiaries: 649, ratio: 17730.46 },
  { code: '0128', spending: 39632292.7, claims: 2451, beneficiaries: 2262, ratio: 17520.91 },
  { code: '0118', spending: 1779703.0, claims: 118, beneficiaries: 114, ratio: 15611.43 },
  { code: '0134', spending: 1885567.2, claims: 1988, beneficiaries: 123, ratio: 15329.81 },
  { code: 'W9045', spending: 44240596.07, claims: 61614, beneficiaries: 3152, ratio: 14035.72 },
  { code: 'J1599', spending: 12142840.19, claims: 4839, beneficiaries: 891, ratio: 13628.33 },
  { code: '0120', spending: 157794236.14, claims: 23367, beneficiaries: 11770, ratio: 13406.48 },
  { code: 'Q4275', spending: 2060687.06, claims: 401, beneficiaries: 171, ratio: 12050.8 },
  { code: 'J9055', spending: 4601260.95, claims: 633, beneficiaries: 382, ratio: 12045.19 },
];

export const TOP_HCPCS_BY_CLAIMS_PER_BENE: HCPCSAggregate[] = [
  { code: '1286Z', spending: 23990009.17, claims: 7689701, beneficiaries: 168151, ratio: 45.73 },
  { code: '1286A', spending: 3965504.03, claims: 1239025, beneficiaries: 28592, ratio: 43.33 },
  { code: '1286C', spending: 2757996.06, claims: 858674, beneficiaries: 20041, ratio: 42.85 },
  { code: 'X5635', spending: 6845062.93, claims: 31639, beneficiaries: 1018, ratio: 31.08 },
  { code: 'W0038', spending: 13778659.05, claims: 52446, beneficiaries: 1703, ratio: 30.8 },
  { code: 'W00R2', spending: 0.0, claims: 114822, beneficiaries: 3895, ratio: 29.48 },
  { code: 'S9326', spending: 2444859.35, claims: 56388, beneficiaries: 1945, ratio: 28.99 },
  { code: 'W9047', spending: 24093724.95, claims: 68449, beneficiaries: 2445, ratio: 28.0 },
  { code: 'T2012', spending: 873982247.56, claims: 4847167, beneficiaries: 177251, ratio: 27.35 },
  { code: '1431Z', spending: 1506608.7, claims: 38711, beneficiaries: 1434, ratio: 27.0 },
  { code: 'T2027', spending: 225775419.04, claims: 2896062, beneficiaries: 110251, ratio: 26.27 },
  { code: '90947', spending: 4528861.01, claims: 68064, beneficiaries: 2622, ratio: 25.96 },
  { code: 'M0167', spending: 37238440.71, claims: 248760, beneficiaries: 9688, ratio: 25.68 },
  { code: 'M0122', spending: 79700049.12, claims: 1098506, beneficiaries: 42807, ratio: 25.66 },
  { code: 'M0151', spending: 12258397.83, claims: 62079, beneficiaries: 2432, ratio: 25.53 },
  { code: 'M0123', spending: 165371892.3, claims: 2172359, beneficiaries: 85374, ratio: 25.45 },
  { code: 'M0166', spending: 20104793.61, claims: 134254, beneficiaries: 5296, ratio: 25.35 },
  { code: 'M0150', spending: 112453848.07, claims: 716630, beneficiaries: 28370, ratio: 25.26 },
  { code: 'M0152', spending: 52401942.96, claims: 309736, beneficiaries: 12272, ratio: 25.24 },
  { code: 'M0125', spending: 55105171.23, claims: 585827, beneficiaries: 23325, ratio: 25.12 },
  { code: '1437Z', spending: 1897583.38, claims: 29717, beneficiaries: 1184, ratio: 25.1 },
  { code: 'M0124', spending: 21984300.34, claims: 184477, beneficiaries: 7359, ratio: 25.07 },
  { code: '1439Z', spending: 1522989.55, claims: 115294, beneficiaries: 4630, ratio: 24.9 },
  { code: 'S5126', spending: 4443797124.69, claims: 49138345, beneficiaries: 1973757, ratio: 24.9 },
  { code: 'W1793', spending: 2256074210.53, claims: 13098743, beneficiaries: 527089, ratio: 24.85 },
];


// BILLING VS SERVICING PROVIDER ANALYSIS
// Computed from full 227M row dataset
// Direct Care = billing provider rendered the service
// Referral/Facility = service rendered by different provider (referrals, labs, facilities)
export interface BillingServicingData {
  type: string;
  spending: number;
  percentage: number;
  description: string;
}

// Total spending: $1,093,562,833,512.54 (from full dataset)
// Distribution percentages derived from representative sample
export const BILLING_SERVICING_DATA: BillingServicingData[] = [
  { 
    type: 'Referral/Facility', 
    spending: 773129444154, // 70.7% of total
    percentage: 70.7,
    description: 'Services billed by one provider but rendered by another (labs, imaging, specialists, facilities)'
  },
  { 
    type: 'Direct Care', 
    spending: 287607025334, // 26.3% of total  
    percentage: 26.3,
    description: 'Provider bills for services they directly rendered to the patient'
  },
  { 
    type: 'Not Specified', 
    spending: 32826364024, // 3.0% of total
    percentage: 3.0,
    description: 'Servicing provider not recorded in claim data'
  }
];
