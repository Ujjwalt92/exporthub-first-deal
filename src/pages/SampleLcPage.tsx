import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import {
  SAMPLE_LC_CLEAN,
  SAMPLE_LC_WITH_ERRORS,
  LC_MISMATCH_EXAMPLES,
  amendmentDraftFromErrors,
} from '../data/teaching'
import { Badge, Button, Card, PageHeader } from '../components/ui'

export function SampleLcPage() {
  const { deal, updateTeaching } = useStore()
  const scenario = deal.teaching.lcScenario
  const text = scenario === 'clean' ? SAMPLE_LC_CLEAN : SAMPLE_LC_WITH_ERRORS
  const draft = amendmentDraftFromErrors(
    deal.company.legalName || deal.companyName,
    deal.lcNumber || 'LC-UAE-2026-77881-X',
  )

  return (
    <div>
      <PageHeader
        title="Sample LC lab (Rule 5)"
        subtitle="Shared chat में LC पढ़ना सिखाया गया था — यहाँ clean vs error वाली sample LC से practice करो। Production तभी जब हर clause match हो।"
        actions={
          <Link to="/po-lc">
            <Button variant="secondary">Open PO/LC checklist</Button>
          </Link>
        }
      />

      <Card className="mb-6 flex flex-wrap gap-2 p-4">
        <Button
          variant={scenario === 'with_errors' ? 'primary' : 'secondary'}
          onClick={() => updateTeaching({ lcScenario: 'with_errors' })}
        >
          Show LC with errors
        </Button>
        <Button
          variant={scenario === 'clean' ? 'primary' : 'secondary'}
          onClick={() => updateTeaching({ lcScenario: 'clean' })}
        >
          Show clean LC
        </Button>
        <Badge tone={scenario === 'clean' ? 'green' : 'rose'}>
          {scenario === 'clean' ? 'Training: clean LC' : 'Training: amend before production'}
        </Badge>
      </Card>

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 text-sm font-semibold">Sample LC text</div>
          <pre className="max-h-[34rem] overflow-auto whitespace-pre-wrap rounded-xl bg-slate-950 p-4 text-xs leading-5 text-emerald-100">
            {text}
          </pre>
        </Card>

        <div className="space-y-4">
          <Card className="p-5">
            <div className="mb-3 text-sm font-semibold">Common mismatches & fixes</div>
            <div className="space-y-3">
              {LC_MISMATCH_EXAMPLES.map((m) => (
                <div key={m.id} className="rounded-xl border border-slate-200 p-3 text-sm">
                  <div className="font-medium text-slate-900">{m.issue}</div>
                  <div className="mt-1 text-xs text-rose-700">Risk: {m.whyDangerous}</div>
                  <div className="mt-1 text-xs text-emerald-700">Fix: {m.fix}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-5">
            <div className="mb-3 flex items-center justify-between gap-2">
              <div className="text-sm font-semibold">Amendment draft (copy/send)</div>
              <Button
                variant="secondary"
                onClick={async () => {
                  await navigator.clipboard.writeText(draft)
                  alert('Amendment draft copied')
                }}
              >
                Copy
              </Button>
            </div>
            <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
              {draft}
            </pre>
          </Card>
        </div>
      </div>
    </div>
  )
}
