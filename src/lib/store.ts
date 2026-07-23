import type { AppData, Buyer, Product, Shipment } from '../types'

const STORAGE_KEY = 'exporthub-data-v1'

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}_${Date.now().toString(36)}`
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(amount)
  } catch {
    return `${currency} ${amount.toFixed(2)}`
  }
}

export function shipmentTotals(shipment: Shipment) {
  const amount = shipment.lines.reduce((sum, line) => sum + line.quantity * line.unitPrice, 0)
  const packages = shipment.lines.reduce((sum, line) => sum + line.packages, 0)
  const netWeightKg = shipment.lines.reduce((sum, line) => sum + line.netWeightKg, 0)
  const grossWeightKg = shipment.lines.reduce((sum, line) => sum + line.grossWeightKg, 0)
  const cbm = shipment.lines.reduce((sum, line) => sum + line.cbm, 0)
  return { amount, packages, netWeightKg, grossWeightKg, cbm }
}

export const defaultCompany: AppData['company'] = {
  name: 'Horizon Exports Pvt Ltd',
  address: '12 Export House, MIDC Road',
  city: 'Mumbai',
  state: 'Maharashtra',
  country: 'India',
  postalCode: '400001',
  email: 'exports@horizon.example',
  phone: '+91 22 4000 1200',
  gstin: '27AABCH1234A1Z5',
  iec: '0312345678',
  bankName: 'State Bank of India',
  bankAccount: '123456789012',
  bankSwift: 'SBININBBXXX',
  bankIfsc: 'SBIN0000123',
}

function seedData(): AppData {
  const buyers: Buyer[] = [
    {
      id: 'buyer_acme',
      name: 'Sarah Mitchell',
      company: 'Acme Retail LLC',
      email: 'sarah@acmeretail.example',
      phone: '+1 212 555 0198',
      address: '88 Madison Ave',
      city: 'New York',
      country: 'United States',
      postalCode: '10016',
      currency: 'USD',
      notes: 'Preferred FOB Nhava Sheva',
      createdAt: new Date().toISOString(),
    },
    {
      id: 'buyer_nordic',
      name: 'Lars Bergman',
      company: 'Nordic Home AB',
      email: 'lars@nordichome.example',
      phone: '+46 8 555 2211',
      address: 'Birger Jarlsgatan 14',
      city: 'Stockholm',
      country: 'Sweden',
      postalCode: '11434',
      currency: 'EUR',
      createdAt: new Date().toISOString(),
    },
  ]

  const products: Product[] = [
    {
      id: 'prod_teak_chair',
      sku: 'FURN-CH-01',
      name: 'Teak Dining Chair',
      description: 'Solid teak dining chair with natural finish',
      hsCode: '9401.61',
      unit: 'PCS',
      unitPrice: 48,
      currency: 'USD',
      netWeightKg: 6.5,
      grossWeightKg: 7.2,
      cbm: 0.12,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod_cotton_towel',
      sku: 'HOME-TW-12',
      name: 'Organic Cotton Towel Set',
      description: '3-piece organic cotton towel set',
      hsCode: '6302.60',
      unit: 'SET',
      unitPrice: 14.5,
      currency: 'USD',
      netWeightKg: 1.1,
      grossWeightKg: 1.3,
      cbm: 0.02,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'prod_brass_lamp',
      sku: 'DECO-LP-07',
      name: 'Handcrafted Brass Lamp',
      description: 'Artisan brass table lamp',
      hsCode: '9405.21',
      unit: 'PCS',
      unitPrice: 36,
      currency: 'USD',
      netWeightKg: 2.4,
      grossWeightKg: 2.9,
      cbm: 0.05,
      createdAt: new Date().toISOString(),
    },
  ]

  const shipments: Shipment[] = [
    {
      id: 'ship_001',
      reference: 'EXP-2026-001',
      buyerId: 'buyer_acme',
      status: 'ready_to_ship',
      currency: 'USD',
      incoterm: 'FOB',
      originPort: 'Nhava Sheva, INNSA',
      destinationPort: 'New York, USNYC',
      vesselOrFlight: 'MSC LORETO',
      etd: '2026-04-12',
      eta: '2026-05-02',
      invoiceNumber: 'CI-2026-001',
      invoiceDate: '2026-04-05',
      packingListNumber: 'PL-2026-001',
      lines: [
        {
          productId: 'prod_teak_chair',
          quantity: 200,
          unitPrice: 48,
          packages: 50,
          netWeightKg: 1300,
          grossWeightKg: 1440,
          cbm: 24,
        },
        {
          productId: 'prod_brass_lamp',
          quantity: 120,
          unitPrice: 36,
          packages: 20,
          netWeightKg: 288,
          grossWeightKg: 348,
          cbm: 6,
        },
      ],
      notes: 'Mark cartons with buyer PO #ACM-8842',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'ship_002',
      reference: 'EXP-2026-002',
      buyerId: 'buyer_nordic',
      status: 'confirmed',
      currency: 'EUR',
      incoterm: 'CIF',
      originPort: 'Nhava Sheva, INNSA',
      destinationPort: 'Gothenburg, SEGOT',
      etd: '2026-04-28',
      eta: '2026-05-22',
      invoiceNumber: 'CI-2026-002',
      invoiceDate: '2026-04-10',
      packingListNumber: 'PL-2026-002',
      lines: [
        {
          productId: 'prod_cotton_towel',
          quantity: 800,
          unitPrice: 12.5,
          packages: 80,
          netWeightKg: 880,
          grossWeightKg: 1040,
          cbm: 16,
        },
      ],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ]

  return {
    company: defaultCompany,
    buyers,
    products,
    shipments,
  }
}

export function loadData(): AppData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const seeded = seedData()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seeded))
      return seeded
    }
    return JSON.parse(raw) as AppData
  } catch {
    return seedData()
  }
}

export function saveData(data: AppData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export function resetData(): AppData {
  const seeded = seedData()
  saveData(seeded)
  return seeded
}
