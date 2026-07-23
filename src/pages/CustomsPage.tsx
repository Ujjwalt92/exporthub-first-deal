import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { GateBanner, TaskChecklist } from '../components/TaskChecklist'
import { Button, Card, Field, Input, PageHeader, Textarea } from '../components/ui'

export function CustomsPage() {
  const { deal, updateCustoms, updateCustomsTask, markCustomsLeo, setStage } = useStore()
  const blocked = !deal.dispatch.departedForPort
  const c = deal.customs
  const canLeo = !blocked && !!c.chaName && !!c.shippingBillNo && !!c.phytoNo

  return (
    <div>
      <PageHeader
        title="Customs & certificates"
        subtitle="CHA + Shipping Bill + Phyto + COO (+ fumigation). LEO मिलने तक vessel cut-off पर panic मत करें — docs पहले।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/dispatch">
              <Button variant="secondary">Dispatch</Button>
            </Link>
            <Button
              disabled={!canLeo}
              onClick={() => {
                markCustomsLeo()
                setStage('vessel')
              }}
            >
              Mark LEO received
            </Button>
          </div>
        }
      />

      <GateBanner
        blocked={blocked}
        message="Customs stage unlocks after stuffed cargo has moved toward port."
        okMessage="Give CHA a clean file: CI, PL, IEC, GST, LC copy, invoices."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="p-5">
          <div className="mb-4 text-sm font-semibold">Customs checklist</div>
          <TaskChecklist
            tasks={c.tasks}
            disabled={blocked}
            onToggle={(id, done) => updateCustomsTask(id, { done })}
            onNote={(id, note) => updateCustomsTask(id, { note })}
          />
        </Card>
        <Card className="grid gap-4 p-5 sm:grid-cols-2">
          <Field label="CHA name">
            <Input
              disabled={blocked}
              value={c.chaName}
              onChange={(e) => updateCustoms({ chaName: e.target.value })}
            />
          </Field>
          <Field label="Shipping Bill no.">
            <Input
              disabled={blocked}
              value={c.shippingBillNo}
              onChange={(e) => updateCustoms({ shippingBillNo: e.target.value })}
            />
          </Field>
          <Field label="Shipping Bill date">
            <Input
              type="date"
              disabled={blocked}
              value={c.shippingBillDate}
              onChange={(e) => updateCustoms({ shippingBillDate: e.target.value })}
            />
          </Field>
          <Field label="Phyto no.">
            <Input
              disabled={blocked}
              value={c.phytoNo}
              onChange={(e) => updateCustoms({ phytoNo: e.target.value })}
            />
          </Field>
          <Field label="Phyto date">
            <Input
              type="date"
              disabled={blocked}
              value={c.phytoDate}
              onChange={(e) => updateCustoms({ phytoDate: e.target.value })}
            />
          </Field>
          <Field label="COO no.">
            <Input
              disabled={blocked}
              value={c.cooNo}
              onChange={(e) => updateCustoms({ cooNo: e.target.value })}
            />
          </Field>
          <Field label="COO date">
            <Input
              type="date"
              disabled={blocked}
              value={c.cooDate}
              onChange={(e) => updateCustoms({ cooDate: e.target.value })}
            />
          </Field>
          <Field label="Fumigation cert no. (if any)">
            <Input
              disabled={blocked}
              value={c.fumigationNo}
              onChange={(e) => updateCustoms({ fumigationNo: e.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <Textarea
                rows={3}
                disabled={blocked}
                value={c.notes}
                onChange={(e) => updateCustoms({ notes: e.target.value })}
              />
            </Field>
          </div>
        </Card>
      </div>
    </div>
  )
}
