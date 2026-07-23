import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Cloud,
  CreditCard,
  HardDrive,
  LogOut,
  Plus,
  Trash2,
  Users,
} from 'lucide-react'
import { useAuth } from '../lib/AuthContext'
import { useToast } from '../components/Toast'
import { stageLabel } from '../lib/costing'
import { Badge, Button, Card, PageHeader } from '../components/ui'
import type { DealStage } from '../types'

export function DashboardPage() {
  const {
    user,
    workspace,
    deals,
    mode,
    bootstrapping,
    createDeal,
    deleteDeal,
    setActiveDealId,
    logout,
  } = useAuth()
  const toast = useToast()
  const navigate = useNavigate()
  const [busy, setBusy] = useState(false)

  if (bootstrapping) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-slate-500">
        Loading workspace…
      </div>
    )
  }
  if (!user || !workspace) return <Navigate to="/login" replace />

  const dealLimit = workspace.limits.deals
  const atLimit = deals.length >= dealLimit

  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-700 text-xs font-bold text-white">
              EH
            </div>
            <div>
              <div className="text-sm font-semibold">{workspace.name}</div>
              <div className="text-[10px] uppercase tracking-[0.12em] text-slate-400">SaaS dashboard</div>
            </div>
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={mode === 'cloud' ? 'teal' : 'amber'}>
              {mode === 'cloud' ? (
                <span className="inline-flex items-center gap-1">
                  <Cloud className="h-3 w-3" /> Cloud
                </span>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <HardDrive className="h-3 w-3" /> Local vault
                </span>
              )}
            </Badge>
            <Badge tone="blue">{workspace.plan}</Badge>
            <Button
              size="sm"
              variant="ghost"
              onClick={async () => {
                await logout()
                navigate('/')
              }}
            >
              <LogOut className="h-4 w-4" />
              Log out
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <PageHeader
          eyebrow="Workspace"
          title={`Welcome, ${user.name.split(' ')[0]}`}
          subtitle={`${deals.length}/${dealLimit === 1000 ? '∞' : dealLimit} deals · plan ${workspace.plan}`}
          actions={
            <div className="flex flex-wrap gap-2">
              <Link to="/app/billing">
                <Button variant="secondary">
                  <CreditCard className="h-4 w-4" />
                  Billing
                </Button>
              </Link>
              <Link to="/app/team">
                <Button variant="secondary">
                  <Users className="h-4 w-4" />
                  Team
                </Button>
              </Link>
              <Button
                disabled={busy || atLimit}
                onClick={async () => {
                  setBusy(true)
                  try {
                    const id = await createDeal()
                    toast.success('Deal created')
                    navigate('/workspace')
                    setActiveDealId(id)
                  } catch (err) {
                    toast.error(err instanceof Error ? err.message : 'Could not create deal')
                  } finally {
                    setBusy(false)
                  }
                }}
              >
                <Plus className="h-4 w-4" />
                {atLimit ? 'Upgrade for more deals' : 'New deal'}
              </Button>
            </div>
          }
        />

        {atLimit ? (
          <Card className="mb-6 border-amber-200 bg-amber-50 p-4 text-sm text-amber-950">
            Free plan allows 1 live deal.{' '}
            <Link className="font-semibold underline" to="/app/billing">
              Upgrade to Founding or Pro
            </Link>{' '}
            for unlimited shipments.
          </Card>
        ) : null}

        {deals.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="text-sm font-semibold text-slate-900">No deals yet</div>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
              Create your first Teja S17 demo deal and run the full path from inquiry to FIRC with cloud sync.
            </p>
            <Button
              className="mt-5"
              disabled={busy}
              onClick={async () => {
                setBusy(true)
                try {
                  const id = await createDeal('Teja S17 · UAE First Deal')
                  setActiveDealId(id)
                  toast.success('First deal ready')
                  navigate('/workspace')
                } catch (err) {
                  toast.error(err instanceof Error ? err.message : 'Could not create deal')
                } finally {
                  setBusy(false)
                }
              }}
            >
              Create first deal
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {deals.map((deal) => (
              <Card key={deal.id} className="p-5" hover>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-sm font-semibold text-slate-900">{deal.title}</div>
                    <div className="mt-1 text-xs text-slate-500">
                      {deal.productName} · {deal.buyerName}
                    </div>
                  </div>
                  <Badge tone="slate">{deal.progressPct}%</Badge>
                </div>
                <div className="mt-4 text-xs text-slate-500">
                  Stage · {stageLabel(deal.stage as DealStage)}
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className="h-full rounded-full bg-teal-600"
                    style={{ width: `${deal.progressPct}%` }}
                  />
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    onClick={() => {
                      setActiveDealId(deal.id)
                      navigate('/workspace')
                    }}
                  >
                    Open cockpit
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={async () => {
                      if (!confirm('Delete this deal permanently?')) return
                      try {
                        await deleteDeal(deal.id)
                        toast.info('Deal deleted')
                      } catch (err) {
                        toast.error(err instanceof Error ? err.message : 'Delete failed')
                      }
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
