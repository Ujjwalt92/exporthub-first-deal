export type DealStage =
  | 'inquiry'
  | 'clarify'
  | 'costing'
  | 'proforma'
  | 'po_lc'
  | 'vendor'
  | 'production'
  | 'dispatch'
  | 'customs'
  | 'vessel'
  | 'payment'
  | 'closed'

export interface MoneyTriple {
  estimatedInr: number | null
  quotedInr: number | null
  actualPaidInr: number | null
  notes?: string
}

export interface CostLine {
  id: string
  label: string
  category: 'product' | 'packing' | 'inland' | 'port' | 'docs' | 'finance' | 'freight' | 'margin'
  unit?: string
  money: MoneyTriple
  requiredForQuote: boolean
}

export interface ClarifyingQuestion {
  id: string
  question: string
  why: string
  answer: string
  answered: boolean
}

export interface PlaybookRule {
  id: string
  number: number
  title: string
  body: string
}

export interface DocumentNode {
  id: string
  name: string
  stage: string
  side: 'exporter_basic' | 'buyer' | 'sales' | 'logistics' | 'customs' | 'banking'
  shortIntro: string
  whenNeeded: string
  status: 'not_started' | 'in_progress' | 'ready' | 'received' | 'locked'
}

export type CheckStatus = 'unchecked' | 'match' | 'mismatch' | 'needs_amendment'

export interface LcCheckItem {
  id: string
  label: string
  expected: string
  foundInLc: string
  status: CheckStatus
  note: string
}

export interface VendorOrder {
  supplierName: string
  supplierLocation: string
  contactPerson: string
  productSpec: string
  quantityKg: number
  rateInrPerKg: number | null
  packing: string
  deliveryLocation: string
  readyByDate: string
  paymentTermsToVendor: string
  qualityNotes: string
  confirmed: boolean
  confirmationRef: string
}

export interface TaskItem {
  id: string
  label: string
  done: boolean
  note: string
}

export interface CompanyProfile {
  legalName: string
  brandName: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  email: string
  phone: string
  gstin: string
  iec: string
  pan: string
  adCode: string
  bankName: string
  bankAccount: string
  bankIfsc: string
  bankSwift: string
  spicesBoardRcmc: string
  onboardingDone: boolean
}

export interface ProductionState {
  tasks: TaskItem[]
  qcMoisturePct: string
  qcBrokenPct: string
  sampleApproved: boolean
  packedBags: number
  netWeightKg: number
  grossWeightKg: number
  readyForPickup: boolean
  notes: string
}

export interface DispatchState {
  truckNumber: string
  transporterName: string
  ewayBill: string
  pickupDate: string
  stuffingDate: string
  containerNumber: string
  sealNumber: string
  factoryInvoiceNo: string
  ciNumber: string
  ciDate: string
  plNumber: string
  marksAndNumbers: string
  stuffed: boolean
  departedForPort: boolean
  notes: string
}

export interface CustomsState {
  tasks: TaskItem[]
  shippingBillNo: string
  shippingBillDate: string
  phytoNo: string
  phytoDate: string
  cooNo: string
  cooDate: string
  fumigationNo: string
  chaName: string
  leoReceived: boolean
  notes: string
}

export interface VesselState {
  forwarderName: string
  bookingRef: string
  vesselName: string
  voyageNo: string
  etd: string
  eta: string
  blNumber: string
  blDate: string
  blType: 'original' | 'telex' | 'seaway' | ''
  onboardConfirmed: boolean
  blReceived: boolean
  notes: string
}

export interface PaymentState {
  tasks: TaskItem[]
  docsLodgedWithBank: boolean
  lodgeDate: string
  discrepancyNotes: string
  negotiationRef: string
  amountReceivedUsd: number | null
  amountReceivedInr: number | null
  realizationDate: string
  fircRef: string
  paymentComplete: boolean
  notes: string
}

export interface EmailTemplate {
  id: string
  title: string
  whenToUse: string
  subject: string
  body: string
}

export interface GlossaryTerm {
  id: string
  term: string
  meaning: string
  tip: string
}

export interface QualitySpec {
  id: string
  parameter: string
  target: string
  actual: string
  unit: string
  whyItMatters: string
  pass: boolean | null
}

export interface BankDocMatch {
  id: string
  documentName: string
  lcClause: string
  prepared: boolean
  matchesLc: 'unchecked' | 'yes' | 'no'
  note: string
}

export interface IncentiveItem {
  id: string
  name: string
  status: 'not_applicable' | 'to_check' | 'applied' | 'received'
  note: string
}

export interface TeachingExtras {
  lcScenario: 'clean' | 'with_errors'
  qualitySpecs: QualitySpec[]
  chaChecklist: TaskItem[]
  bankDocMatches: BankDocMatch[]
  incentives: IncentiveItem[]
  discrepancyPlaybookNote: string
}

export interface OnboardingItem {
  id: string
  label: string
  detail: string
  to: string
  done: boolean
}

export interface OnboardingState {
  seenWelcome: boolean
  checklist: OnboardingItem[]
  completedAt: string | null
}

export interface DealData {
  company: CompanyProfile
  companyName: string
  buyerName: string
  buyerEmail: string
  buyerCountry: string
  productName: string
  hsnCode: string
  quantityKg: number
  bagSizeKg: number
  container: string
  packing: string
  totalBags: number
  incoterm: string
  portOfLoading: string
  portOfDischarge: string
  paymentTerms: string
  shipmentWindow: string
  offerValidityDays: number
  currencyQuote: 'USD'
  fxInrPerUsd: number
  vendorPricePerKgInr: number
  desiredMarginPct: number
  contingencyPct: number
  unitPriceUsd: number | null
  stage: DealStage
  inquiryEmail: string
  clarifying: ClarifyingQuestion[]
  costs: CostLine[]
  rules: PlaybookRule[]
  documents: DocumentNode[]
  piNumber: string
  piDate: string
  specialTestsNote: string
  poNumber: string
  poReceived: boolean
  lcNumber: string
  lcReceived: boolean
  lcChecks: LcCheckItem[]
  lcClearedForProduction: boolean
  vendor: VendorOrder
  production: ProductionState
  dispatch: DispatchState
  customs: CustomsState
  vessel: VesselState
  payment: PaymentState
  templates: EmailTemplate[]
  glossary: GlossaryTerm[]
  teaching: TeachingExtras
  onboarding: OnboardingState
}

export interface AppState {
  deal: DealData
}
