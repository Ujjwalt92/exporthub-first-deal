import type { CostLine, DealData, DealStage } from '../types'

export function effectiveInr(line: CostLine): number {
  if (line.money.actualPaidInr != null) return line.money.actualPaidInr
  if (line.money.quotedInr != null) return line.money.quotedInr
  if (line.money.estimatedInr != null) return line.money.estimatedInr
  return 0
}

export function isLineFilled(line: CostLine): boolean {
  if (!line.requiredForQuote) return true
  if (line.id === 'contingency' || line.id === 'profit') return true
  return (
    line.money.estimatedInr != null ||
    line.money.quotedInr != null ||
    line.money.actualPaidInr != null
  )
}

/** FOB cost basis = all costs except ocean freight (buyer pays on FOB) */
export function computeCostSummary(deal: DealData) {
  const includeInFob = deal.costs.filter(
    (c) => c.id !== 'ocean_freight' && c.id !== 'contingency' && c.id !== 'profit',
  )
  const baseCostInr = includeInFob.reduce((sum, line) => sum + effectiveInr(line), 0)
  const contingencyInr = Math.round((baseCostInr * deal.contingencyPct) / 100)
  const withContingency = baseCostInr + contingencyInr
  const profitInr = Math.round((withContingency * deal.desiredMarginPct) / 100)
  const targetRevenueInr = withContingency + profitInr
  const unitCostInr = targetRevenueInr / deal.quantityKg
  const unitPriceUsd = unitCostInr / deal.fxInrPerUsd
  const totalUsd = unitPriceUsd * deal.quantityKg
  const oceanFreightInr = effectiveInr(deal.costs.find((c) => c.id === 'ocean_freight')!)
  const allFilled = deal.costs.every(isLineFilled)
  const clarifyingDone = deal.clarifying.every((q) => q.answered && q.answer.trim().length > 0)

  return {
    baseCostInr,
    contingencyInr,
    profitInr,
    targetRevenueInr,
    unitCostInr,
    unitPriceUsd,
    totalUsd,
    oceanFreightInr,
    allFilled,
    clarifyingDone,
    canSendFinalPrice: allFilled && clarifyingDone,
  }
}

export function inr(n: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(n)
}

export function usd(n: number, digits = 2) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: digits,
  }).format(n)
}

export function stageLabel(stage: DealStage) {
  const map: Record<DealStage, string> = {
    inquiry: '1. Inquiry',
    clarify: '2. Clarify with buyer',
    costing: '3. Cost sheet',
    proforma: '4. Proforma Invoice',
    po_lc: '5. PO / LC',
    vendor: '6. Vendor confirmation',
    production: '7. Production',
    dispatch: '8. Dispatch',
    customs: '9. Customs',
    vessel: '10. Vessel',
    payment: '11. Payment',
    closed: '12. Closed',
  }
  return map[stage]
}

export const STAGE_ORDER: DealStage[] = [
  'clarify',
  'costing',
  'proforma',
  'po_lc',
  'vendor',
  'production',
  'dispatch',
  'customs',
  'vessel',
  'payment',
  'closed',
]

export function dealProgress(deal: DealData) {
  const summary = computeCostSummary(deal)
  const checks = [
    { id: 'company', label: 'Company profile', done: deal.company.onboardingDone || !!deal.company.iec },
    { id: 'clarify', label: 'Buyer clarified', done: summary.clarifyingDone },
    { id: 'costing', label: 'Cost sheet ready', done: summary.canSendFinalPrice },
    { id: 'pi', label: 'PI price locked', done: deal.unitPriceUsd != null },
    { id: 'lc', label: 'LC cleared', done: deal.lcClearedForProduction },
    { id: 'vendor', label: 'Vendor confirmed', done: deal.vendor.confirmed },
    { id: 'production', label: 'Cargo ready', done: deal.production.readyForPickup },
    { id: 'dispatch', label: 'Stuffed & moved', done: deal.dispatch.stuffed && deal.dispatch.departedForPort },
    { id: 'customs', label: 'LEO received', done: deal.customs.leoReceived },
    { id: 'vessel', label: 'B/L received', done: deal.vessel.blReceived },
    { id: 'payment', label: 'Payment realized', done: deal.payment.paymentComplete },
  ]
  const doneCount = checks.filter((c) => c.done).length
  return {
    checks,
    doneCount,
    total: checks.length,
    pct: Math.round((doneCount / checks.length) * 100),
  }
}

export function fillTemplate(
  text: string,
  deal: DealData,
  extra: Record<string, string> = {},
): string {
  const map: Record<string, string> = {
    company: deal.company.legalName || deal.companyName,
    buyer: deal.buyerName,
    pi: deal.piNumber,
    piDate: deal.piDate,
    lc: deal.lcNumber || '[LC number]',
    container: deal.dispatch.containerNumber || '[container]',
    seal: deal.dispatch.sealNumber || '[seal]',
    vessel: deal.vessel.vesselName || '[vessel]',
    etd: deal.vessel.etd || '[ETD]',
    eta: deal.vessel.eta || '[ETA]',
    bl: deal.vessel.blNumber || '[B/L]',
    amendments: '[List mismatches from LC checklist]',
    ...extra,
  }
  return text.replace(/\{\{(\w+)\}\}/g, (_, key: string) => map[key] ?? `{{${key}}}`)
}
