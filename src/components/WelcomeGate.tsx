import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useStore } from '../lib/StoreContext'
import { useToast } from './Toast'
import { Button, Card } from './ui'

export function WelcomeGate() {
  const { deal, markWelcomeSeen, importDealJson } = useStore()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  if (deal.onboarding.seenWelcome || deal.onboarding.completedAt) return null

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-[2px]">
      <Card className="max-h-[90vh] w-full max-w-xl overflow-y-auto p-6 shadow-2xl">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-700 text-xs font-bold text-white">
            EH
          </div>
          <div>
            <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-teal-700">ExportHub</div>
            <div className="text-xs text-slate-500">First Deal OS</div>
          </div>
        </div>
        <h2 className="mt-4 text-2xl font-semibold tracking-tight text-slate-900">
          Welcome — start from zero without burning margin
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          If export is new for you, do not send a rate yet. Learn who CHA / forwarder / bank are, then run the
          included UAE Teja deal with Rule 1 locked.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
          <li>Complete the Start Here checklist</li>
          <li>Read the Absolute Beginner Guide</li>
          <li>Fill Company Setup</li>
          <li>Then handle the morning UAE email</li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/start-here" onClick={() => markWelcomeSeen()}>
            <Button>Go to Start Here</Button>
          </Link>
          <Link to="/beginner" onClick={() => markWelcomeSeen()}>
            <Button variant="secondary">Beginner Guide</Button>
          </Link>
          <Button variant="ghost" onClick={() => markWelcomeSeen()}>
            I’m experienced — skip
          </Button>
        </div>
        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="text-xs font-medium text-slate-500">Already have a backup?</div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={async (e) => {
              const file = e.target.files?.[0]
              if (!file) return
              const text = await file.text()
              const result = importDealJson(text)
              if (!result.ok) toast.error(result.error)
              else {
                markWelcomeSeen()
                toast.success('Deal backup imported')
              }
            }}
          />
          <Button className="mt-2" variant="secondary" onClick={() => fileRef.current?.click()}>
            Import deal JSON
          </Button>
        </div>
      </Card>
    </div>
  )
}
