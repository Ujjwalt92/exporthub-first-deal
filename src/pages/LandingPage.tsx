import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BadgeCheck,
  ClipboardCheck,
  FileText,
  Lock,
  Scale,
  ShieldCheck,
  Ship,
  Sparkles,
} from 'lucide-react'
import { Button, Card } from '../components/ui'

const pains = [
  {
    title: 'Quoting before costing',
    body: 'Most first deals die (or lose money) because someone typed a FOB rate on WhatsApp before freight, CHA, packing, and bank charges were locked.',
  },
  {
    title: 'LC / docs mismatches',
    body: 'Payment is not “shipment done”. Payment is documents matching the LC. One wrong description and the bank holds your money.',
  },
  {
    title: 'No operating system',
    body: 'Excel + WhatsApp + memory is not a process. When the buyer replies at 9am, you need a checklist — not panic.',
  },
]

const features = [
  {
    icon: Scale,
    title: 'Rule-gated quoting',
    body: 'Final FOB unlocks only after clarify + cost discipline. Rule 1 is built into the product.',
  },
  {
    icon: ClipboardCheck,
    title: 'Triple cost sheet',
    body: 'Estimated → Quoted → Actual Paid on every line. See margin risk before you send the PI.',
  },
  {
    icon: FileText,
    title: 'Deal documents ready',
    body: 'Proforma, Commercial Invoice, Packing List, email templates — print-ready for one live shipment.',
  },
  {
    icon: ShieldCheck,
    title: 'LC review lab',
    body: 'Line-by-line PO/LC checks + sample clean vs dirty LC so beginners learn before production starts.',
  },
  {
    icon: Ship,
    title: 'Full shipment path',
    body: 'Vendor → production → dispatch → customs → vessel → bank docs → FIRC. One cockpit, one deal.',
  },
  {
    icon: Sparkles,
    title: 'Beginner + pro mode',
    body: 'Start Here scripts for day-zero exporters. Experienced traders jump straight to cost / LC / payment.',
  },
]

const steps = [
  { n: '01', title: 'Open the workspace', body: 'Run the included UAE Teja S17 demo deal — or import your backup.' },
  { n: '02', title: 'Follow the gates', body: 'Clarify → cost → PI → LC → vendor → ship → get paid. Progress is visible.' },
  { n: '03', title: 'Close without drama', body: 'Bank packet matches LC. Completion report shows what you learned.' },
]

export function LandingPage() {
  return (
    <div className="min-h-screen text-slate-900">
      <MarketingNav />

      <section className="eh-grid-bg relative overflow-hidden border-b border-slate-200/80">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-800">
              <BadgeCheck className="h-3.5 w-3.5" />
              First Deal OS for Indian spice exporters
            </div>
            <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl sm:leading-[1.08]">
              Close your first export deal without guessing the FOB rate.
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600">
              ExportHub is a guided operating system — not a generic ERP. It walks a new or small trader from
              buyer inquiry to FIRC with cost discipline, LC checks, and shipment documents that look
              professional.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/workspace">
                <Button size="lg" className="min-w-[10rem]">
                  Open live workspace
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/pricing">
                <Button size="lg" variant="secondary">
                  View pricing
                </Button>
              </Link>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1.5">
                <Lock className="h-3.5 w-3.5 text-teal-700" /> Data stays in your browser
              </span>
              <span>Works on iPhone Safari</span>
              <span>Demo deal: Teja S17 → Jebel Ali</span>
            </div>
          </div>

          <Card className="eh-hero-glow overflow-hidden p-0">
            <div className="border-b border-slate-100 bg-slate-950 px-5 py-4 text-white">
              <div className="text-[11px] uppercase tracking-[0.18em] text-teal-300">Live demo deal</div>
              <div className="mt-1 text-sm font-semibold">Teja S17 Stemless · 1×20ft · FOB JNPT</div>
              <div className="mt-1 text-xs text-slate-400">12,000 kg · LC at Sight · UAE buyer</div>
            </div>
            <div className="space-y-3 p-5">
              {[
                ['Clarify before quote', 'Rule 1 locked'],
                ['Cost sheet Est / Quoted / Actual', 'Margin visible'],
                ['PI → PO/LC → bank docs', 'Payment path'],
              ].map(([a, b]) => (
                <div
                  key={a}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm"
                >
                  <span className="font-medium text-slate-800">{a}</span>
                  <span className="text-xs text-teal-700">{b}</span>
                </div>
              ))}
              <Link to="/workspace" className="block">
                <Button className="w-full" variant="dark">
                  Enter deal cockpit
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="max-w-2xl">
          <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">The problem</div>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
            You cannot sell a “raw checklist PDF”. Buyers buy confidence and process.
          </h2>
        </div>
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {pains.map((p) => (
            <Card key={p.title} className="p-5" hover>
              <div className="text-sm font-semibold text-slate-900">{p.title}</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{p.body}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-200/80 bg-white/70">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="max-w-2xl">
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">Product</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Everything a first live spice shipment needs — in one workspace.
            </h2>
          </div>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <Card key={f.title} className="p-5" hover>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-800">
                  <f.icon className="h-4 w-4" />
                </div>
                <div className="mt-3 text-sm font-semibold text-slate-900">{f.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{f.body}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">How it sells</div>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Position it as insurance for your first deal — not “another app”.
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">
              Pitch: <span className="font-medium text-slate-900">“One wrong FOB quote can wipe a container’s
              margin. ExportHub forces the process that professionals already follow.”</span> Sell founding
              access to traders, CHA networks, export coaches, and spice associations.
            </p>
            <Link to="/pricing" className="mt-6 inline-flex">
              <Button>
                See sellable plans
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
          <div className="grid gap-3">
            {steps.map((s) => (
              <Card key={s.n} className="flex gap-4 p-5">
                <div className="text-lg font-semibold text-teal-700">{s.n}</div>
                <div>
                  <div className="text-sm font-semibold text-slate-900">{s.title}</div>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{s.body}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-slate-200/80 bg-slate-950 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-4 py-14 sm:px-6 lg:flex-row lg:items-center">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Ready to look like a real exporter?</h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
              Open the live Teja deal workspace now. Use it as your product demo when you talk to buyers,
              mentors, or early customers.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/workspace">
              <Button size="lg">Launch workspace</Button>
            </Link>
            <Link to="/pricing">
              <Button size="lg" variant="secondary">
                Pricing
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-8 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <div>
            <span className="font-semibold text-slate-800">ExportHub</span> · First Deal OS
          </div>
          <div className="flex gap-4">
            <Link className="hover:text-slate-800" to="/workspace">
              Workspace
            </Link>
            <Link className="hover:text-slate-800" to="/pricing">
              Pricing
            </Link>
            <Link className="hover:text-slate-800" to="/help">
              Glossary
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function MarketingNav() {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white">
            EH
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">ExportHub</div>
            <div className="text-[10px] uppercase tracking-[0.14em] text-slate-400">First Deal OS</div>
          </div>
        </Link>
        <div className="flex items-center gap-2">
          <Link to="/pricing" className="hidden text-sm text-slate-600 hover:text-slate-900 sm:inline">
            Pricing
          </Link>
          <Link to="/workspace">
            <Button size="sm">Open app</Button>
          </Link>
        </div>
      </div>
    </header>
  )
}
