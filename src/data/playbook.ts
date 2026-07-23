import type {
  ClarifyingQuestion,
  CompanyProfile,
  CostLine,
  CustomsState,
  DealData,
  DispatchState,
  DocumentNode,
  EmailTemplate,
  GlossaryTerm,
  LcCheckItem,
  PaymentState,
  PlaybookRule,
  ProductionState,
  TaskItem,
  VendorOrder,
  VesselState,
} from '../types'
import { createTeachingExtras } from './teaching'

export const PLAYBOOK_RULES: PlaybookRule[] = [
  {
    id: 'rule_1',
    number: 1,
    title: 'पूरी लागत निकाले बिना final price मत भेजो',
    body: 'जब तक Quotation Preparation Checklist की हर लाइन पूरी न हो, buyer को final price quote मत भेजना।',
  },
  {
    id: 'rule_2',
    number: 2,
    title: 'कोई भी खर्च “मान लेना” नहीं है',
    body: 'हर खर्च के सामने तीन कॉलम रखो: Estimated → Quoted → Actual Paid। Actual आने पर estimated को replace करो।',
  },
  {
    id: 'rule_3',
    number: 3,
    title: 'हर बात लिखित में लो',
    body: 'Rate, quality, packing, ready date, payment — WhatsApp/email/PO में confirm करो। मौखिक बात पर shipment मत चलाओ।',
  },
  {
    id: 'rule_4',
    number: 4,
    title: 'पहले Proforma Invoice, Commercial Invoice बाद में',
    body: 'PO या LC मिलने से पहले Proforma Invoice जाती है। Commercial Invoice तब बनती है जब माल वास्तव में dispatch होने लगे।',
  },
  {
    id: 'rule_5',
    number: 5,
    title: 'LC पूरी तरह पढ़े बिना माल तैयार मत करो',
    body: 'LC में नाम, quantity, incoterm, shipment date और documents list चेक करो। गलती हो तो पहले amend करवाओ।',
  },
  {
    id: 'rule_6',
    number: 6,
    title: 'Documents = Payment',
    body: 'LC में जो documents माँगे हैं, वही exact set bank को lodge करो। Discrepancy = delay या non-payment risk।',
  },
]

export const CLARIFYING_QUESTIONS: ClarifyingQuestion[] = [
  {
    id: 'q_grade',
    question: 'Exact grade / quality क्या चाहिए?',
    why: 'Teja S17 के अंदर भी Super Deluxe / stemless specs rate बदल देते हैं।',
    answer: 'Teja S17 Stemless Super Deluxe Red Chilli',
    answered: true,
  },
  {
    id: 'q_qty',
    question: 'Quantity और packing क्या चाहिए?',
    why: '20 ft container में loadable weight और bag size cost + stuffing बदलते हैं।',
    answer: '1 × 20 ft container = 12,000 kg in 25 kg PP bags (480 bags)',
    answered: true,
  },
  {
    id: 'q_port',
    question: 'Destination port कौन सा है?',
    why: 'Ocean freight और transit time port पर निर्भर करते हैं।',
    answer: 'Jebel Ali, UAE',
    answered: true,
  },
  {
    id: 'q_incoterm',
    question: 'Incoterm क्या चाहिए — FOB / CIF / CFR?',
    why: 'FOB में ocean freight buyer लेता है; CIF में exporter quote में freight जोड़ता है।',
    answer: 'FOB JNPT (Nhava Sheva), India',
    answered: true,
  },
  {
    id: 'q_payment',
    question: 'Payment terms क्या हैं?',
    why: 'LC / TT / DA से bank charges, risk और cash flow बदलते हैं।',
    answer: 'Irrevocable LC at Sight',
    answered: true,
  },
  {
    id: 'q_shipment',
    question: 'Shipment timeline क्या है?',
    why: 'Production + inland + customs planning इसी से होती है।',
    answer: 'Shipment within 20 days of receiving LC',
    answered: true,
  },
  {
    id: 'q_tests',
    question: 'Special tests / certificates चाहिए?',
    why: 'Lab test, pesticide residue, fumigation अलग cost और lead time जोड़ते हैं।',
    answer: '',
    answered: false,
  },
]

function money(estimatedInr: number | null = null) {
  return { estimatedInr, quotedInr: null, actualPaidInr: null }
}

export const COST_LINES: CostLine[] = [
  {
    id: 'vendor',
    label: 'Vendor price (Guntur chilli)',
    category: 'product',
    unit: '₹/kg × 12,000 kg',
    money: money(265 * 12000),
    requiredForQuote: true,
  },
  {
    id: 'packing',
    label: 'Packing cost (25 kg PP bags + labour)',
    category: 'packing',
    unit: 'lump sum',
    money: money(480 * 35),
    requiredForQuote: true,
  },
  {
    id: 'gst',
    label: 'GST on purchase / packing (track & reclaim if eligible)',
    category: 'product',
    unit: 'estimate',
    money: money(Math.round(265 * 12000 * 0.05)),
    requiredForQuote: true,
  },
  {
    id: 'inland_transport',
    label: 'Guntur → JNPT inland transport',
    category: 'inland',
    unit: '1 × 20 ft trucking',
    money: money(65000),
    requiredForQuote: true,
  },
  {
    id: 'loading',
    label: 'Loading / unloading',
    category: 'inland',
    unit: 'lump sum',
    money: money(12000),
    requiredForQuote: true,
  },
  {
    id: 'cha',
    label: 'CHA charges',
    category: 'port',
    unit: 'lump sum',
    money: money(18000),
    requiredForQuote: true,
  },
  {
    id: 'customs',
    label: 'Customs clearance',
    category: 'port',
    unit: 'lump sum',
    money: money(8000),
    requiredForQuote: true,
  },
  {
    id: 'port_handling',
    label: 'Port handling / THC (FOB side)',
    category: 'port',
    unit: 'lump sum',
    money: money(22000),
    requiredForQuote: true,
  },
  {
    id: 'documentation',
    label: 'Documentation (invoice set, courier, etc.)',
    category: 'docs',
    unit: 'lump sum',
    money: money(5000),
    requiredForQuote: true,
  },
  {
    id: 'phyto',
    label: 'Phytosanitary certificate',
    category: 'docs',
    unit: 'per shipment',
    money: money(3500),
    requiredForQuote: true,
  },
  {
    id: 'coo',
    label: 'Certificate of Origin',
    category: 'docs',
    unit: 'per shipment',
    money: money(2500),
    requiredForQuote: true,
  },
  {
    id: 'fumigation',
    label: 'Fumigation (if required)',
    category: 'docs',
    unit: 'optional',
    money: money(8000),
    requiredForQuote: false,
  },
  {
    id: 'bank',
    label: 'Bank charges (LC advising / negotiation estimate)',
    category: 'finance',
    unit: 'estimate',
    money: money(15000),
    requiredForQuote: true,
  },
  {
    id: 'ocean_freight',
    label: 'Ocean freight JNPT → Jebel Ali',
    category: 'freight',
    unit: 'track only (FOB = buyer pays)',
    money: money(90000),
    requiredForQuote: false,
  },
  {
    id: 'contingency',
    label: 'Contingency buffer',
    category: 'margin',
    unit: '% of landed export cost',
    money: money(null),
    requiredForQuote: true,
  },
  {
    id: 'profit',
    label: 'Desired profit margin',
    category: 'margin',
    unit: '% on cost',
    money: money(null),
    requiredForQuote: true,
  },
]

export const DOCUMENTS: DocumentNode[] = [
  {
    id: 'iec',
    name: 'IEC',
    stage: 'Setup',
    side: 'exporter_basic',
    shortIntro: 'Import Export Code — DGFT से मिला exporter का basic license।',
    whenNeeded: 'किसी भी shipment से पहले mandatory।',
    status: 'ready',
  },
  {
    id: 'rcmc',
    name: 'RCMC',
    stage: 'Setup',
    side: 'exporter_basic',
    shortIntro: 'Registration-Cum-Membership Certificate (Spices Board आदि)।',
    whenNeeded: 'Spices export benefits / board registration के लिए।',
    status: 'in_progress',
  },
  {
    id: 'po',
    name: 'Purchase Order',
    stage: 'Buyer side',
    side: 'buyer',
    shortIntro: 'Buyer का formal order — product, qty, price, terms।',
    whenNeeded: 'PI accept के बाद।',
    status: 'not_started',
  },
  {
    id: 'lc',
    name: 'Letter of Credit (LC at Sight)',
    stage: 'Buyer side',
    side: 'buyer',
    shortIntro: 'Bank payment instrument। Documents सही हों तो payment मिलती है।',
    whenNeeded: 'PO confirm / negotiation के बाद। LC पढ़े बिना production मत शुरू करो।',
    status: 'not_started',
  },
  {
    id: 'pi',
    name: 'Proforma Invoice',
    stage: 'Sales',
    side: 'sales',
    shortIntro: 'Official quotation जैसी sales document — अभी tax invoice नहीं।',
    whenNeeded: 'Buyer clarify + cost sheet के बाद, PO/LC से पहले।',
    status: 'in_progress',
  },
  {
    id: 'ci',
    name: 'Commercial Invoice',
    stage: 'Sales',
    side: 'sales',
    shortIntro: 'Actual shipment के समय बनने वाली invoice।',
    whenNeeded: 'Dispatch / customs filing के समय।',
    status: 'locked',
  },
  {
    id: 'pl',
    name: 'Packing List',
    stage: 'Logistics',
    side: 'logistics',
    shortIntro: 'Bags, weights, marks — customs और buyer दोनों के लिए।',
    whenNeeded: 'Stuffing / dispatch के साथ।',
    status: 'locked',
  },
  {
    id: 'booking',
    name: 'Booking Confirmation',
    stage: 'Logistics',
    side: 'logistics',
    shortIntro: 'Forwarder/liner से vessel space confirm।',
    whenNeeded: 'Production near-ready होने पर।',
    status: 'not_started',
  },
  {
    id: 'bl',
    name: 'Bill of Lading (B/L)',
    stage: 'Logistics',
    side: 'logistics',
    shortIntro: 'Carrier द्वारा जारी title + transport document।',
    whenNeeded: 'Vessel load के बाद। LC में अक्सर original B/L माँगा जाता है।',
    status: 'not_started',
  },
  {
    id: 'fumigation_doc',
    name: 'Fumigation Certificate',
    stage: 'Logistics',
    side: 'logistics',
    shortIntro: 'Pest treatment proof — अगर buyer/LC माँगे।',
    whenNeeded: 'Only if required by buyer or destination rules।',
    status: 'not_started',
  },
  {
    id: 'phyto_doc',
    name: 'Phytosanitary Certificate',
    stage: 'Customs / PQ',
    side: 'customs',
    shortIntro: 'Plant Quarantine certificate — agri products के लिए।',
    whenNeeded: 'Chilli जैसे agri cargo के लिए अक्सर mandatory।',
    status: 'not_started',
  },
  {
    id: 'coo_doc',
    name: 'Certificate of Origin',
    stage: 'Customs / Chamber',
    side: 'customs',
    shortIntro: 'Goods की country of origin का प्रमाण।',
    whenNeeded: 'Buyer/LC/customs preference के अनुसार।',
    status: 'not_started',
  },
  {
    id: 'sb',
    name: 'Shipping Bill',
    stage: 'Customs',
    side: 'customs',
    shortIntro: 'Indian customs export declaration।',
    whenNeeded: 'Port पर customs clearance के समय।',
    status: 'not_started',
  },
  {
    id: 'bank_lodge',
    name: 'Bank Document Lodgement',
    stage: 'Banking',
    side: 'banking',
    shortIntro: 'LC के अनुसार documents bank में lodge करना।',
    whenNeeded: 'B/L और export docs ready होने के बाद।',
    status: 'not_started',
  },
  {
    id: 'firc',
    name: 'FIRC / e-BRC',
    stage: 'Banking',
    side: 'banking',
    shortIntro: 'Payment realization certificate from bank।',
    whenNeeded: 'Buyer/LC payment credit होने पर।',
    status: 'not_started',
  },
]

export const LC_CHECKS: LcCheckItem[] = [
  {
    id: 'lc_beneficiary',
    label: 'Beneficiary / seller name',
    expected: "Tiwari's Spices International",
    foundInLc: '',
    status: 'unchecked',
    note: '',
  },
  {
    id: 'lc_applicant',
    label: 'Applicant / buyer name',
    expected: '[Buyer Name Placeholder]',
    foundInLc: '',
    status: 'unchecked',
    note: '',
  },
  {
    id: 'lc_product',
    label: 'Product description',
    expected: 'Teja S17 Stemless Super Deluxe Red Chilli',
    foundInLc: '',
    status: 'unchecked',
    note: '',
  },
  {
    id: 'lc_qty',
    label: 'Quantity',
    expected: '12,000 kg (1 × 20 ft / 480 × 25 kg PP bags)',
    foundInLc: '',
    status: 'unchecked',
    note: '',
  },
  {
    id: 'lc_amount',
    label: 'LC amount / unit price',
    expected: 'Must match locked PI FOB USD value',
    foundInLc: '',
    status: 'unchecked',
    note: '',
  },
  {
    id: 'lc_incoterm',
    label: 'Incoterm + ports',
    expected: 'FOB JNPT (Nhava Sheva) → Jebel Ali',
    foundInLc: '',
    status: 'unchecked',
    note: '',
  },
  {
    id: 'lc_latest',
    label: 'Latest shipment date',
    expected: 'Within 20 days of LC receipt / as agreed',
    foundInLc: '',
    status: 'unchecked',
    note: '',
  },
  {
    id: 'lc_docs',
    label: 'Required documents list',
    expected: 'Commercial Invoice, Packing List, B/L, Phyto, COO (+ fumigation/lab if asked)',
    foundInLc: '',
    status: 'unchecked',
    note: '',
  },
  {
    id: 'lc_partial',
    label: 'Partial / transshipment clauses',
    expected: 'Confirm allowed or prohibited as per your plan',
    foundInLc: '',
    status: 'unchecked',
    note: '',
  },
]

export const INITIAL_VENDOR: VendorOrder = {
  supplierName: 'Guntur Chilli Traders',
  supplierLocation: 'Guntur, Andhra Pradesh',
  contactPerson: '',
  productSpec: 'Teja S17 Stemless Super Deluxe Red Chilli',
  quantityKg: 12000,
  rateInrPerKg: 265,
  packing: '25 kg PP bags (export packing)',
  deliveryLocation: 'Ex-godown Guntur / as agreed for trucking to JNPT',
  readyByDate: '',
  paymentTermsToVendor: 'Advance / against delivery — confirm in writing',
  qualityNotes: 'Moisture, broken %, stemless quality as per sample',
  confirmed: false,
  confirmationRef: '',
}

function tasks(labels: string[]): TaskItem[] {
  return labels.map((label, i) => ({ id: `t${i + 1}`, label, done: false, note: '' }))
}

export const INITIAL_COMPANY: CompanyProfile = {
  legalName: "Tiwari's Spices International",
  brandName: "Tiwari's Spices",
  address: 'Export Office, Spice Market Road',
  city: 'Guntur',
  state: 'Andhra Pradesh',
  country: 'India',
  postalCode: '522001',
  email: 'exports@tiwarispicess.example',
  phone: '+91 98765 43210',
  gstin: '37AAAAA0000A1Z5',
  iec: 'AAECT1234H',
  pan: 'AAECT1234H',
  adCode: '0000000-0000000',
  bankName: 'State Bank of India',
  bankAccount: 'XXXXXXXXXXXX',
  bankIfsc: 'SBIN0000000',
  bankSwift: 'SBININBBXXX',
  spicesBoardRcmc: 'RCMC-PENDING',
  onboardingDone: false,
}

export const INITIAL_PRODUCTION: ProductionState = {
  tasks: tasks([
    'Share approved sample / photo specs with vendor',
    'Confirm stemless sorting & grading started',
    'Confirm packing material (25 kg PP bags) ready',
    'Book QC / moisture check date',
    'Confirm exact bag count plan (480 bags)',
    'Align pickup truck date with transporter',
  ]),
  qcMoisturePct: '',
  qcBrokenPct: '',
  sampleApproved: false,
  packedBags: 0,
  netWeightKg: 0,
  grossWeightKg: 0,
  readyForPickup: false,
  notes: '',
}

export const INITIAL_DISPATCH: DispatchState = {
  truckNumber: '',
  transporterName: '',
  ewayBill: '',
  pickupDate: '',
  stuffingDate: '',
  containerNumber: '',
  sealNumber: '',
  factoryInvoiceNo: '',
  ciNumber: '',
  ciDate: '',
  plNumber: '',
  marksAndNumbers: 'TIWARI / TEJA S17 / JEBEL ALI / 1-480',
  stuffed: false,
  departedForPort: false,
  notes: '',
}

export const INITIAL_CUSTOMS: CustomsState = {
  tasks: tasks([
    'Appoint / brief CHA with shipment file',
    'File Shipping Bill (ICEGATE) draft check',
    'Apply Phytosanitary Certificate',
    'Arrange Certificate of Origin',
    'Fumigation if LC/buyer requires',
    'Gate-in container at CFS/port',
    'Receive LEO (Let Export Order)',
  ]),
  shippingBillNo: '',
  shippingBillDate: '',
  phytoNo: '',
  phytoDate: '',
  cooNo: '',
  cooDate: '',
  fumigationNo: '',
  chaName: '',
  leoReceived: false,
  notes: '',
}

export const INITIAL_VESSEL: VesselState = {
  forwarderName: '',
  bookingRef: '',
  vesselName: '',
  voyageNo: '',
  etd: '',
  eta: '',
  blNumber: '',
  blDate: '',
  blType: '',
  onboardConfirmed: false,
  blReceived: false,
  notes: '',
}

export const INITIAL_PAYMENT: PaymentState = {
  tasks: tasks([
    'Prepare LC document set exactly as LC asks',
    'Cross-check invoice value vs LC amount',
    'Lodge documents with negotiating/advising bank',
    'Track discrepancy advice if any',
    'Follow realization / credit advice',
    'Update FIRC / e-BRC when received',
  ]),
  docsLodgedWithBank: false,
  lodgeDate: '',
  discrepancyNotes: '',
  negotiationRef: '',
  amountReceivedUsd: null,
  amountReceivedInr: null,
  realizationDate: '',
  fircRef: '',
  paymentComplete: false,
  notes: '',
}

export const EMAIL_TEMPLATES: EmailTemplate[] = [
  {
    id: 'tpl_clarify',
    title: 'Ask buyer clarifying questions',
    whenToUse: 'When buyer only says “send best price”',
    subject: 'Re: Teja S17 enquiry — quick details needed before firm offer',
    body: `Dear Buyer,

Thank you for your enquiry for Teja S17 Stemless Red Chilli (1 x 20' container).

Before we send a firm FOB offer, please confirm:
1) Exact grade (e.g. Super Deluxe stemless)
2) Packing (bag size)
3) Destination port
4) Preferred Incoterm (FOB / CIF / CFR)
5) Payment terms
6) Required shipment window
7) Any lab test / fumigation / pesticide residue requirement

We will revert with our best FOB JNPT price within 24 hours after confirmation.

Regards,
{{company}}`,
  },
  {
    id: 'tpl_pi',
    title: 'Send Proforma Invoice',
    whenToUse: 'After cost sheet is complete and FOB locked',
    subject: 'Proforma Invoice {{pi}} — Teja S17 Stemless Super Deluxe',
    body: `Dear {{buyer}},

Please find our Proforma Invoice {{pi}} dated {{piDate}}.

Product: Teja S17 Stemless Super Deluxe Red Chilli
Qty: 12,000 kg (480 x 25 kg PP bags)
Incoterm: FOB JNPT
Payment: Irrevocable LC at Sight
Shipment: Within 20 days of LC

Kindly confirm acceptance and arrange PO / LC as per PI terms.

Regards,
{{company}}`,
  },
  {
    id: 'tpl_lc_amend',
    title: 'Request LC amendment',
    whenToUse: 'When LC checklist shows mismatch',
    subject: 'Request for LC amendment — {{lc}}',
    body: `Dear {{buyer}},

We have received LC {{lc}}. Please arrange the following amendment(s) before we proceed with production:

{{amendments}}

We will commence procurement immediately after amended LC is received.

Regards,
{{company}}`,
  },
  {
    id: 'tpl_vendor',
    title: 'Vendor purchase confirmation',
    whenToUse: 'After LC cleared — lock Guntur supply',
    subject: 'Purchase confirmation — Teja S17 12 MT export packing',
    body: `Dear Supplier,

Please confirm supply as below:
Product: Teja S17 Stemless Super Deluxe
Qty: 12,000 kg
Packing: 25 kg PP bags export packing
Rate: ₹___ / kg
Ready by: ___
Delivery: Guntur godown / loading point

Please reply with written confirmation and lot/quality notes.

Regards,
{{company}}`,
  },
  {
    id: 'tpl_shipping',
    title: 'Pre-shipment advice to buyer',
    whenToUse: 'After stuffing / before vessel sailing',
    subject: 'Shipment advice — Container {{container}} / Seal {{seal}}',
    body: `Dear {{buyer}},

Shipment update for Teja S17 order:
Container: {{container}}
Seal: {{seal}}
Vessel/Voyage: {{vessel}}
ETD JNPT: {{etd}}
ETA Jebel Ali: {{eta}}
B/L: {{bl}}

Documents will be lodged as per LC.

Regards,
{{company}}`,
  },
]

export const GLOSSARY: GlossaryTerm[] = [
  {
    id: 'g_iec',
    term: 'IEC',
    meaning: 'Import Export Code issued by DGFT — mandatory to export from India.',
    tip: 'Without IEC you cannot file shipping bill.',
  },
  {
    id: 'g_rcmc',
    term: 'RCMC',
    meaning: 'Registration-Cum-Membership Certificate from Spices Board (for spices).',
    tip: 'Useful for board schemes and credibility.',
  },
  {
    id: 'g_pi',
    term: 'Proforma Invoice (PI)',
    meaning: 'Official quotation / offer document before order finalization.',
    tip: 'Not a tax invoice. Goes before PO/LC.',
  },
  {
    id: 'g_ci',
    term: 'Commercial Invoice',
    meaning: 'Actual invoice issued at shipment time for customs and bank.',
    tip: 'Must match LC description and value.',
  },
  {
    id: 'g_fob',
    term: 'FOB',
    meaning: 'Free On Board — seller delivers goods on board at loading port; ocean freight usually buyer’s.',
    tip: 'Our demo quote is FOB JNPT.',
  },
  {
    id: 'g_lc',
    term: 'LC at Sight',
    meaning: 'Letter of Credit payable when complying documents are presented.',
    tip: 'Read every clause before production (Rule 5).',
  },
  {
    id: 'g_bl',
    term: 'Bill of Lading (B/L)',
    meaning: 'Transport document + title of goods issued by carrier/forwarder.',
    tip: 'LC often asks for full set of original B/Ls.',
  },
  {
    id: 'g_phyto',
    term: 'Phytosanitary Certificate',
    meaning: 'Plant quarantine certificate for agri products like chilli.',
    tip: 'Apply early — don’t wait for vessel cut-off.',
  },
  {
    id: 'g_sb',
    term: 'Shipping Bill',
    meaning: 'Indian customs export declaration.',
    tip: 'LEO means customs allowed export.',
  },
  {
    id: 'g_firc',
    term: 'FIRC / e-BRC',
    meaning: 'Bank advice that export payment has been realized.',
    tip: 'Needed for closing the deal cleanly and incentives.',
  },
  {
    id: 'g_cha',
    term: 'CHA',
    meaning: 'Customs House Agent who files customs docs and coordinates port formalities.',
    tip: 'Give CHA a complete file: CI, PL, invoices, LC copy.',
  },
  {
    id: 'g_hsn',
    term: 'HSN / HS Code',
    meaning: 'Product classification code used in customs worldwide.',
    tip: 'For this deal: 09042120.',
  },
]

export function createInitialDeal(): DealData {
  const today = new Date().toISOString().slice(0, 10)
  const stamp = Date.now().toString().slice(-4)
  return {
    company: INITIAL_COMPANY,
    companyName: INITIAL_COMPANY.legalName,
    buyerName: '[Buyer Name Placeholder]',
    buyerEmail: 'buyer@uae.example',
    buyerCountry: 'United Arab Emirates',
    productName: 'Teja S17 Stemless Super Deluxe Red Chilli',
    hsnCode: '09042120',
    quantityKg: 12000,
    bagSizeKg: 25,
    container: '1 × 20 ft',
    packing: '25 kg PP bags',
    totalBags: 480,
    incoterm: 'FOB JNPT India',
    portOfLoading: 'JNPT (Nhava Sheva), India',
    portOfDischarge: 'Jebel Ali, UAE',
    paymentTerms: 'Irrevocable LC at Sight',
    shipmentWindow: 'Within 20 days of receiving LC',
    offerValidityDays: 7,
    currencyQuote: 'USD',
    fxInrPerUsd: 83.5,
    vendorPricePerKgInr: 265,
    desiredMarginPct: 8,
    contingencyPct: 2,
    unitPriceUsd: null,
    stage: 'clarify',
    inquiryEmail:
      "Good morning,\n\nPlease quote your best price for 1 × 20 ft container of Teja S17 Stemless Red Chilli.\n\nRegards,\nUAE Buyer",
    clarifying: CLARIFYING_QUESTIONS,
    costs: COST_LINES,
    rules: PLAYBOOK_RULES,
    documents: DOCUMENTS,
    piNumber: 'PI/TSI/2026/001',
    piDate: today,
    specialTestsNote: '',
    poNumber: '',
    poReceived: false,
    lcNumber: '',
    lcReceived: false,
    lcChecks: LC_CHECKS,
    lcClearedForProduction: false,
    vendor: INITIAL_VENDOR,
    production: INITIAL_PRODUCTION,
    dispatch: {
      ...INITIAL_DISPATCH,
      ciNumber: `CI/TSI/2026/${stamp}`,
      ciDate: today,
      plNumber: `PL/TSI/2026/${stamp}`,
    },
    customs: INITIAL_CUSTOMS,
    vessel: INITIAL_VESSEL,
    payment: INITIAL_PAYMENT,
    templates: EMAIL_TEMPLATES,
    glossary: GLOSSARY,
    teaching: createTeachingExtras(),
  }
}
