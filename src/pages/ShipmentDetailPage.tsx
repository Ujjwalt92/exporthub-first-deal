import { Link, useParams } from 'react-router-dom'
import { FileText, Pencil } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { formatMoney, shipmentTotals } from '../lib/store'
import { StatusBadge } from '../components/StatusBadge'
import { Button, Card, PageHeader } from '../components/ui'

export function ShipmentDetailPage() {
  const { id } = useParams()
  const { data } = useStore()
  const shipment = data.shipments.find((s) => s.id === id)
  const buyer = data.buyers.find((b) => b.id === shipment?.buyerId)

  if (!shipment) {
    return (
      <div>
        <PageHeader title="Shipment not found" />
        <Link to="/shipments" className="text-sm font-medium text-teal-700 hover:underline">
          Back to shipments
        </Link>
      </div>
    )
  }

  const totals = shipmentTotals(shipment)

  return (
    <div>
      <PageHeader
        title={shipment.reference}
        subtitle={`${buyer?.company ?? 'Unknown buyer'} · ${shipment.incoterm}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to={`/documents/${shipment.id}/invoice`}>
              <Button variant="secondary">
                <FileText className="h-4 w-4" />
                Invoice
              </Button>
            </Link>
            <Link to={`/documents/${shipment.id}/packing-list`}>
              <Button variant="secondary">
                <FileText className="h-4 w-4" />
                Packing list
              </Button>
            </Link>
            <Link to={`/shipments/${shipment.id}/edit`}>
              <Button>
                <Pencil className="h-4 w-4" />
                Edit
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-900">Shipment details</div>
            <StatusBadge status={shipment.status} />
          </div>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 text-sm">
            <Info label="Invoice" value={`${shipment.invoiceNumber} · ${shipment.invoiceDate}`} />
            <Info label="Packing list" value={shipment.packingListNumber} />
            <Info label="Origin" value={shipment.originPort} />
            <Info label="Destination" value={shipment.destinationPort} />
            <Info label="Vessel / flight" value={shipment.vesselOrFlight || '—'} />
            <Info label="ETD / ETA" value={`${shipment.etd || '—'} / ${shipment.eta || '—'}`} />
            <Info label="Buyer contact" value={buyer ? `${buyer.name} · ${buyer.email}` : '—'} />
            <Info label="Currency" value={shipment.currency} />
          </div>
          {shipment.notes ? (
            <div className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-600">
              <div className="text-xs font-medium uppercase tracking-wide text-slate-500">Notes</div>
              <div className="mt-1">{shipment.notes}</div>
            </div>
          ) : null}
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">Totals</div>
          <div className="mt-4 space-y-3 text-sm">
            <Row label="Amount" value={formatMoney(totals.amount, shipment.currency)} strong />
            <Row label="Packages" value={String(totals.packages)} />
            <Row label="Net weight" value={`${totals.netWeightKg.toFixed(2)} kg`} />
            <Row label="Gross weight" value={`${totals.grossWeightKg.toFixed(2)} kg`} />
            <Row label="Volume" value={`${totals.cbm.toFixed(2)} CBM`} />
          </div>
        </Card>
      </div>

      <Card className="mt-6 overflow-hidden">
        <div className="border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-900">
          Line items
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 font-medium">Product</th>
                <th className="px-4 py-3 font-medium">HS</th>
                <th className="px-4 py-3 font-medium">Qty</th>
                <th className="px-4 py-3 font-medium">Unit price</th>
                <th className="px-4 py-3 font-medium">Amount</th>
                <th className="px-4 py-3 font-medium">Pkgs</th>
                <th className="px-4 py-3 font-medium">Weights</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {shipment.lines.map((line, idx) => {
                const product = data.products.find((p) => p.id === line.productId)
                return (
                  <tr key={idx}>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{product?.name ?? 'Unknown'}</div>
                      <div className="text-xs text-slate-500">{product?.sku}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{product?.hsCode ?? '—'}</td>
                    <td className="px-4 py-3">{line.quantity}</td>
                    <td className="px-4 py-3">{formatMoney(line.unitPrice, shipment.currency)}</td>
                    <td className="px-4 py-3 font-medium">
                      {formatMoney(line.quantity * line.unitPrice, shipment.currency)}
                    </td>
                    <td className="px-4 py-3">{line.packages}</td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      NW {line.netWeightKg} · GW {line.grossWeightKg} · {line.cbm} CBM
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-slate-800">{value}</div>
    </div>
  )
}

function Row({ label, value, strong }: { label: string; value: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-slate-500">{label}</span>
      <span className={strong ? 'font-semibold text-slate-900' : 'text-slate-800'}>{value}</span>
    </div>
  )
}
