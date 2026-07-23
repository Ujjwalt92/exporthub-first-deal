import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary, effectiveInr, inr, usd } from '../lib/costing'
import { Badge, Button, Card, Field, Input, PageHeader } from '../components/ui'

export function CostSheetPage() {
  const { deal, updateCost, updateDeal, applySuggestedUnitPrice, setStage } = useStore()
  const summary = computeCostSummary(deal)

  return (
    <div>
      <PageHeader
        title="Quotation Preparation Checklist"
        subtitle="Rule no. 1 + 2: जब तक हर required लाइन clear न हो, buyer को final price मत भेजो। हर खर्च Estimated → Quoted → Actual Paid।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/fob-math">
              <Button variant="secondary">₹ → USD lesson</Button>
            </Link>
            <Button
              variant="secondary"
              disabled={!summary.canSendFinalPrice}
              onClick={() => {
                applySuggestedUnitPrice()
              }}
            >
              Lock suggested FOB into PI
            </Button>
            <Link to="/proforma">
              <Button onClick={() => setStage('proforma')} disabled={!deal.unitPriceUsd}>
                Open Proforma
              </Button>
            </Link>
          </div>
        }
      />

      <div className="mb-6 grid gap-4 lg:grid-cols-4">
        <Summary label="Base export cost" value={inr(summary.baseCostInr)} hint="Ocean freight excluded (FOB)" />
        <Summary label="Contingency" value={inr(summary.contingencyInr)} hint={`${deal.contingencyPct}%`} />
        <Summary label="Desired profit" value={inr(summary.profitInr)} hint={`${deal.desiredMarginPct}%`} />
        <Summary
          label="Suggested FOB"
          value={`${usd(summary.unitPriceUsd)}/kg`}
          hint={`Total ${usd(summary.totalUsd)} · INR ${inr(summary.targetRevenueInr)}`}
        />
      </div>

      <Card className="mb-6 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
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
        <Field label="Vendor ₹/kg (reference)">
          <Input
            type="number"
            value={deal.vendorPricePerKgInr}
            onChange={(e) => updateDeal({ vendorPricePerKgInr: Number(e.target.value) })}
          />
        </Field>
      </Card>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">Cost lines</div>
          <Badge tone={summary.canSendFinalPrice ? 'green' : 'amber'}>
            {summary.canSendFinalPrice ? 'Checklist complete' : 'Checklist incomplete — no final quote'}
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Cost item</th>
                <th className="px-4 py-3 font-medium">Estimated ₹</th>
                <th className="px-4 py-3 font-medium">Quoted ₹</th>
                <th className="px-4 py-3 font-medium">Actual paid ₹</th>
                <th className="px-4 py-3 font-medium">Working ₹</th>
                <th className="px-4 py-3 font-medium">USD equiv</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {deal.costs.map((line) => {
                if (line.id === 'contingency' || line.id === 'profit') {
                  const value = line.id === 'contingency' ? summary.contingencyInr : summary.profitInr
                  return (
                    <tr key={line.id} className="bg-teal-50/40">
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-900">{line.label}</div>
                        <div className="text-xs text-slate-500">{line.unit}</div>
                      </td>
                      <td className="px-4 py-3 text-slate-500" colSpan={3}>
                        Auto-calculated from % settings
                      </td>
                      <td className="px-4 py-3 font-semibold">{inr(value)}</td>
                      <td className="px-4 py-3">{usd(value / deal.fxInrPerUsd)}</td>
                    </tr>
                  )
                }

                const working = effectiveInr(line)
                return (
                  <tr key={line.id} className="align-top hover:bg-slate-50/70">
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{line.label}</div>
                      <div className="text-xs text-slate-500">
                        {line.unit}
                        {!line.requiredForQuote ? ' · optional / track only' : ''}
                      </div>
                    </td>
                    {(['estimatedInr', 'quotedInr', 'actualPaidInr'] as const).map((field) => (
                      <td key={field} className="px-4 py-3">
                        <Input
                          type="number"
                          value={line.money[field] ?? ''}
                          placeholder="—"
                          onChange={(e) =>
                            updateCost(line.id, {
                              [field]: e.target.value === '' ? null : Number(e.target.value),
                            })
                          }
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3 font-semibold text-slate-900">{inr(working)}</td>
                    <td className="px-4 py-3 text-slate-600">{usd(working / deal.fxInrPerUsd)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="mt-6 space-y-2 p-5 text-sm leading-7 text-slate-600">
        <div>
          <strong>Buyer को USD में देंगे</strong> — internally हर line INR में maintain होगी ताकि खरीद,
          packing, transport, docs की clarity रहे।
        </div>
        <div>
          FOB quote में <strong>ocean freight शामिल नहीं</strong> (buyer pays)। फिर भी freight line track
          करो — अगर बाद में CIF माँगे तो काम आएगी।
        </div>
        <div>
          Vendor reference: ₹{deal.vendorPricePerKgInr}/kg × {deal.quantityKg.toLocaleString('en-IN')} kg.
        </div>
      </Card>
    </div>
  )
}

function Summary({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-4">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-xl font-semibold text-slate-900">{value}</div>
      {hint ? <div className="mt-1 text-xs text-slate-500">{hint}</div> : null}
    </Card>
  )
}
