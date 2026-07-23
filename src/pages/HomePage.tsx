import { Link } from 'react-router-dom'
import { ArrowRight, CheckCircle2, Circle, Mail, ShieldAlert, Sparkles } from 'lucide-react'
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
  const { deal } = useStore()
  const summary = computeCostSummary(deal)
  const progress = dealProgress(deal)
  const answered = deal.clarifying.filter((q) => q.answered).length
  const onboardingDone = !!deal.onboarding.completedAt
  const onboardingProgress = deal.onboarding.checklist.filter((i) => i.done).length

  return (
    <div>
      <PageHeader
        eyebrow="Deal cockpit"
        title="Your first live shipment — under control"
        subtitle="Guided Teja S17 export path for new and growing spice traders. Clarify → cost → PI → LC → ship → get paid."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/start-here">
              <Button>
                Start Here
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link to="/report">
              <Button variant="secondary">Completion Report</Button>
            </Link>
            <Link to="/settings">
              <Button variant="ghost">Backup</Button>
            </Link>
          </div>
        }
      />

      <Card className="mb-6 overflow-hidden border-teal-200/80">
        <div className="flex flex-col gap-4 bg-gradient-to-br from-teal-50 via-white to-sky-50 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-teal-700">
              <Sparkles className="h-3.5 w-3.5" />
              {onboardingDone ? 'Ready for the deal' : 'Recommended first'}
            </div>
            <div className="mt-2 text-sm font-semibold text-slate-900">
              {onboardingDone
                ? 'Onboarding complete — run the UAE inquiry with discipline'
                : `Start Here onboarding · ${onboardingProgress}/${deal.onboarding.checklist.length} done`}
            </div>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-slate-600">
              New exporter: finish Start Here + Beginner Guide first. Experienced trader: jump to Cost Sheet or LC
              review.
            </p>
          </div>
          <Badge tone={onboardingDone ? 'green' : 'amber'}>{onboardingDone ? 'Ready' : 'Do this first'}</Badge>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Metric label="Progress" value={`${progress.pct}%`} hint={`${progress.doneCount}/${progress.total} milestones`} />
        <Metric label="Stage" value={stageLabel(deal.stage)} hint="Current gate in the playbook" />
        <Metric label="Suggested FOB" value={`${usd(summary.unitPriceUsd)}/kg`} hint={`${usd(summary.totalUsd)} total`} />
        <Metric label="INR target" value={inr(summary.targetRevenueInr)} hint="Incl. contingency + margin" />
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="p-5 lg:col-span-2">
          <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-900">
            <Mail className="h-4 w-4 text-teal-700" />
            Morning buyer inquiry
          </div>
          <pre className="whitespace-pre-wrap rounded-2xl border border-slate-100 bg-slate-50/80 p-4 text-sm leading-6 text-slate-700">
            {deal.inquiryEmail}
          </pre>
          <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            <div className="flex items-start gap-2">
              <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
              <div>
                <div className="font-semibold">#1 mistake this product prevents</div>
                <div className="mt-1 leading-6 text-amber-900/90">
                  Sending a FOB rate on WhatsApp before clarify + cost sheet. Professionals lock numbers first, then
                  issue a Proforma Invoice.
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

      <div className="mt-8 mb-3 flex items-end justify-between gap-3">
        <div>
          <div className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-400">Deal flow</div>
          <div className="mt-1 text-sm font-semibold text-slate-900">Eleven gated steps to FIRC</div>
        </div>
        <Link to="/pricing" className="text-xs font-medium text-teal-700 hover:underline">
          How we sell this →
        </Link>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {flow.map((step, idx) => (
          <Link key={step.to} to={step.to} className="group">
            <Card className="h-full p-5 transition group-hover:-translate-y-0.5 group-hover:border-teal-200 group-hover:shadow-md">
              <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
                Step {String(idx + 1).padStart(2, '0')}
              </div>
              <div className="mt-1.5 text-sm font-semibold text-slate-900">{step.label}</div>
              <div className="mt-1 text-xs text-slate-500">{step.hint}</div>
              <div className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-teal-700">
                Open
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
              </div>
            </Card>
          </Link>
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

function Metric({ label, value, hint }: { label: string; value: string; hint: string }) {
  return (
    <Card className="p-4">
      <div className="text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">{label}</div>
      <div className="mt-2 text-xl font-semibold tracking-tight text-slate-900">{value}</div>
      <div className="mt-1 text-xs text-slate-500">{hint}</div>
    </Card>
  )
}

function Snap({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-3">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="mt-1 font-medium text-slate-900">{value}</div>
    </div>
  )
}
