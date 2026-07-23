import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Circle, Mail, ShieldAlert } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary, dealProgress, inr, stageLabel, usd } from '../lib/costing'
import { Badge, Button, Card, PageHeader } from '../components/ui'

const flow: { to: string; label: string; hint: string }[] = [
  { to: '/company', label: 'Company setup', hint: 'IEC / bank / RCMC' },
  { to: '/clarify', label: 'Buyer clarify', hint: 'Ask before quoting' },
  { to: '/cost-sheet', label: 'Cost sheet', hint: 'Est / Quoted / Actual' },
  { to: '/proforma', label: 'Proforma Invoice', hint: 'Official offer' },
  { to: '/po-lc', label: 'PO / LC review', hint: 'Rule 5 checklist' },
  { to: '/vendor', label: 'Vendor confirm', hint: 'Guntur supply lock' },
  { to: '/production', label: 'Production', hint: 'QC + packing' },
  { to: '/dispatch', label: 'Dispatch', hint: 'Stuffing + CI/PL' },
  { to: '/customs', label: 'Customs', hint: 'SB / Phyto / LEO' },
  { to: '/vessel', label: 'Vessel / B/L', hint: 'Booking + B/L' },
  { to: '/payment', label: 'Payment', hint: 'Bank + FIRC' },
]

export function HomePage() {
  const { deal, resetDeal } = useStore()
  const summary = computeCostSummary(deal)
  const progress = dealProgress(deal)
  const answered = deal.clarifying.filter((q) => q.answered).length

  return (
    <div>
      <PageHeader
        title="Deal cockpit"
        subtitle="एक live Teja S17 export deal — नए trader को process सिखाती है, experienced trader को checklist + cost discipline देती है।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/beginner">
              <Button>Absolute Beginner Guide</Button>
            </Link>
            <Link to="/help">
              <Button variant="secondary">Help / Glossary</Button>
            </Link>
            <Button variant="secondary" onClick={() => confirm('Reset playbook demo data?') && resetDeal()}>
              Reset deal
            </Button>
          </div>
        }
      />

      <Card className="mb-6 border-sky-200 bg-sky-50 p-5 text-sm leading-7 text-sky-950">
        <div className="font-semibold">New to export? Start here before the deal flow.</div>
        <p className="mt-2">
          CHA क्या होता है, freight forwarder कौन होता है (ये flight नहीं — समुद्री shipment के लिए sea
          forwarder), Guntur में vendor कैसे ढूँढें, बैंक में किससे मिलें, और हर चीज़ का rough खर्चा क्या
          होता है — सब{' '}
          <Link className="font-semibold underline" to="/beginner">
            Absolute Beginner Guide
          </Link>{' '}
          में plain English/Hinglish में है। हर stage पर छोटा beginner box भी मिलेगा।
        </p>
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-4">
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Progress</div>
          <div className="mt-2 text-2xl font-semibold">{progress.pct}%</div>
          <div className="mt-1 text-xs text-slate-500">
            {progress.doneCount}/{progress.total} milestones
          </div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Stage</div>
          <div className="mt-2 text-sm font-semibold">{stageLabel(deal.stage)}</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">Suggested FOB</div>
          <div className="mt-2 text-sm font-semibold">{usd(summary.unitPriceUsd)}/kg</div>
          <div className="mt-1 text-xs text-slate-500">{usd(summary.totalUsd)} total</div>
        </Card>
        <Card className="p-4">
          <div className="text-xs uppercase tracking-wide text-slate-500">INR target</div>
          <div className="mt-2 text-sm font-semibold">{inr(summary.targetRevenueInr)}</div>
          <div className="mt-1 text-xs text-slate-500">incl. contingency + margin</div>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Mail className="h-4 w-4 text-teal-700" />
            Buyer inquiry
          </div>
          <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {deal.inquiryEmail}
          </pre>
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <div className="font-semibold">नए exporter की सबसे बड़ी गलती</div>
                <div className="mt-1 leading-6">
                  तुरंत rate बता देना। Experienced exporter पहले clarify करता है, cost sheet बनाता है, फिर
                  FOB lock करके PI भेजता है।
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-3 p-5">
          <div className="text-sm font-semibold">Milestone tracker</div>
          {progress.checks.map((c) => (
            <div key={c.id} className="flex items-center gap-2 text-sm">
              {c.done ? (
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              ) : (
                <Circle className="h-4 w-4 text-slate-300" />
              )}
              <span className={c.done ? 'text-slate-700' : 'text-slate-500'}>{c.label}</span>
            </div>
          ))}
          <div className="pt-2 text-xs text-slate-500">
            Buyer answers {answered}/{deal.clarifying.length} ·{' '}
            <Badge tone={summary.canSendFinalPrice ? 'green' : 'amber'}>
              {summary.canSendFinalPrice ? 'May quote' : 'Do not quote yet'}
            </Badge>
          </div>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {flow.map((step, idx) => (
          <Card key={step.to} className="p-5">
            <div className="text-xs font-medium text-slate-500">Step {idx + 1}</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{step.label}</div>
            <div className="mt-1 text-xs text-slate-500">{step.hint}</div>
            <Link to={step.to} className="mt-4 inline-flex">
              <Button variant="secondary">
                Open
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <div className="text-sm font-semibold text-slate-900">Deal snapshot</div>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2 lg:grid-cols-3">
          <Snap label="Seller" value={deal.company.legalName || deal.companyName} />
          <Snap label="Buyer" value={deal.buyerName} />
          <Snap label="HSN" value={deal.hsnCode} />
          <Snap label="Quantity" value={`${deal.quantityKg.toLocaleString('en-IN')} kg`} />
          <Snap label="Packing" value={`${deal.packing} · ${deal.totalBags} bags`} />
          <Snap label="Route" value={`${deal.portOfLoading} → ${deal.portOfDischarge}`} />
        </div>
      </Card>
    </div>
  )
}

function Snap({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 font-medium text-slate-900">{value}</div>
    </div>
  )
}
