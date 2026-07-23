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

export type CostStatus = 'pending' | 'estimated' | 'quoted' | 'locked'

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

export interface DealData {
  companyName: string
  buyerName: string
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
}

export interface AppState {
  deal: DealData
}
