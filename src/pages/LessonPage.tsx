import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary } from '../lib/costing'
import { Button, Card, PageHeader } from '../components/ui'

export function LessonPage() {
  const { deal } = useStore()
  const summary = computeCostSummary(deal)

  return (
    <div>
      <PageHeader
        title="Today’s Lesson"
        subtitle="एक ही deal को start-to-end चलाकर सीखेंगे — PO, LC, production, dispatch, customs, vessel, payment।"
      />

      <div className="grid gap-4">
        <Card className="p-5 text-sm leading-7 text-slate-700">
          <div className="font-semibold text-slate-900">सवाल जो पहली सीख खोलता है</div>
          <p className="mt-2">
            अगर buyer सिर्फ लिखे: <em>“1 × 20 ft container के लिए अपना best price भेजो”</em> — क्या तुम
            सीधे price भेजोगे या पहले जानकारी लोगे?
          </p>
          <p className="mt-2 rounded-xl bg-teal-50 px-4 py-3 text-teal-950">
            सही जवाब: <strong>पहले जानकारी लो</strong>। Experienced exporter grade, packing, port,
            incoterm, payment, timeline और special tests clear करता है — फिर cost sheet बनाता है —
            फिर final quote देता है।
          </p>
        </Card>

        <Card className="p-5 text-sm leading-7 text-slate-700">
          <div className="font-semibold text-slate-900">इस app में तुम्हारा path</div>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              <Link className="font-medium text-teal-700 hover:underline" to="/clarify">
                Buyer Clarify
              </Link>{' '}
              — सवाल पूछो / जवाब lock करो
            </li>
            <li>
              <Link className="font-medium text-teal-700 hover:underline" to="/cost-sheet">
                Cost Sheet
              </Link>{' '}
              — Estimated / Quoted / Actual Paid
            </li>
            <li>
              <Link className="font-medium text-teal-700 hover:underline" to="/proforma">
                Proforma Invoice
              </Link>{' '}
              — unit price तभी जब costing complete हो
            </li>
            <li>
              <Link className="font-medium text-teal-700 hover:underline" to="/documents">
                Document Map
              </Link>{' '}
              — IEC → PI → PO/LC → CI/PL → SB/Phyto/COO → B/L → Payment
            </li>
          </ol>
        </Card>

        <Card className="p-5 text-sm leading-7 text-slate-700">
          <div className="font-semibold text-slate-900">Current checkpoint</div>
          <p className="mt-2">
            Clarifying done? <strong>{summary.clarifyingDone ? 'Yes' : 'No'}</strong>
            <br />
            Cost checklist ready for final quote?{' '}
            <strong>{summary.canSendFinalPrice ? 'Yes' : 'No'}</strong>
            <br />
            PI unit price locked? <strong>{deal.unitPriceUsd ? `USD ${deal.unitPriceUsd}/kg` : 'Not yet'}</strong>
          </p>
          <div className="mt-4">
            <Link to={summary.clarifyingDone ? '/cost-sheet' : '/clarify'}>
              <Button>Continue next step</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
