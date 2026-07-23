import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary } from '../lib/costing'
import { Badge, Button, Card, Field, PageHeader, Textarea } from '../components/ui'

export function ClarifyPage() {
  const { deal, updateClarifying, updateDeal, setStage } = useStore()
  const summary = computeCostSummary(deal)
  const pending = deal.clarifying.filter((q) => !q.answered || !q.answer.trim())

  return (
    <div>
      <PageHeader
        title="पहले buyer से पूछो, फिर price दो"
        subtitle="अगर buyer सिर्फ लिखे ‘1 × 20 ft का best price भेजो’ — experienced exporter सीधे rate नहीं भेजता। पहले जरूरी बातें clear करता है।"
        actions={
          <Link to="/cost-sheet">
            <Button
              disabled={!summary.clarifyingDone}
              onClick={() => setStage('costing')}
            >
              Next: Cost sheet
            </Button>
          </Link>
        }
      />

      <Card className="mb-6 border-teal-100 bg-teal-50/60 p-5 text-sm leading-7 text-teal-950">
        <strong>Lesson:</strong> सीधे price भेजना amateur move है। पहले grade, packing, destination,
        incoterm, payment, shipment window और special tests clear करो। नीचे buyer के जवाब already
        भरे हैं — बस special tests वाला सवाल अभी open है।
      </Card>

      <div className="grid gap-4">
        {deal.clarifying.map((q, idx) => (
          <Card key={q.id} className="p-5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="text-sm font-semibold text-slate-900">
                Q{idx + 1}. {q.question}
              </div>
              <Badge tone={q.answered && q.answer.trim() ? 'green' : 'amber'}>
                {q.answered && q.answer.trim() ? 'Answered' : 'Need answer'}
              </Badge>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-500">{q.why}</p>
            <div className="mt-4">
              <Field label="Buyer answer">
                <Textarea
                  rows={2}
                  value={q.answer}
                  onChange={(e) => updateClarifying(q.id, { answer: e.target.value })}
                  placeholder="Type buyer’s answer…"
                />
              </Field>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <Field
          label="Special tests / certificates note"
          hint="Lab test, fumigation, pesticide residue — cost sheet में optional fumigation line है।"
        >
          <Textarea
            rows={3}
            value={deal.specialTestsNote}
            onChange={(e) => {
              updateDeal({ specialTestsNote: e.target.value })
              updateClarifying('q_tests', {
                answer: e.target.value,
                answered: e.target.value.trim().length > 0,
              })
            }}
            placeholder="e.g. Buyer wants pesticide residue report + fumigation certificate"
          />
        </Field>
        <div className="mt-4 text-sm text-slate-600">
          {pending.length === 0
            ? 'सभी clarifying points clear हैं — अब cost sheet खोलो। Final price अभी भी मत भेजना।'
            : `${pending.length} सवाल अभी बाकी हैं।`}
        </div>
      </Card>
    </div>
  )
}
