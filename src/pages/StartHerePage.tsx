import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { FIRST_CALL_SCRIPTS } from '../data/onboarding'
import { Badge, Button, Card, PageHeader } from '../components/ui'

export function StartHerePage() {
  const { deal, updateOnboardingItem, completeOnboarding, markWelcomeSeen } = useStore()
  const items = deal.onboarding.checklist
  const doneCount = items.filter((i) => i.done).length
  const allDone = doneCount === items.length

  return (
    <div>
      <PageHeader
        title="Start Here — 100% beginner onboarding"
        subtitle="Export ABCD zero हो तो पहले यही पूरा करो। Checklist + first-call scripts। इसके बिना final price मत भेजना।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => markWelcomeSeen()}>
              Dismiss welcome
            </Button>
            <Button
              disabled={!allDone}
              onClick={() => {
                completeOnboarding()
              }}
            >
              Mark onboarding complete
            </Button>
          </div>
        }
      />

      <Card className="mb-6 p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="text-sm font-semibold">Onboarding checklist</div>
          <Badge tone={allDone ? 'green' : 'amber'}>
            {doneCount}/{items.length} done
          </Badge>
        </div>
        <div className="mt-4 space-y-3">
          {items.map((item, idx) => (
            <div key={item.id} className="rounded-xl border border-slate-200 p-4">
              <label className="flex items-start gap-3">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={item.done}
                  onChange={(e) => updateOnboardingItem(item.id, e.target.checked)}
                />
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {idx + 1}. {item.label}
                  </div>
                  <div className="mt-1 text-xs text-slate-500">{item.detail}</div>
                  <Link to={item.to} className="mt-2 inline-block text-sm font-medium text-teal-700 hover:underline">
                    Open →
                  </Link>
                </div>
              </label>
            </div>
          ))}
        </div>
        {deal.onboarding.completedAt ? (
          <div className="mt-4 rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-900">
            Onboarding completed at {new Date(deal.onboarding.completedAt).toLocaleString()}. Ab deal
            flow confidently चला सकते हो.
          </div>
        ) : null}
      </Card>

      <div className="mb-3 text-sm font-semibold text-slate-900">First-call / WhatsApp scripts</div>
      <div className="grid gap-4 lg:grid-cols-2">
        {FIRST_CALL_SCRIPTS.map((s) => {
          const text = s.script.split('{{company}}').join(deal.company.legalName || deal.companyName)
          return (
            <Card key={s.id} className="p-5">
              <div className="text-sm font-semibold">{s.title}</div>
              <div className="mt-1 text-xs text-slate-500">Who: {s.who}</div>
              <pre className="mt-3 whitespace-pre-wrap rounded-xl bg-slate-50 p-3 text-sm leading-6 text-slate-700">
                {text}
              </pre>
              <Button
                className="mt-3"
                variant="secondary"
                onClick={async () => {
                  await navigator.clipboard.writeText(text)
                  updateOnboardingItem('ob_scripts', true)
                  alert('Script copied')
                }}
              >
                Copy script
              </Button>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
