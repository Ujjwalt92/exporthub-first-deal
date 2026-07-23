import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary, effectiveInr, inr, usd } from '../lib/costing'
import { Button, Card, Field, Input, PageHeader } from '../components/ui'

export function FobMathPage() {
  const { deal, updateDeal, applySuggestedUnitPrice } = useStore()
  const s = computeCostSummary(deal)
  const vendorLine = deal.costs.find((c) => c.id === 'vendor')
  const vendorInr = vendorLine ? effectiveInr(vendorLine) : deal.vendorPricePerKgInr * deal.quantityKg
  const vendorPerKg = vendorInr / deal.quantityKg
  const otherInr = s.baseCostInr - vendorInr
  const otherPerKg = otherInr / deal.quantityKg

  const steps = [
    {
      title: 'Step 1 — Start with vendor purchase',
      body: `Vendor ₹${deal.vendorPricePerKgInr}/kg × ${deal.quantityKg.toLocaleString('en-IN')} kg = ${inr(vendorInr)} (working ${inr(vendorPerKg)}/kg).`,
    },
    {
      title: 'Step 2 — Add all export-side costs (FOB)',
      body: `Packing + GST track + inland + loading + CHA + customs + port + docs + phyto + COO + bank (+ fumigation if needed). Current non-vendor base = ${inr(otherInr)} (${inr(otherPerKg)}/kg). Ocean freight is tracked but NOT in FOB.`,
    },
    {
      title: 'Step 3 — Add contingency buffer',
      body: `${deal.contingencyPct}% of base ${inr(s.baseCostInr)} = ${inr(s.contingencyInr)}. Rule 2: later replace estimates with quoted/actual.`,
    },
    {
      title: 'Step 4 — Add desired profit',
      body: `${deal.desiredMarginPct}% on (base + contingency) = ${inr(s.profitInr)}.`,
    },
    {
      title: 'Step 5 — Convert INR target → USD/kg',
      body: `Target revenue ${inr(s.targetRevenueInr)} ÷ ${deal.quantityKg.toLocaleString('en-IN')} kg = ${inr(s.unitCostInr)}/kg. Then ÷ FX ${deal.fxInrPerUsd} = ${usd(s.unitPriceUsd)}/kg FOB.`,
    },
    {
      title: 'Step 6 — Only now send final price',
      body: `Buyer-facing quote: FOB JNPT ${usd(s.unitPriceUsd)}/kg · Total ${usd(s.totalUsd)}. Rule 1 complete.`,
    },
  ]

  return (
    <div>
      <PageHeader
        title="₹265/kg → USD FOB math"
        subtitle="Chat का missing teaching layer: खरीद लागत को export quotation में कैसे बदलते हैं — step-by-step।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/cost-sheet">
              <Button variant="secondary">Cost sheet</Button>
            </Link>
            <Button disabled={!s.canSendFinalPrice} onClick={() => applySuggestedUnitPrice()}>
              Lock this FOB into PI
            </Button>
          </div>
        }
      />

      <Card className="mb-6 grid gap-4 p-5 sm:grid-cols-3">
        <Field label="FX (INR per 1 USD)">
          <Input
            type="number"
            value={deal.fxInrPerUsd}
            onChange={(e) => updateDeal({ fxInrPerUsd: Number(e.target.value) })}
          />
        </Field>
        <Field label="Contingency %">
          <Input
            type="number"
            value={deal.contingencyPct}
            onChange={(e) => updateDeal({ contingencyPct: Number(e.target.value) })}
          />
        </Field>
        <Field label="Desired profit %">
          <Input
            type="number"
            value={deal.desiredMarginPct}
            onChange={(e) => updateDeal({ desiredMarginPct: Number(e.target.value) })}
          />
        </Field>
      </Card>

      <div className="grid gap-4 lg:grid-cols-2">
        {steps.map((step, idx) => (
          <Card key={step.title} className="p-5">
            <div className="text-xs font-semibold uppercase tracking-wide text-teal-700">
              {idx + 1} / {steps.length}
            </div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{step.title}</div>
            <p className="mt-2 text-sm leading-7 text-slate-600">{step.body}</p>
          </Card>
        ))}
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold">Live bridge table</div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">INR total</th>
                <th className="px-4 py-3">INR / kg</th>
                <th className="px-4 py-3">USD / kg</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                ['Vendor purchase', vendorInr],
                ['Other FOB costs', otherInr],
                ['Contingency', s.contingencyInr],
                ['Profit', s.profitInr],
                ['Target FOB revenue', s.targetRevenueInr],
              ].map(([label, total]) => {
                const t = total as number
                return (
                  <tr key={label as string}>
                    <td className="px-4 py-3 font-medium">{label}</td>
                    <td className="px-4 py-3">{inr(t)}</td>
                    <td className="px-4 py-3">{inr(t / deal.quantityKg)}</td>
                    <td className="px-4 py-3">{usd(t / deal.quantityKg / deal.fxInrPerUsd)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
