import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary, dealProgress } from '../lib/costing'
import { Button, Card, PageHeader } from '../components/ui'

export function LessonPage() {
  const { deal } = useStore()
  const summary = computeCostSummary(deal)
  const progress = dealProgress(deal)

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
          <div className="font-semibold text-slate-900">Full path in this app</div>
          <ol className="mt-3 list-decimal space-y-2 pl-5">
            <li>
              <Link className="font-medium text-teal-700 hover:underline" to="/company">
                Company Setup
              </Link>
            </li>
            <li>
              <Link className="font-medium text-teal-700 hover:underline" to="/clarify">
                Buyer Clarify
              </Link>
            </li>
            <li>
              <Link className="font-medium text-teal-700 hover:underline" to="/cost-sheet">
                Cost Sheet
              </Link>
            </li>
            <li>
              <Link className="font-medium text-teal-700 hover:underline" to="/proforma">
                Proforma Invoice
              </Link>
            </li>
            <li>
              <Link className="font-medium text-teal-700 hover:underline" to="/po-lc">
                PO / LC Review
              </Link>
            </li>
            <li>
              <Link className="font-medium text-teal-700 hover:underline" to="/vendor">
                Vendor Confirm
              </Link>
            </li>
            <li>
              <Link className="font-medium text-teal-700 hover:underline" to="/production">
                Production
              </Link>{' '}
              →{' '}
              <Link className="font-medium text-teal-700 hover:underline" to="/dispatch">
                Dispatch
              </Link>{' '}
              →{' '}
              <Link className="font-medium text-teal-700 hover:underline" to="/customs">
                Customs
              </Link>{' '}
              →{' '}
              <Link className="font-medium text-teal-700 hover:underline" to="/vessel">
                Vessel
              </Link>{' '}
              →{' '}
              <Link className="font-medium text-teal-700 hover:underline" to="/payment">
                Payment
              </Link>
            </li>
          </ol>
        </Card>

        <Card className="p-5 text-sm leading-7 text-slate-700">
          <div className="font-semibold text-slate-900">Current checkpoint</div>
          <p className="mt-2">
            Overall progress: <strong>{progress.pct}%</strong>
            <br />
            Clarifying done? <strong>{summary.clarifyingDone ? 'Yes' : 'No'}</strong>
            <br />
            PI unit price locked?{' '}
            <strong>{deal.unitPriceUsd ? `USD ${deal.unitPriceUsd}/kg` : 'Not yet'}</strong>
            <br />
            LC cleared? <strong>{deal.lcClearedForProduction ? 'Yes' : 'No'}</strong>
            <br />
            Vendor confirmed? <strong>{deal.vendor.confirmed ? 'Yes' : 'No'}</strong>
            <br />
            Payment complete? <strong>{deal.payment.paymentComplete ? 'Yes' : 'No'}</strong>
          </p>
          <div className="mt-4">
            <Link
              to={
                !deal.company.onboardingDone && !deal.company.iec
                  ? '/company'
                  : !summary.clarifyingDone
                    ? '/clarify'
                    : !deal.unitPriceUsd
                      ? '/cost-sheet'
                      : !deal.lcClearedForProduction
                        ? '/po-lc'
                        : !deal.vendor.confirmed
                          ? '/vendor'
                          : !deal.production.readyForPickup
                            ? '/production'
                            : !deal.dispatch.departedForPort
                              ? '/dispatch'
                              : !deal.customs.leoReceived
                                ? '/customs'
                                : !deal.vessel.blReceived
                                  ? '/vessel'
                                  : '/payment'
              }
            >
              <Button>Continue next step</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
