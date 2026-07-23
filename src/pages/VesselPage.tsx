import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { GateBanner } from '../components/TaskChecklist'
import { Button, Card, Field, Input, PageHeader, Select, Textarea } from '../components/ui'

export function VesselPage() {
  const { deal, updateVessel, markBlReceived, setStage } = useStore()
  const blocked = !deal.customs.leoReceived
  const v = deal.vessel
  const canBl = !blocked && !!v.bookingRef && !!v.vesselName && !!v.blNumber && !!v.blType

  return (
    <div>
      <PageHeader
        title="Vessel & Bill of Lading"
        subtitle="Booking → onboard → B/L. Existing traders: B/L type (original/telex/seaway) LC से match करना मत भूलना।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/templates">
              <Button variant="secondary">Shipment advice email</Button>
            </Link>
            <Button
              disabled={!canBl}
              onClick={() => {
                markBlReceived()
                setStage('payment')
              }}
            >
              Mark B/L received
            </Button>
          </div>
        }
      />

      <GateBanner
        blocked={blocked}
        message="Vessel stage unlocks after LEO (customs export clearance)."
        okMessage="Track forwarder booking and B/L details carefully for bank lodgement."
      />

      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Forwarder / liner">
          <Input
            disabled={blocked}
            value={v.forwarderName}
            onChange={(e) => updateVessel({ forwarderName: e.target.value })}
          />
        </Field>
        <Field label="Booking ref">
          <Input
            disabled={blocked}
            value={v.bookingRef}
            onChange={(e) => updateVessel({ bookingRef: e.target.value })}
          />
        </Field>
        <Field label="Vessel name">
          <Input
            disabled={blocked}
            value={v.vesselName}
            onChange={(e) => updateVessel({ vesselName: e.target.value })}
          />
        </Field>
        <Field label="Voyage no.">
          <Input
            disabled={blocked}
            value={v.voyageNo}
            onChange={(e) => updateVessel({ voyageNo: e.target.value })}
          />
        </Field>
        <Field label="ETD">
          <Input
            type="date"
            disabled={blocked}
            value={v.etd}
            onChange={(e) => updateVessel({ etd: e.target.value })}
          />
        </Field>
        <Field label="ETA">
          <Input
            type="date"
            disabled={blocked}
            value={v.eta}
            onChange={(e) => updateVessel({ eta: e.target.value })}
          />
        </Field>
        <Field label="B/L number">
          <Input
            disabled={blocked}
            value={v.blNumber}
            onChange={(e) => updateVessel({ blNumber: e.target.value })}
          />
        </Field>
        <Field label="B/L date">
          <Input
            type="date"
            disabled={blocked}
            value={v.blDate}
            onChange={(e) => updateVessel({ blDate: e.target.value })}
          />
        </Field>
        <Field label="B/L type">
          <Select
            disabled={blocked}
            value={v.blType}
            onChange={(e) =>
              updateVessel({ blType: e.target.value as typeof v.blType })
            }
          >
            <option value="">Select</option>
            <option value="original">Full set originals</option>
            <option value="telex">Telex release</option>
            <option value="seaway">Seaway bill</option>
          </Select>
        </Field>
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            disabled={blocked}
            checked={v.onboardConfirmed}
            onChange={(e) => updateVessel({ onboardConfirmed: e.target.checked })}
          />
          Onboard / shipped on board confirmed
        </label>
        <div className="sm:col-span-2">
          <Field label="Notes">
            <Textarea
              rows={3}
              disabled={blocked}
              value={v.notes}
              onChange={(e) => updateVessel({ notes: e.target.value })}
            />
          </Field>
        </div>
      </Card>
    </div>
  )
}
