import { Link } from 'react-router-dom'
import { ArrowRight, Mail, ShieldAlert } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary, inr, stageLabel, usd } from '../lib/costing'
import { Badge, Button, Card, PageHeader } from '../components/ui'

const flow: { stage: string; to: string; label: string }[] = [
  { stage: 'clarify', to: '/clarify', label: 'Buyer clarify' },
  { stage: 'costing', to: '/cost-sheet', label: 'Cost sheet' },
  { stage: 'proforma', to: '/proforma', label: 'Proforma Invoice' },
  { stage: 'po_lc', to: '/documents', label: 'PO / LC / Docs' },
]

export function HomePage() {
  const { deal, setStage, resetDeal } = useStore()
  const summary = computeCostSummary(deal)
  const answered = deal.clarifying.filter((q) => q.answered).length

  return (
    <div>
      <PageHeader
        title="Morning email from UAE"
        subtitle="एक live export project चलाएँगे — Teja S17 Stemless Red Chilli, 20 ft container। किताब नहीं, असली deal flow।"
        actions={
          <Button variant="secondary" onClick={() => confirm('Reset playbook demo data?') && resetDeal()}>
            Reset deal
          </Button>
        }
      />

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
                  तुरंत rate बता देना। हम ऐसा नहीं करेंगे। पहले clarifying questions, फिर Quotation
                  Preparation Checklist / cost sheet, फिर ही final FOB price।
                </div>
              </div>
            </div>
          </div>
        </Card>

        <Card className="space-y-4 p-5">
          <div>
            <div className="text-xs uppercase tracking-wide text-slate-500">Current stage</div>
            <div className="mt-1 text-lg font-semibold text-slate-900">{stageLabel(deal.stage)}</div>
          </div>
          <div className="space-y-2 text-sm">
            <Row label="Buyer answers" value={`${answered}/${deal.clarifying.length}`} />
            <Row
              label="Quote lock"
              value={summary.canSendFinalPrice ? 'Allowed' : 'Blocked by Rule 1'}
            />
            <Row label="Suggested FOB" value={usd(summary.unitPriceUsd) + '/kg'} />
            <Row label="Total FOB" value={usd(summary.totalUsd)} />
            <Row label="INR target" value={inr(summary.targetRevenueInr)} />
          </div>
          <Badge tone={summary.canSendFinalPrice ? 'green' : 'amber'}>
            {summary.canSendFinalPrice ? 'Rule 1 clear — you may quote' : 'Rule 1 active — no final price yet'}
          </Badge>
        </Card>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {flow.map((step, idx) => (
          <Card key={step.to} className="p-5">
            <div className="text-xs font-medium text-slate-500">Step {idx + 1}</div>
            <div className="mt-1 text-sm font-semibold text-slate-900">{step.label}</div>
            <Link to={step.to} className="mt-4 inline-flex">
              <Button
                variant="secondary"
                onClick={() => {
                  if (step.stage === 'clarify' || step.stage === 'costing' || step.stage === 'proforma') {
                    setStage(step.stage as typeof deal.stage)
                  }
                }}
              >
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
          <Snap label="Seller" value={deal.companyName} />
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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className="font-medium text-slate-800">{value}</span>
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
