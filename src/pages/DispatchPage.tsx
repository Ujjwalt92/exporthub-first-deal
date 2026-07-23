import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { GateBanner } from '../components/TaskChecklist'
import { BeginnerCallout } from '../components/BeginnerCallout'
import { Button, Card, Field, Input, PageHeader, Textarea } from '../components/ui'

export function DispatchPage() {
  const { deal, updateDispatch, markDispatchDone, setStage } = useStore()
  const blocked = !deal.production.readyForPickup
  const d = deal.dispatch
  const canFinish =
    !blocked &&
    !!d.truckNumber &&
    !!d.containerNumber &&
    !!d.sealNumber &&
    !!d.ciNumber &&
    !!d.plNumber &&
    d.stuffed

  return (
    <div>
      <PageHeader
        title="Dispatch & stuffing"
        subtitle="Pickup → stuffing → port movement. यहीं Commercial Invoice और Packing List final होते हैं (Rule 4)."
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/documents/commercial-invoice">
              <Button variant="secondary">Commercial Invoice</Button>
            </Link>
            <Link to="/documents/packing-list">
              <Button variant="secondary">Packing List</Button>
            </Link>
            <Button
              disabled={!canFinish}
              onClick={() => {
                markDispatchDone()
                setStage('customs')
              }}
            >
              Mark stuffed & moved to port
            </Button>
          </div>
        }
      />

      <BeginnerCallout stageIds={['dispatch', 'vessel']} />

      <GateBanner
        blocked={blocked}
        message="Dispatch locked until production is marked ready for pickup."
        okMessage="Cargo ready — capture truck, container, seal and document numbers."
      />

      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Transporter">
          <Input
            disabled={blocked}
            value={d.transporterName}
            onChange={(e) => updateDispatch({ transporterName: e.target.value })}
          />
        </Field>
        <Field label="Truck number">
          <Input
            disabled={blocked}
            value={d.truckNumber}
            onChange={(e) => updateDispatch({ truckNumber: e.target.value })}
          />
        </Field>
        <Field label="E-way bill">
          <Input
            disabled={blocked}
            value={d.ewayBill}
            onChange={(e) => updateDispatch({ ewayBill: e.target.value })}
          />
        </Field>
        <Field label="Pickup date">
          <Input
            type="date"
            disabled={blocked}
            value={d.pickupDate}
            onChange={(e) => updateDispatch({ pickupDate: e.target.value })}
          />
        </Field>
        <Field label="Stuffing date">
          <Input
            type="date"
            disabled={blocked}
            value={d.stuffingDate}
            onChange={(e) => updateDispatch({ stuffingDate: e.target.value })}
          />
        </Field>
        <Field label="Factory / purchase invoice no.">
          <Input
            disabled={blocked}
            value={d.factoryInvoiceNo}
            onChange={(e) => updateDispatch({ factoryInvoiceNo: e.target.value })}
          />
        </Field>
        <Field label="Container number">
          <Input
            disabled={blocked}
            value={d.containerNumber}
            onChange={(e) => updateDispatch({ containerNumber: e.target.value })}
          />
        </Field>
        <Field label="Seal number">
          <Input
            disabled={blocked}
            value={d.sealNumber}
            onChange={(e) => updateDispatch({ sealNumber: e.target.value })}
          />
        </Field>
        <Field label="Commercial Invoice no.">
          <Input
            disabled={blocked}
            value={d.ciNumber}
            onChange={(e) => updateDispatch({ ciNumber: e.target.value })}
          />
        </Field>
        <Field label="CI date">
          <Input
            type="date"
            disabled={blocked}
            value={d.ciDate}
            onChange={(e) => updateDispatch({ ciDate: e.target.value })}
          />
        </Field>
        <Field label="Packing List no.">
          <Input
            disabled={blocked}
            value={d.plNumber}
            onChange={(e) => updateDispatch({ plNumber: e.target.value })}
          />
        </Field>
        <Field label="Marks & numbers">
          <Input
            disabled={blocked}
            value={d.marksAndNumbers}
            onChange={(e) => updateDispatch({ marksAndNumbers: e.target.value })}
          />
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            disabled={blocked}
            checked={d.stuffed}
            onChange={(e) => updateDispatch({ stuffed: e.target.checked })}
          />
          Container stuffed & sealed
        </label>
        <div className="sm:col-span-2">
          <Field label="Notes">
            <Textarea
              rows={3}
              disabled={blocked}
              value={d.notes}
              onChange={(e) => updateDispatch({ notes: e.target.value })}
            />
          </Field>
        </div>
      </Card>
    </div>
  )
}
