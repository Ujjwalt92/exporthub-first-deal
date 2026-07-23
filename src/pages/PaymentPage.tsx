import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { usd } from '../lib/costing'
import { GateBanner, TaskChecklist } from '../components/TaskChecklist'
import { BeginnerCallout } from '../components/BeginnerCallout'
import { Button, Card, Field, Input, PageHeader, Textarea } from '../components/ui'

export function PaymentPage() {
  const {
    deal,
    updatePayment,
    updatePaymentTask,
    markPaymentComplete,
    setStage,
  } = useStore()
  const blocked = !deal.vessel.blReceived
  const p = deal.payment
  const expected = deal.unitPriceUsd ? deal.unitPriceUsd * deal.quantityKg : 0
  const canComplete =
    !blocked && p.docsLodgedWithBank && !!p.realizationDate && (p.amountReceivedUsd ?? 0) > 0

  return (
    <div>
      <PageHeader
        title="Bank lodgement & payment"
        subtitle="Rule 6: Documents = Payment. LC वाले exact documents lodge करो, discrepancy आने पर तुरंत amend/correct करो।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/bank-docs">
              <Button variant="secondary">Bank docs matcher</Button>
            </Link>
            <Link to="/post-shipment">
              <Button variant="secondary">Post-shipment</Button>
            </Link>
            <Link to="/documents">
              <Button variant="secondary">Document map</Button>
            </Link>
            <Button
              disabled={!canComplete}
              onClick={() => {
                markPaymentComplete()
                setStage('closed')
              }}
            >
              Mark payment complete
            </Button>
          </div>
        }
      />

      <BeginnerCallout stageIds={['payment', 'bank-docs', 'po-lc']} />

      <GateBanner
        blocked={blocked}
        message="Payment stage unlocks after B/L is received."
        okMessage={`Expected FOB value around ${expected ? usd(expected) : '—'} (from locked PI).`}
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 text-sm font-semibold">Bank checklist</div>
          <TaskChecklist
            tasks={p.tasks}
            disabled={blocked}
            onToggle={(id, done) => updatePaymentTask(id, { done })}
            onNote={(id, note) => updatePaymentTask(id, { note })}
          />
        </Card>

        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
            <input
              type="checkbox"
              disabled={blocked}
              checked={p.docsLodgedWithBank}
              onChange={(e) => updatePayment({ docsLodgedWithBank: e.target.checked })}
            />
            Documents lodged with bank
          </label>
          <Field label="Lodge date">
            <Input
              type="date"
              disabled={blocked}
              value={p.lodgeDate}
              onChange={(e) => updatePayment({ lodgeDate: e.target.value })}
            />
          </Field>
          <Field label="Negotiation / collection ref">
            <Input
              disabled={blocked}
              value={p.negotiationRef}
              onChange={(e) => updatePayment({ negotiationRef: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Discrepancy notes">
              <Textarea
                rows={2}
                disabled={blocked}
                value={p.discrepancyNotes}
                onChange={(e) => updatePayment({ discrepancyNotes: e.target.value })}
              />
            </Field>
          </div>
          <Field label="Amount received (USD)">
            <Input
              type="number"
              disabled={blocked}
              value={p.amountReceivedUsd ?? ''}
              onChange={(e) =>
                updatePayment({
                  amountReceivedUsd: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Amount received (INR)">
            <Input
              type="number"
              disabled={blocked}
              value={p.amountReceivedInr ?? ''}
              onChange={(e) =>
                updatePayment({
                  amountReceivedInr: e.target.value === '' ? null : Number(e.target.value),
                })
              }
            />
          </Field>
          <Field label="Realization date">
            <Input
              type="date"
              disabled={blocked}
              value={p.realizationDate}
              onChange={(e) => updatePayment({ realizationDate: e.target.value })}
            />
          </Field>
          <Field label="FIRC / e-BRC ref">
            <Input
              disabled={blocked}
              value={p.fircRef}
              onChange={(e) => updatePayment({ fircRef: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <Textarea
                rows={3}
                disabled={blocked}
                value={p.notes}
                onChange={(e) => updatePayment({ notes: e.target.value })}
              />
            </Field>
          </div>
        </Card>
      </div>

      {deal.stage === 'closed' || p.paymentComplete ? (
        <Card className="mt-6 border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-950">
          🎉 Deal closed for learning purposes. अब cost sheet में Actual Paid columns भरकर अपनी पहली
          deal की असली profitability निकालो — यही experienced trader की आदत है।
        </Card>
      ) : null}
    </div>
  )
}
