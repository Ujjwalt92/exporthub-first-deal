import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { GateBanner, TaskChecklist } from '../components/TaskChecklist'
import { Button, Card, Field, Input, PageHeader, Textarea } from '../components/ui'

export function ProductionPage() {
  const {
    deal,
    updateProduction,
    updateProductionTask,
    markProductionReady,
    setStage,
  } = useStore()
  const blocked = !deal.vendor.confirmed
  const p = deal.production
  const canReady =
    !blocked &&
    p.sampleApproved &&
    p.packedBags >= deal.totalBags &&
    p.netWeightKg > 0 &&
    p.tasks.filter((t) => t.done).length >= 4

  return (
    <div>
      <PageHeader
        title="Production & packing"
        subtitle="Vendor confirm के बाद quality, packing और pickup readiness track करें। New traders: sample approve किए बिना bulk packing मत करवाएँ।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/vendor">
              <Button variant="secondary">Vendor</Button>
            </Link>
            <Button
              disabled={!canReady}
              onClick={() => {
                markProductionReady()
                setStage('dispatch')
              }}
            >
              Mark ready for pickup
            </Button>
          </div>
        }
      />

      <GateBanner
        blocked={blocked}
        message="Production locked until vendor order is confirmed."
        okMessage="Vendor confirmed — track packing and QC here."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 text-sm font-semibold text-slate-900">Production checklist</div>
          <TaskChecklist
            tasks={p.tasks}
            disabled={blocked}
            onToggle={(id, done) => updateProductionTask(id, { done })}
            onNote={(id, note) => updateProductionTask(id, { note })}
          />
        </Card>

        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <label className="flex items-center gap-2 text-sm text-slate-700 sm:col-span-2">
            <input
              type="checkbox"
              disabled={blocked}
              checked={p.sampleApproved}
              onChange={(e) => updateProduction({ sampleApproved: e.target.checked })}
            />
            Sample / quality approved by you (or buyer if required)
          </label>
          <Field label="QC moisture %">
            <Input
              disabled={blocked}
              value={p.qcMoisturePct}
              onChange={(e) => updateProduction({ qcMoisturePct: e.target.value })}
            />
          </Field>
          <Field label="Broken %">
            <Input
              disabled={blocked}
              value={p.qcBrokenPct}
              onChange={(e) => updateProduction({ qcBrokenPct: e.target.value })}
            />
          </Field>
          <Field label="Packed bags">
            <Input
              type="number"
              disabled={blocked}
              value={p.packedBags}
              onChange={(e) => updateProduction({ packedBags: Number(e.target.value) })}
            />
          </Field>
          <Field label="Target bags">
            <Input disabled value={deal.totalBags} />
          </Field>
          <Field label="Net weight kg">
            <Input
              type="number"
              disabled={blocked}
              value={p.netWeightKg}
              onChange={(e) => updateProduction({ netWeightKg: Number(e.target.value) })}
            />
          </Field>
          <Field label="Gross weight kg">
            <Input
              type="number"
              disabled={blocked}
              value={p.grossWeightKg}
              onChange={(e) => updateProduction({ grossWeightKg: Number(e.target.value) })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <Textarea
                rows={3}
                disabled={blocked}
                value={p.notes}
                onChange={(e) => updateProduction({ notes: e.target.value })}
              />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  )
}
