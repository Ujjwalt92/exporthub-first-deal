import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate } from 'react-router-dom'
import { Check, Sparkles } from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { saas, type BillingPlan, type PlanId } from '../lib/saas'
import { useToast } from '../components/Toast'
import { Badge, Button, Card, PageHeader } from '../components/ui'

export function BillingPage() {
  const { user, workspace, bootstrapping, changePlan, mode } = useAuth()
  const toast = useToast()
  const [plans, setPlans] = useState<BillingPlan[]>([])
  const [busy, setBusy] = useState<PlanId | null>(null)

  useEffect(() => {
    saas.plans().then((r) => setPlans(r.plans)).catch(() => undefined)
  }, [])

  if (bootstrapping) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading…</div>
  }
  if (!user || !workspace) return <Navigate to="/login" replace />

  async function activate(plan: PlanId) {
    setBusy(plan)
    try {
      const message = await changePlan(plan)
      toast.success(message)
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Billing update failed')
    } finally {
      setBusy(null)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/app" className="text-sm font-semibold text-slate-900">
            ← Back to dashboard
          </Link>
          <Badge tone="teal">Current · {workspace.plan}</Badge>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHeader
          eyebrow="Billing"
          title="Plans & upgrades"
          subtitle={`Workspace billing for ${workspace.name}. Mode: ${mode}. Razorpay/Stripe webhook can replace the activate buttons in production.`}
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {plans.map((plan) => {
            const current = workspace.plan === plan.id
            return (
              <Card
                key={plan.id}
                className={`flex flex-col p-6 ${plan.id === 'founding' ? 'border-teal-300 ring-2 ring-teal-600/15' : ''}`}
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold">{plan.name}</div>
                  {plan.id === 'founding' ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-teal-700 px-2 py-0.5 text-[10px] font-semibold uppercase text-white">
                      <Sparkles className="h-3 w-3" /> Best
                    </span>
                  ) : null}
                </div>
                <div className="mt-4 text-3xl font-semibold tracking-tight">
                  {plan.priceInr === 0 ? 'Free' : `₹${plan.priceInr.toLocaleString('en-IN')}`}
                </div>
                <div className="mt-1 text-xs text-slate-500">{plan.period}</div>
                <ul className="mt-5 flex-1 space-y-2">
                  {plan.features.map((f) => (
                    <li key={f} className="flex gap-2 text-sm text-slate-700">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className="mt-6 w-full"
                  variant={current ? 'secondary' : plan.id === 'founding' ? 'primary' : 'secondary'}
                  disabled={current || busy === plan.id}
                  onClick={() => activate(plan.id)}
                >
                  {current ? 'Current plan' : busy === plan.id ? 'Activating…' : `Activate ${plan.name}`}
                </Button>
              </Card>
            )
          })}
        </div>
        <Card className="mt-8 border-slate-200 bg-slate-50 p-5 text-sm leading-6 text-slate-600">
          <div className="font-semibold text-slate-900">Payment integration note</div>
          Checkout is currently a secure in-app plan activation (demo SaaS billing). Plug Razorpay Payment Links or
          Stripe Checkout into <code className="rounded bg-white px-1">POST /workspace/plan</code> with webhook
          verification before taking live money.
        </Card>
      </main>
    </div>
  )
}

export function TeamPage() {
  const { user, workspace, members, bootstrapping, inviteMember, role } = useAuth()
  const toast = useToast()
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [lastToken, setLastToken] = useState<string | null>(null)

  if (bootstrapping) {
    return <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">Loading…</div>
  }
  if (!user || !workspace) return <Navigate to="/login" replace />

  async function onInvite(e: FormEvent) {
    e.preventDefault()
    setBusy(true)
    try {
      const token = await inviteMember(email)
      setLastToken(token)
      setEmail('')
      toast.success('Invite created')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Invite failed')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3 sm:px-6">
          <Link to="/app" className="text-sm font-semibold text-slate-900">
            ← Back to dashboard
          </Link>
          <Badge tone="slate">
            {members.length}/{workspace.limits.seats} seats
          </Badge>
        </div>
      </header>
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <PageHeader
          eyebrow="Team"
          title="Workspace members"
          subtitle="Invite ops, CHA partners, or finance onto the same deal desk."
        />
        <Card className="mb-6 p-5">
          <div className="text-sm font-semibold">Members</div>
          <div className="mt-3 space-y-2">
            {members.map((m) => (
              <div
                key={m.id}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-3 py-3 text-sm"
              >
                <div>
                  <div className="font-medium text-slate-900">{m.user?.name || 'Unknown'}</div>
                  <div className="text-xs text-slate-500">{m.user?.email}</div>
                </div>
                <Badge tone="teal">{m.role}</Badge>
              </div>
            ))}
          </div>
        </Card>

        {role !== 'member' ? (
          <Card className="p-5">
            <div className="text-sm font-semibold">Invite teammate</div>
            <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={onInvite}>
              <input
                className="w-full flex-1 rounded-xl border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-teal-600 focus:ring-2 focus:ring-teal-600/15"
                type="email"
                required
                placeholder="colleague@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Button disabled={busy}>{busy ? 'Inviting…' : 'Send invite'}</Button>
            </form>
            {lastToken ? (
              <p className="mt-3 text-xs leading-5 text-slate-500">
                Invite token (share securely): <code className="rounded bg-slate-100 px-1">{lastToken}</code>
                <br />
                Accept at <code className="rounded bg-slate-100 px-1">/#/accept-invite?token=…</code>
              </p>
            ) : null}
          </Card>
        ) : (
          <Card className="p-5 text-sm text-slate-500">Only owners/admins can invite members.</Card>
        )}
      </main>
    </div>
  )
}
