import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { inr } from '../lib/costing'
import { Badge, Button, Card, Field, Input, PageHeader, Textarea } from '../components/ui'

export function VendorPage() {
  const { deal, updateVendor, confirmVendor, setStage, updateCost } = useStore()
  const v = deal.vendor
  const blocked = !deal.lcClearedForProduction
  const canConfirm =
    !blocked &&
    !!v.supplierName.trim() &&
    !!v.readyByDate &&
    v.rateInrPerKg != null &&
    v.rateInrPerKg > 0 &&
    !!v.confirmationRef.trim()

  return (
    <div>
      <PageHeader
        title="Vendor Confirmation (Guntur)"
        subtitle="LC clear होने के बाद ही supplier को firm order दो। Rate, packing, ready date और quality spec लिखित में lock करो।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/po-lc">
              <Button variant="secondary">Back to LC review</Button>
            </Link>
            <Button
              disabled={!canConfirm}
              onClick={() => {
                if (v.rateInrPerKg != null) {
                  updateCost('vendor', {
                    quotedInr: Math.round(v.rateInrPerKg * deal.quantityKg),
                  })
                }
                confirmVendor()
                setStage('production')
              }}
            >
              Confirm vendor order
            </Button>
          </div>
        }
      />

      {blocked ? (
        <Card className="mb-6 border-rose-200 bg-rose-50 p-5 text-sm text-rose-900">
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4" />
            <div>
              Vendor confirmation <strong>locked</strong> until LC checklist is fully matched (Rule no.
              5). पहले <Link className="underline" to="/po-lc">PO / LC Review</Link> पूरा करो।
            </div>
          </div>
        </Card>
      ) : (
        <Card className="mb-6 border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          LC cleared for production. अब Guntur supplier से quantity, rate, packing और ready-by date
          confirm करो।
        </Card>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <Badge tone={v.confirmed ? 'green' : 'amber'}>
          {v.confirmed ? 'Vendor order confirmed' : 'Awaiting vendor confirmation'}
        </Badge>
        <Badge tone="blue">
          Working purchase:{' '}
          {v.rateInrPerKg != null ? `${inr(v.rateInrPerKg)}/kg · ${inr(v.rateInrPerKg * deal.quantityKg)}` : '—'}
        </Badge>
      </div>

      <Card className="grid gap-4 p-5 sm:grid-cols-2">
        <Field label="Supplier name">
          <Input
            disabled={blocked}
            value={v.supplierName}
            onChange={(e) => updateVendor({ supplierName: e.target.value })}
          />
        </Field>
        <Field label="Location">
          <Input
            disabled={blocked}
            value={v.supplierLocation}
            onChange={(e) => updateVendor({ supplierLocation: e.target.value })}
          />
        </Field>
        <Field label="Contact person">
          <Input
            disabled={blocked}
            value={v.contactPerson}
            onChange={(e) => updateVendor({ contactPerson: e.target.value })}
          />
        </Field>
        <Field label="Confirmation ref (WhatsApp/email/PO #)">
          <Input
            disabled={blocked}
            value={v.confirmationRef}
            onChange={(e) => updateVendor({ confirmationRef: e.target.value })}
            placeholder="e.g. WA 12-Apr / PO-GNT-01"
          />
        </Field>
        <Field label="Product spec">
          <Input
            disabled={blocked}
            value={v.productSpec}
            onChange={(e) => updateVendor({ productSpec: e.target.value })}
          />
        </Field>
        <Field label="Quantity (kg)">
          <Input
            type="number"
            disabled={blocked}
            value={v.quantityKg}
            onChange={(e) => updateVendor({ quantityKg: Number(e.target.value) })}
          />
        </Field>
        <Field label="Vendor rate ₹/kg">
          <Input
            type="number"
            disabled={blocked}
            value={v.rateInrPerKg ?? ''}
            onChange={(e) =>
              updateVendor({
                rateInrPerKg: e.target.value === '' ? null : Number(e.target.value),
              })
            }
          />
        </Field>
        <Field label="Ready by date">
          <Input
            type="date"
            disabled={blocked}
            value={v.readyByDate}
            onChange={(e) => updateVendor({ readyByDate: e.target.value })}
          />
        </Field>
        <Field label="Packing">
          <Input
            disabled={blocked}
            value={v.packing}
            onChange={(e) => updateVendor({ packing: e.target.value })}
          />
        </Field>
        <Field label="Delivery location">
          <Input
            disabled={blocked}
            value={v.deliveryLocation}
            onChange={(e) => updateVendor({ deliveryLocation: e.target.value })}
          />
        </Field>
        <Field label="Payment terms to vendor">
          <Input
            disabled={blocked}
            value={v.paymentTermsToVendor}
            onChange={(e) => updateVendor({ paymentTermsToVendor: e.target.value })}
          />
        </Field>
        <div className="sm:col-span-2">
          <Field label="Quality / sample notes">
            <Textarea
              rows={3}
              disabled={blocked}
              value={v.qualityNotes}
              onChange={(e) => updateVendor({ qualityNotes: e.target.value })}
            />
          </Field>
        </div>
      </Card>

      <Card className="mt-6 p-5 text-sm leading-7 text-slate-600">
        Confirm होने पर vendor rate cost sheet की <strong>Quoted ₹</strong> line में copy हो जाएगी
        (Rule no. 2). अगला stage:{' '}
        <Link className="font-medium text-teal-700 hover:underline" to="/production">
          Production
        </Link>
        .
      </Card>
    </div>
  )
}
