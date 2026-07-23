import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Plus, Trash2 } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { formatMoney, shipmentTotals } from '../lib/store'
import type { Currency, Incoterm, Shipment, ShipmentLine, ShipmentStatus } from '../types'
import { statusOptions, StatusBadge } from '../components/StatusBadge'
import {
  Button,
  Card,
  Field,
  Input,
  PageHeader,
  Select,
  Textarea,
} from '../components/ui'

const incoterms: Incoterm[] = ['EXW', 'FCA', 'FOB', 'CFR', 'CIF', 'CPT', 'CIP', 'DAP', 'DDP']
const currencies: Currency[] = ['USD', 'EUR', 'GBP', 'INR', 'AED']

function blankLine(): ShipmentLine {
  return {
    productId: '',
    quantity: 1,
    unitPrice: 0,
    packages: 1,
    netWeightKg: 0,
    grossWeightKg: 0,
    cbm: 0,
  }
}

function blankShipment(buyerId = '', currency: Currency = 'USD'): Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'> {
  const today = new Date().toISOString().slice(0, 10)
  const stamp = Date.now().toString().slice(-4)
  return {
    reference: `EXP-${new Date().getFullYear()}-${stamp}`,
    buyerId,
    status: 'draft',
    currency,
    incoterm: 'FOB',
    originPort: 'Nhava Sheva, INNSA',
    destinationPort: '',
    vesselOrFlight: '',
    etd: '',
    eta: '',
    invoiceNumber: `CI-${new Date().getFullYear()}-${stamp}`,
    invoiceDate: today,
    packingListNumber: `PL-${new Date().getFullYear()}-${stamp}`,
    lines: [blankLine()],
    notes: '',
  }
}

export function ShipmentFormPage() {
  const { id } = useParams()
  const isNew = !id || id === 'new'
  const navigate = useNavigate()
  const { data, addShipment, updateShipment, deleteShipment } = useStore()

  const existing = useMemo(
    () => (isNew ? null : data.shipments.find((s) => s.id === id) ?? null),
    [data.shipments, id, isNew],
  )

  const [form, setForm] = useState(() => {
    if (existing) {
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = existing
      return rest
    }
    const firstBuyer = data.buyers[0]
    return blankShipment(firstBuyer?.id ?? '', firstBuyer?.currency ?? 'USD')
  })

  useEffect(() => {
    if (existing) {
      const { id: _id, createdAt: _c, updatedAt: _u, ...rest } = existing
      setForm(rest)
    }
  }, [existing])

  if (!isNew && !existing) {
    return (
      <div>
        <PageHeader title="Shipment not found" />
        <Link to="/shipments" className="text-sm font-medium text-teal-700 hover:underline">
          Back to shipments
        </Link>
      </div>
    )
  }

  function updateLine(index: number, patch: Partial<ShipmentLine>) {
    setForm((prev) => ({
      ...prev,
      lines: prev.lines.map((line, i) => (i === index ? { ...line, ...patch } : line)),
    }))
  }

  function onProductChange(index: number, productId: string) {
    const product = data.products.find((p) => p.id === productId)
    if (!product) {
      updateLine(index, { productId })
      return
    }
    updateLine(index, {
      productId,
      unitPrice: product.unitPrice,
      netWeightKg: product.netWeightKg,
      grossWeightKg: product.grossWeightKg,
      cbm: product.cbm,
    })
  }

  function save() {
    if (!form.buyerId || !form.reference.trim()) return
    const cleanLines = form.lines.filter((l) => l.productId && l.quantity > 0)
    if (cleanLines.length === 0) {
      alert('Add at least one product line')
      return
    }
    const payload = { ...form, lines: cleanLines }
    if (isNew) {
      addShipment(payload)
      navigate('/shipments')
    } else if (existing) {
      updateShipment({ ...existing, ...payload })
      navigate(`/shipments/${existing.id}`)
    }
  }

  const totals = shipmentTotals({
    ...(existing ?? {
      id: 'temp',
      createdAt: '',
      updatedAt: '',
    }),
    ...form,
  })

  return (
    <div>
      <PageHeader
        title={isNew ? 'New shipment' : `Edit ${form.reference}`}
        subtitle="Enter once — reuse for commercial invoice and packing list"
        actions={
          <div className="flex gap-2">
            {!isNew && existing ? (
              <Button
                variant="danger"
                onClick={() => {
                  if (confirm('Delete this shipment?')) {
                    deleteShipment(existing.id)
                    navigate('/shipments')
                  }
                }}
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            ) : null}
            <Button variant="secondary" onClick={() => navigate(-1)}>
              Cancel
            </Button>
            <Button onClick={save}>Save shipment</Button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="space-y-4 p-5 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Reference">
              <Input value={form.reference} onChange={(e) => setForm({ ...form, reference: e.target.value })} />
            </Field>
            <Field label="Status">
              <Select
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as ShipmentStatus })}
              >
                {statusOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Buyer">
              <Select
                value={form.buyerId}
                onChange={(e) => {
                  const buyer = data.buyers.find((b) => b.id === e.target.value)
                  setForm({
                    ...form,
                    buyerId: e.target.value,
                    currency: buyer?.currency ?? form.currency,
                  })
                }}
              >
                <option value="">Select buyer</option>
                {data.buyers.map((buyer) => (
                  <option key={buyer.id} value={buyer.id}>
                    {buyer.company}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Incoterm">
              <Select
                value={form.incoterm}
                onChange={(e) => setForm({ ...form, incoterm: e.target.value as Incoterm })}
              >
                {incoterms.map((term) => (
                  <option key={term} value={term}>
                    {term}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Currency">
              <Select
                value={form.currency}
                onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}
              >
                {currencies.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Invoice number">
              <Input
                value={form.invoiceNumber}
                onChange={(e) => setForm({ ...form, invoiceNumber: e.target.value })}
              />
            </Field>
            <Field label="Invoice date">
              <Input
                type="date"
                value={form.invoiceDate}
                onChange={(e) => setForm({ ...form, invoiceDate: e.target.value })}
              />
            </Field>
            <Field label="Packing list number">
              <Input
                value={form.packingListNumber}
                onChange={(e) => setForm({ ...form, packingListNumber: e.target.value })}
              />
            </Field>
            <Field label="Origin port">
              <Input value={form.originPort} onChange={(e) => setForm({ ...form, originPort: e.target.value })} />
            </Field>
            <Field label="Destination port">
              <Input
                value={form.destinationPort}
                onChange={(e) => setForm({ ...form, destinationPort: e.target.value })}
              />
            </Field>
            <Field label="Vessel / flight">
              <Input
                value={form.vesselOrFlight ?? ''}
                onChange={(e) => setForm({ ...form, vesselOrFlight: e.target.value })}
              />
            </Field>
            <Field label="ETD">
              <Input type="date" value={form.etd ?? ''} onChange={(e) => setForm({ ...form, etd: e.target.value })} />
            </Field>
            <Field label="ETA">
              <Input type="date" value={form.eta ?? ''} onChange={(e) => setForm({ ...form, eta: e.target.value })} />
            </Field>
            <div className="sm:col-span-2">
              <Field label="Notes / marks & numbers">
                <Textarea
                  rows={3}
                  value={form.notes ?? ''}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                />
              </Field>
            </div>
          </div>
        </Card>

        <Card className="h-fit p-5">
          <div className="text-sm font-semibold text-slate-900">Shipment totals</div>
          <div className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">Amount</span>
              <span className="font-semibold">{formatMoney(totals.amount, form.currency)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Packages</span>
              <span>{totals.packages}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Net weight</span>
              <span>{totals.netWeightKg.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Gross weight</span>
              <span>{totals.grossWeightKg.toFixed(2)} kg</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Volume</span>
              <span>{totals.cbm.toFixed(2)} CBM</span>
            </div>
            {!isNew ? (
              <div className="pt-2">
                <StatusBadge status={form.status} />
              </div>
            ) : null}
          </div>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">Line items</div>
          <Button
            variant="secondary"
            onClick={() => setForm((prev) => ({ ...prev, lines: [...prev.lines, blankLine()] }))}
          >
            <Plus className="h-4 w-4" />
            Add line
          </Button>
        </div>
        <div className="space-y-4 p-5">
          {form.lines.map((line, index) => (
            <div key={index} className="grid gap-3 rounded-xl border border-slate-200 p-4 lg:grid-cols-8">
              <div className="lg:col-span-2">
                <Field label="Product">
                  <Select value={line.productId} onChange={(e) => onProductChange(index, e.target.value)}>
                    <option value="">Select product</option>
                    {data.products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.sku} — {product.name}
                      </option>
                    ))}
                  </Select>
                </Field>
              </div>
              <Field label="Qty">
                <Input
                  type="number"
                  value={line.quantity}
                  onChange={(e) => updateLine(index, { quantity: Number(e.target.value) })}
                />
              </Field>
              <Field label="Unit price">
                <Input
                  type="number"
                  value={line.unitPrice}
                  onChange={(e) => updateLine(index, { unitPrice: Number(e.target.value) })}
                />
              </Field>
              <Field label="Packages">
                <Input
                  type="number"
                  value={line.packages}
                  onChange={(e) => updateLine(index, { packages: Number(e.target.value) })}
                />
              </Field>
              <Field label="Net kg">
                <Input
                  type="number"
                  value={line.netWeightKg}
                  onChange={(e) => updateLine(index, { netWeightKg: Number(e.target.value) })}
                />
              </Field>
              <Field label="Gross kg">
                <Input
                  type="number"
                  value={line.grossWeightKg}
                  onChange={(e) => updateLine(index, { grossWeightKg: Number(e.target.value) })}
                />
              </Field>
              <div className="flex items-end gap-2">
                <div className="flex-1">
                  <Field label="CBM">
                    <Input
                      type="number"
                      value={line.cbm}
                      onChange={(e) => updateLine(index, { cbm: Number(e.target.value) })}
                    />
                  </Field>
                </div>
                <Button
                  variant="ghost"
                  className="mb-0.5 text-rose-600"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      lines: prev.lines.filter((_, i) => i !== index),
                    }))
                  }
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
