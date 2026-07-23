import { Link } from 'react-router-dom'
import { ArrowRight, Check, Sparkles } from 'lucide-react'
import { Badge, Button, Card } from '../components/ui'

const plans = [
  {
    name: 'Demo',
    price: 'Free',
    period: 'forever on this build',
    blurb: 'Use the live Teja deal workspace to learn and demo the product.',
    cta: 'Open workspace',
    to: '/workspace',
    featured: false,
    items: [
      'Full first-deal playbook (1 demo shipment)',
      'Cost sheet + PI / CI / Packing List',
      'LC lab + beginner guides',
      'Local browser storage + JSON backup',
    ],
  },
  {
    name: 'Founding Trader',
    price: '₹14,999',
    period: 'one-time · first 100 seats',
    blurb: 'Best offer while the product is early. Lifetime seat on First Deal OS v1.',
    cta: 'Claim founding seat',
    to: '/workspace',
    featured: true,
    items: [
      'Everything in Demo',
      'Priority onboarding call script pack',
      'Your company branding on printable docs (roadmap)',
      'Founding price locked when cloud sync ships',
      'WhatsApp / email support during founding window',
    ],
  },
  {
    name: 'Pro Workspace',
    price: '₹4,999',
    period: '/ month · coming next',
    blurb: 'For traders running multiple live deals with team access.',
    cta: 'Join waitlist via demo',
    to: '/workspace',
    featured: false,
    items: [
      'Multi-deal CRM (roadmap)',
      'Cloud sync + phone login (roadmap)',
      'Live FX / freight note fields',
      'Team seats for CHA / ops',
      'Export coach white-label option',
    ],
  },
]

const sellScript = [
  {
    q: 'Who do we sell to first?',
    a: 'New IEC holders, spice traders in Guntur / Unjha / Delhi, export coaches, and CHA desks who want a client onboarding tool.',
  },
  {
    q: 'What is the one-line pitch?',
    a: '“ExportHub stops you from sending a FOB rate before your costs and LC are safe — then walks the shipment to payment.”',
  },
  {
    q: 'How do we close this week?',
    a: 'Demo the UAE Teja deal on a phone in 8 minutes → show Rule 1 lock → show PI print → offer Founding Trader at ₹14,999 or take a ₹2,000 deposit.',
  },
]

export function PricingPage() {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white">
              EH
            </div>
            <div className="text-sm font-semibold">ExportHub Pricing</div>
          </Link>
          <Link to="/workspace">
            <Button size="sm">Open app</Button>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="max-w-2xl">
          <Badge tone="teal">Commercial packaging</Badge>
          <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">
            Price the process, not the screens.
          </h1>
          <p className="mt-3 text-sm leading-7 text-slate-600">
            Buyers will not pay for a “raw React demo”. They will pay to avoid a bad first shipment. Use these
            plans when you pitch — payments/checkout can plug in once you pick Razorpay or Stripe.
          </p>
        </div>

        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`flex flex-col p-6 ${plan.featured ? 'border-teal-300 ring-2 ring-teal-600/15' : ''}`}
            >
              <div className="flex items-center justify-between gap-2">
                <div className="text-sm font-semibold text-slate-900">{plan.name}</div>
                {plan.featured ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-teal-700 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    <Sparkles className="h-3 w-3" /> Best to sell now
                  </span>
                ) : null}
              </div>
              <div className="mt-4 flex items-end gap-1">
                <div className="text-3xl font-semibold tracking-tight text-slate-950">{plan.price}</div>
              </div>
              <div className="mt-1 text-xs text-slate-500">{plan.period}</div>
              <p className="mt-4 text-sm leading-6 text-slate-600">{plan.blurb}</p>
              <ul className="mt-5 flex-1 space-y-2.5">
                {plan.items.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-slate-700">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <Link to={plan.to} className="mt-6 block">
                <Button className="w-full" variant={plan.featured ? 'primary' : 'secondary'}>
                  {plan.cta}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </Card>
          ))}
        </div>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {sellScript.map((s) => (
            <Card key={s.q} className="p-5">
              <div className="text-sm font-semibold text-slate-900">{s.q}</div>
              <p className="mt-2 text-sm leading-6 text-slate-500">{s.a}</p>
            </Card>
          ))}
        </div>

        <Card className="mt-10 border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
          <div className="font-semibold">Honest product status</div>
          <p className="mt-1">
            This build is a polished <span className="font-medium">First Deal OS demo</span> — strong enough to
            sell founding access and coach workshops. It is not yet a multi-tenant SaaS (auth, billing, multi-deal
            cloud). Sell the outcome now; ship Pro Workspace features next.
          </p>
        </Card>
      </section>
    </div>
  )
}
