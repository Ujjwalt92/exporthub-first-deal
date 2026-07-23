export type Currency = 'USD' | 'EUR' | 'GBP' | 'INR' | 'AED'

export type ShipmentStatus =
  | 'draft'
  | 'confirmed'
  | 'in_production'
  | 'ready_to_ship'
  | 'shipped'
  | 'delivered'
  | 'cancelled'

export type Incoterm =
  | 'EXW'
  | 'FCA'
  | 'FOB'
  | 'CFR'
  | 'CIF'
  | 'CPT'
  | 'CIP'
  | 'DAP'
  | 'DDP'

export interface CompanyProfile {
  name: string
  address: string
  city: string
  state: string
  country: string
  postalCode: string
  email: string
  phone: string
  gstin: string
  iec: string
  bankName: string
  bankAccount: string
  bankSwift: string
  bankIfsc: string
}

export interface Buyer {
  id: string
  name: string
  company: string
  email: string
  phone: string
  address: string
  city: string
  country: string
  postalCode: string
  currency: Currency
  notes?: string
  createdAt: string
}

export interface Product {
  id: string
  sku: string
  name: string
  description: string
  hsCode: string
  unit: string
  unitPrice: number
  currency: Currency
  netWeightKg: number
  grossWeightKg: number
  cbm: number
  createdAt: string
}

export interface ShipmentLine {
  productId: string
  quantity: number
  unitPrice: number
  packages: number
  netWeightKg: number
  grossWeightKg: number
  cbm: number
}

export interface Shipment {
  id: string
  reference: string
  buyerId: string
  status: ShipmentStatus
  currency: Currency
  incoterm: Incoterm
  originPort: string
  destinationPort: string
  vesselOrFlight?: string
  etd?: string
  eta?: string
  invoiceNumber: string
  invoiceDate: string
  packingListNumber: string
  lines: ShipmentLine[]
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface AppData {
  company: CompanyProfile
  buyers: Buyer[]
  products: Product[]
  shipments: Shipment[]
}
