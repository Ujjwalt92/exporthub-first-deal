import { Link } from 'react-router-dom'
import { useRef } from 'react'
import { useStore } from '../lib/StoreContext'
import { Button, Card } from './ui'

export function WelcomeGate() {
  const { deal, markWelcomeSeen, importDealJson } = useStore()
  const fileRef = useRef<HTMLInputElement>(null)

  if (deal.onboarding.seenWelcome || deal.onboarding.completedAt) return null

  return (
    <div className="no-print fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
      <Card className="max-h-[90vh] w-full max-w-xl overflow-y-auto p-6 shadow-2xl">
        <div className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">ExportHub</div>
        <h2 className="mt-2 text-2xl font-semibold text-slate-900">Welcome — start from zero safely</h2>
        <p className="mt-3 text-sm leading-7 text-slate-600">
          Agar export business bilkul naya hai, seedha rate mat bhejo. Pehle ABCD samjho: kaun hai CHA,
          kaun hai freight forwarder, bank kab milna hai, costing kaise nikalte hain.
        </p>
        <ol className="mt-4 list-decimal space-y-2 pl-5 text-sm leading-6 text-slate-700">
          <li>Open Start Here checklist</li>
          <li>Read Absolute Beginner Guide</li>
          <li>Fill Company Setup</li>
          <li>Then handle the morning UAE email deal</li>
        </ol>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link to="/start-here" onClick={() => markWelcomeSeen()}>
            <Button>Go to Start Here</Button>
          </Link>
          <Link to="/beginner" onClick={() => markWelcomeSeen()}>
            <Button variant="secondary">Absolute Beginner Guide</Button>
          </Link>
          <Button
            variant="ghost"
            onClick={() => {
              markWelcomeSeen()
            }}
          >
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
              if (!result.ok) alert(result.error)
              else {
                markWelcomeSeen()
                alert('Deal backup imported')
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
