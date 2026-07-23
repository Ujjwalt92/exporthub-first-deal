import { Link, useParams } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { shipmentTotals } from '../lib/store'
import { Button, Card } from '../components/ui'

export function PackingListDocumentPage() {
  const { id } = useParams()
  const { data } = useStore()
  const shipment = data.shipments.find((s) => s.id === id)
  const buyer = data.buyers.find((b) => b.id === shipment?.buyerId)
  const company = data.company

  if (!shipment || !buyer) {
    return (
      <div className="p-8">
        <div className="text-sm font-semibold">Document not found</div>
        <Link to="/documents" className="text-sm text-teal-700 hover:underline">
          Back
        </Link>
      </div>
    )
  }

  const totals = shipmentTotals(shipment)

  return (
    <div className="mx-auto max-w-4xl">
      <div className="no-print mb-4 flex items-center justify-between gap-3">
        <Link to="/documents" className="text-sm font-medium text-teal-700 hover:underline">
          ← Back to documents
        </Link>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print / Save PDF
        </Button>
      </div>

      <Card className="print-sheet p-8">
        <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Packing List</div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{company.name}</div>
            <div className="mt-2 text-sm text-slate-600">
              {company.address}, {company.city}, {company.country}
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold text-slate-900">{shipment.packingListNumber}</div>
            <div className="text-slate-500">Linked invoice: {shipment.invoiceNumber}</div>
            <div className="text-slate-500">Date: {shipment.invoiceDate}</div>
            <div className="mt-2 text-slate-500">Ref: {shipment.reference}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 text-sm text-slate-600">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Consignee</div>
            <div className="mt-2 font-semibold text-slate-900">{buyer.company}</div>
            <div>
              {buyer.address}
              <br />
              {buyer.city}, {buyer.country} {buyer.postalCode}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Routing</div>
            <div className="mt-2">
              From: {shipment.originPort}
              <br />
              To: {shipment.destinationPort}
              <br />
              Vessel/Flight: {shipment.vesselOrFlight || '—'}
              <br />
              Incoterm: {shipment.incoterm}
            </div>
          </div>
        </div>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium">Qty</th>
              <th className="px-3 py-2 font-medium">Packages</th>
              <th className="px-3 py-2 font-medium">Net wt (kg)</th>
              <th className="px-3 py-2 font-medium">Gross wt (kg)</th>
              <th className="px-3 py-2 font-medium">CBM</th>
            </tr>
          </thead>
          <tbody>
            {shipment.lines.map((line, index) => {
              const product = data.products.find((p) => p.id === line.productId)
              return (
                <tr key={index} className="border-b border-slate-100">
                  <td className="px-3 py-3 text-slate-500">{index + 1}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-900">{product?.name}</div>
                    <div className="text-xs text-slate-500">
                      {product?.sku} · HS {product?.hsCode}
                    </div>
                  </td>
                  <td className="px-3 py-3">
                    {line.quantity} {product?.unit}
                  </td>
                  <td className="px-3 py-3">{line.packages}</td>
                  <td className="px-3 py-3">{line.netWeightKg.toFixed(2)}</td>
                  <td className="px-3 py-3">{line.grossWeightKg.toFixed(2)}</td>
                  <td className="px-3 py-3">{line.cbm.toFixed(3)}</td>
                </tr>
              )
            })}
          </tbody>
          <tfoot>
            <tr className="border-t border-slate-300 font-semibold">
              <td className="px-3 py-3" colSpan={3}>
                Totals
              </td>
              <td className="px-3 py-3">{totals.packages}</td>
              <td className="px-3 py-3">{totals.netWeightKg.toFixed(2)}</td>
              <td className="px-3 py-3">{totals.grossWeightKg.toFixed(2)}</td>
              <td className="px-3 py-3">{totals.cbm.toFixed(3)}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-8 text-sm text-slate-600">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Marks & numbers</div>
          <div className="mt-2 rounded-xl bg-slate-50 p-4">{shipment.notes || 'As per buyer instructions'}</div>
        </div>
      </Card>
    </div>
  )
}
