import type {
  BankDocMatch,
  IncentiveItem,
  QualitySpec,
  TaskItem,
  TeachingExtras,
} from '../types'

function tasks(labels: string[]): TaskItem[] {
  return labels.map((label, i) => ({ id: `cha_${i + 1}`, label, done: false, note: '' }))
}

export const SAMPLE_LC_CLEAN = `IRREVOCABLE DOCUMENTARY CREDIT (SAMPLE — FOR TRAINING)

LC Number: LC-UAE-2026-77881
Date of Issue: 10 Apr 2026
Form: Irrevocable
Available with: Any bank by negotiation
Drafts at: Sight

Applicant:
[Buyer Name Placeholder]
Dubai, United Arab Emirates

Beneficiary:
Tiwari's Spices International
Guntur, Andhra Pradesh, India

Currency / Amount: USD 45,000.00 (SAY US DOLLARS FORTY FIVE THOUSAND ONLY)
(+/- 5% quantity and amount tolerance: NOT ALLOWED unless amended)

Partial shipments: NOT ALLOWED
Transshipment: ALLOWED

Port of Loading: NHAVA SHEVA / JNPT, INDIA
Port of Discharge: JEBEL ALI, UNITED ARAB EMIRATES
Latest Date of Shipment: 30 Apr 2026
Incoterms: FOB JNPT INDIA

Description of Goods:
TEJA S17 STEMLESS SUPER DELUXE RED CHILLI
HS CODE 09042120
QUANTITY: 12,000 KG
PACKING: 480 X 25 KG NEW PP BAGS

Documents required:
1) Signed Commercial Invoice in 3 originals
2) Packing List in 3 originals
3) Full set clean on board ocean Bill of Lading consigned to order / notify applicant
4) Phytosanitary Certificate
5) Certificate of Origin
6) Fumigation Certificate (if applicable)

Additional conditions:
- All documents must show LC number
- Goods of Indian origin
- Documents to be presented within 21 days after shipment date but within LC validity

THIS IS A TRAINING SAMPLE. Always read your real LC word-by-word (Rule 5).`

export const SAMPLE_LC_WITH_ERRORS = `IRREVOCABLE DOCUMENTARY CREDIT (SAMPLE WITH ERRORS — TRAINING)

LC Number: LC-UAE-2026-77881-X
Date of Issue: 10 Apr 2026

Applicant:
Acme Foods LLC, Dubai

Beneficiary:
Tiwari Spice International   ← SPELLING MISMATCH (missing 's' / plural)
Guntur, India

Currency / Amount: USD 42,000.00   ← AMOUNT LOWER THAN LOCKED PI
(+/- 10% tolerance)

Partial shipments: ALLOWED   ← may conflict with your 1x20' single shipment plan
Transshipment: NOT ALLOWED

Port of Loading: MUMBAI PORT   ← NOT JNPT/NHAVA SHEVA AS AGREED
Port of Discharge: JEBEL ALI, UAE
Latest Date of Shipment: 15 Apr 2026   ← TOO TIGHT vs 20 days after LC
Incoterms: CIF JEBEL ALI   ← CONFLICTS WITH AGREED FOB JNPT

Description of Goods:
TEJA S17 RED CHILLI (WITH STEM)   ← WRONG SPEC vs STEMLESS SUPER DELUXE
HS CODE 0904
QUANTITY: ABOUT 10 MT
PACKING: 50 KG GUNNY BAGS   ← WRONG PACKING

Documents required:
1) Commercial Invoice
2) Packing List
3) Seaway Bill only   ← may conflict if you planned original B/L set
4) Certificate of Analysis for pesticide residue (MANDATORY)

TRAINING NOTE: Do NOT start production on this LC. Raise amendment first.`

export const LC_MISMATCH_EXAMPLES = [
  {
    id: 'm1',
    issue: 'Beneficiary name spelling',
    whyDangerous: 'Bank can refuse documents even if goods are perfect.',
    fix: 'Ask buyer to amend beneficiary exactly as IEC/legal name.',
  },
  {
    id: 'm2',
    issue: 'FOB vs CIF conflict',
    whyDangerous: 'Who pays freight is unclear; your quote margin breaks.',
    fix: 'Amend to FOB JNPT (as PI) OR re-cost and re-quote as CIF.',
  },
  {
    id: 'm3',
    issue: 'Wrong product spec / packing',
    whyDangerous: 'Quality claim + document discrepancy both possible.',
    fix: 'Amend description to Stemless Super Deluxe + 25 kg PP bags.',
  },
  {
    id: 'm4',
    issue: 'Latest shipment date too early',
    whyDangerous: 'You will miss shipment and LC becomes unusable.',
    fix: 'Amend latest shipment date to realistic production+logistics window.',
  },
  {
    id: 'm5',
    issue: 'LC amount lower than PI',
    whyDangerous: 'Short payment even if you ship full quantity.',
    fix: 'Amend amount to locked PI value (and tolerance if needed).',
  },
]

export const QUALITY_SPECS: QualitySpec[] = [
  {
    id: 'qs_moisture',
    parameter: 'Moisture',
    target: '≤ 12.0',
    actual: '',
    unit: '%',
    whyItMatters: 'High moisture = mold risk, buyer rejection, phyto issues.',
    pass: null,
  },
  {
    id: 'qs_stemless',
    parameter: 'Stemless purity',
    target: '≥ 99',
    actual: '',
    unit: '%',
    whyItMatters: 'Buyer ordered stemless; stems = quality claim.',
    pass: null,
  },
  {
    id: 'qs_broken',
    parameter: 'Broken / damaged',
    target: '≤ 3',
    actual: '',
    unit: '%',
    whyItMatters: 'Affects grade, appearance and Super Deluxe claim.',
    pass: null,
  },
  {
    id: 'qs_foreign',
    parameter: 'Foreign matter',
    target: '≤ 1',
    actual: '',
    unit: '%',
    whyItMatters: 'Customs/buyer QC and food safety.',
    pass: null,
  },
  {
    id: 'qs_asta',
    parameter: 'ASTA color (if tested)',
    target: 'As per sample / agreed',
    actual: '',
    unit: 'ASTA',
    whyItMatters: 'Color value drives Teja market grade perception.',
    pass: null,
  },
  {
    id: 'qs_pungency',
    parameter: 'Pungency / SHU (optional)',
    target: 'As agreed / sample',
    actual: '',
    unit: 'SHU',
    whyItMatters: 'Some buyers lock heat level in contract/LC.',
    pass: null,
  },
  {
    id: 'qs_pesticide',
    parameter: 'Pesticide residue',
    target: 'Within destination limits / COA',
    actual: '',
    unit: 'report',
    whyItMatters: 'UAE/import labs may reject non-compliant lots.',
    pass: null,
  },
]

export const CHA_CHECKLIST: TaskItem[] = tasks([
  'Share with CHA: IEC, AD code, GSTIN, company letterhead',
  'Share: Commercial Invoice + Packing List drafts',
  'Share: Purchase invoice / tax invoice from vendor',
  'Share: LC copy / PO copy for description match',
  'Confirm HSN 09042120 and export scheme (if any)',
  'Check Shipping Bill draft: exporter name, IEC, consignee, ports',
  'Check SB quantity/value vs CI (no mismatch)',
  'Confirm container/seal numbers on SB after stuffing',
  'Phyto application packet ready (invoice + packing + ID)',
  'COO application packet ready (Chamber / authority)',
  'Gate-in / CFS cut-off time noted',
  'LEO status tracked before vessel cut-off',
])

export const BANK_DOC_MATCHES: BankDocMatch[] = [
  {
    id: 'bd_ci',
    documentName: 'Commercial Invoice',
    lcClause: 'Signed commercial invoice in required originals; description/value as LC',
    prepared: false,
    matchesLc: 'unchecked',
    note: '',
  },
  {
    id: 'bd_pl',
    documentName: 'Packing List',
    lcClause: 'Packing list showing packages, net/gross weight, marks',
    prepared: false,
    matchesLc: 'unchecked',
    note: '',
  },
  {
    id: 'bd_bl',
    documentName: 'Bill of Lading',
    lcClause: 'Full set clean on board B/L (or type exactly as LC)',
    prepared: false,
    matchesLc: 'unchecked',
    note: '',
  },
  {
    id: 'bd_phyto',
    documentName: 'Phytosanitary Certificate',
    lcClause: 'Phyto in favor of applicant / as LC wording',
    prepared: false,
    matchesLc: 'unchecked',
    note: '',
  },
  {
    id: 'bd_coo',
    documentName: 'Certificate of Origin',
    lcClause: 'COO evidencing Indian origin',
    prepared: false,
    matchesLc: 'unchecked',
    note: '',
  },
  {
    id: 'bd_fumi',
    documentName: 'Fumigation / COA (if LC asks)',
    lcClause: 'Only if LC/buyer mandatory — else do not invent',
    prepared: false,
    matchesLc: 'unchecked',
    note: '',
  },
  {
    id: 'bd_draft',
    documentName: 'Bill of Exchange / Draft (if required)',
    lcClause: 'Sight draft drawn as per LC',
    prepared: false,
    matchesLc: 'unchecked',
    note: '',
  },
]

export const INCENTIVES: IncentiveItem[] = [
  {
    id: 'inc_rodtep',
    name: 'RoDTEP (check eligibility for product/HS)',
    status: 'to_check',
    note: 'Confirm current rate/availability for HS 09042120 before relying in costing.',
  },
  {
    id: 'inc_drawback',
    name: 'Duty Drawback (if applicable)',
    status: 'to_check',
    note: 'Only if scheme applies; do not assume in first quote.',
  },
  {
    id: 'inc_ebrc',
    name: 'e-BRC / FIRC follow-up',
    status: 'to_check',
    note: 'Needed after realization for clean closure and claims.',
  },
  {
    id: 'inc_insurance',
    name: 'Export credit / ECGC (optional risk cover)',
    status: 'not_applicable',
    note: 'Useful for open-account deals; LC reduces need but still learn it.',
  },
]

export const DISCREPANCY_PLAYBOOK = `If bank raises discrepancy:
1) Read each discrepancy line calmly — classify as amendable vs ignorable with indemnity.
2) Common chilli-export issues: description mismatch, late presentation, B/L type, missing cert, amount difference.
3) Options: (a) correct & resubmit if possible, (b) ask buyer to waive, (c) request LC amendment (rare post-shipment), (d) convert to collection with risk.
4) Never argue with bank verbally only — get written discrepancy memo.
5) Update Actual Paid bank charges in cost sheet (Rule 2).
6) Lesson: most discrepancies are created at PI/LC stage, not at port.`

export function createTeachingExtras(): TeachingExtras {
  return {
    lcScenario: 'with_errors',
    qualitySpecs: QUALITY_SPECS.map((q) => ({ ...q })),
    chaChecklist: CHA_CHECKLIST.map((t) => ({ ...t })),
    bankDocMatches: BANK_DOC_MATCHES.map((b) => ({ ...b })),
    incentives: INCENTIVES.map((i) => ({ ...i })),
    discrepancyPlaybookNote: '',
  }
}

export function amendmentDraftFromErrors(companyName: string, lcNumber: string): string {
  return `Dear Buyer,

Please arrange the following amendments to LC ${lcNumber || 'LC-UAE-2026-77881-X'} before we start production:

1) Beneficiary name to read exactly: ${companyName}
2) Incoterms: FOB JNPT / Nhava Sheva, India (not CIF)
3) Port of loading: JNPT (Nhava Sheva), India
4) Goods description: Teja S17 Stemless Super Deluxe Red Chilli, HS 09042120
5) Quantity / packing: 12,000 kg in 480 x 25 kg new PP bags
6) Amount: as per accepted Proforma Invoice
7) Latest shipment date: please extend to a workable date (LC receipt + 20 days window)
8) Transport document: as mutually agreed (full set original B/L preferred)

We will commence procurement immediately after amended LC is received.

Regards,
${companyName}`
}
