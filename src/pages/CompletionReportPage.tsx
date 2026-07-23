import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary, dealProgress, effectiveInr, inr, stageLabel, usd } from '../lib/costing'
import { Badge, Button, Card, PageHeader } from '../components/ui'

export function CompletionReportPage() {
  const { deal, exportDealJson } = useStore()
  const summary = computeCostSummary(deal)
  const progress = dealProgress(deal)
  const actualSpend = deal.costs
    .filter((c) => c.id !== 'contingency' && c.id !== 'profit' && c.id !== 'ocean_freight')
    .reduce((sum, line) => sum + (line.money.actualPaidInr ?? effectiveInr(line)), 0)

  const lessons = [
    'Never quote before clarify + full cost sheet (Rule 1).',
    'Keep Estimated → Quoted → Actual for every rupee (Rule 2).',
    'Get vendor/CHA/forwarder/bank points in writing (Rule 3).',
    'PI first; Commercial Invoice only at dispatch (Rule 4).',
    'Read LC fully before production (Rule 5).',
    'Documents must match LC to get paid (Rule 6).',
  ]

  return (
    <div>
      <PageHeader
        title="Deal completion report"
        subtitle="पहली deal खत्म होने पर यही sheet तुम्हारा confidence certificate + next-deal playbook बनती है।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => window.print()}>Print report</Button>
            <Button
              variant="secondary"
              onClick={() => {
                const blob = new Blob([exportDealJson()], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `exporthub-deal-${deal.piNumber.split('/').join('-')}.json`
                a.click()
                URL.revokeObjectURL(url)
              }}
            >
              Download backup JSON
            </Button>
          </div>
        }
      />

      <Card className="mb-6 grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Stage" value={stageLabel(deal.stage)} />
        <Stat label="Progress" value={`${progress.pct}%`} />
        <Stat
          label="FOB locked"
          value={deal.unitPriceUsd ? `${usd(deal.unitPriceUsd)}/kg` : 'Not locked'}
        />
        <Stat
          label="Payment"
          value={deal.payment.paymentComplete ? 'Complete' : 'Pending'}
        />
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="text-sm font-semibold">Deal snapshot</div>
          <div className="mt-3 space-y-2 text-sm text-slate-700">
            <Row k="Seller" v={deal.company.legalName || deal.companyName} />
            <Row k="Buyer" v={deal.buyerName} />
            <Row k="Product" v={deal.productName} />
            <Row k="Qty" v={`${deal.quantityKg.toLocaleString('en-IN')} kg / ${deal.totalBags} bags`} />
            <Row k="Route" v={`${deal.portOfLoading} → ${deal.portOfDischarge}`} />
            <Row k="Payment terms" v={deal.paymentTerms} />
            <Row k="PI" v={`${deal.piNumber} (${deal.piDate})`} />
            <Row k="LC" v={deal.lcNumber || '—'} />
            <Row k="Container / Seal" v={`${deal.dispatch.containerNumber || '—'} / ${deal.dispatch.sealNumber || '—'}`} />
            <Row k="B/L" v={deal.vessel.blNumber || '—'} />
            <Row k="FIRC" v={deal.payment.fircRef || '—'} />
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold">Money scoreboard</div>
          <div className="mt-3 space-y-2 text-sm">
            <Row k="Target FOB revenue" v={usd(summary.totalUsd)} />
            <Row k="Target INR" v={inr(summary.targetRevenueInr)} />
            <Row k="Working spend (FOB side)" v={inr(actualSpend)} />
            <Row
              k="Received USD"
              v={
                deal.payment.amountReceivedUsd != null
                  ? usd(deal.payment.amountReceivedUsd)
                  : '—'
              }
            />
            <Row
              k="Received INR"
              v={
                deal.payment.amountReceivedInr != null
                  ? inr(deal.payment.amountReceivedInr)
                  : '—'
              }
            />
          </div>
          <p className="mt-4 text-xs leading-5 text-slate-500">
            Tip: Cost sheet में हर line का Actual Paid भरोगे तभी real margin 100% clear होगा।
          </p>
        </Card>
      </div>

      <Card className="mt-6 p-5">
        <div className="text-sm font-semibold">Milestone board</div>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {progress.checks.map((c) => (
            <div key={c.id} className="flex items-center justify-between rounded-lg bg-slate-50 px-3 py-2 text-sm">
              <span>{c.label}</span>
              <Badge tone={c.done ? 'green' : 'slate'}>{c.done ? 'Done' : 'Open'}</Badge>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mt-6 p-5">
        <div className="text-sm font-semibold">Lessons locked forever</div>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-7 text-slate-700">
          {lessons.map((l) => (
            <li key={l}>{l}</li>
          ))}
        </ol>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/">
            <Button variant="secondary">Back to cockpit</Button>
          </Link>
          <Link to="/post-shipment">
            <Button variant="secondary">Post-shipment / incentives</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-sm font-semibold text-slate-900">{value}</div>
    </div>
  )
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-start justify-between gap-3">
      <span className="text-slate-500">{k}</span>
      <span className="text-right font-medium text-slate-900">{v}</span>
    </div>
  )
}
