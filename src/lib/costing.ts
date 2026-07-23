import type { CostLine, DealData } from '../types'

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
  const includeInFob = deal.costs.filter((c) => c.id !== 'ocean_freight' && c.id !== 'contingency' && c.id !== 'profit')
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

export function stageLabel(stage: DealData['stage']) {
  const map: Record<DealData['stage'], string> = {
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
