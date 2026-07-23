import { Link, useParams } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { formatMoney, shipmentTotals } from '../lib/store'
import { Button, Card } from '../components/ui'

export function InvoiceDocumentPage() {
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
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              Commercial Invoice
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{company.name}</div>
            <div className="mt-2 whitespace-pre-line text-sm text-slate-600">
              {company.address}
              {'\n'}
              {company.city}, {company.state} {company.postalCode}
              {'\n'}
              {company.country}
              {'\n'}
              {company.email} · {company.phone}
              {'\n'}
              GSTIN {company.gstin} · IEC {company.iec}
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold text-slate-900">{shipment.invoiceNumber}</div>
            <div className="text-slate-500">Date: {shipment.invoiceDate}</div>
            <div className="mt-2 text-slate-500">Ref: {shipment.reference}</div>
            <div className="text-slate-500">Incoterm: {shipment.incoterm}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bill to / Consignee</div>
            <div className="mt-2 text-sm font-semibold text-slate-900">{buyer.company}</div>
            <div className="text-sm text-slate-600">
              Attn: {buyer.name}
              <br />
              {buyer.address}
              <br />
              {buyer.city}, {buyer.postalCode}
              <br />
              {buyer.country}
              <br />
              {buyer.email}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Shipment</div>
            <div className="mt-2 space-y-1 text-sm text-slate-600">
              <div>From: {shipment.originPort}</div>
              <div>To: {shipment.destinationPort}</div>
              <div>Vessel/Flight: {shipment.vesselOrFlight || '—'}</div>
              <div>
                ETD: {shipment.etd || '—'} · ETA: {shipment.eta || '—'}
              </div>
              <div>Currency: {shipment.currency}</div>
            </div>
          </div>
        </div>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2 font-medium">#</th>
              <th className="px-3 py-2 font-medium">Description</th>
              <th className="px-3 py-2 font-medium">HS code</th>
              <th className="px-3 py-2 font-medium">Qty</th>
              <th className="px-3 py-2 font-medium">Unit price</th>
              <th className="px-3 py-2 font-medium text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {shipment.lines.map((line, index) => {
              const product = data.products.find((p) => p.id === line.productId)
              return (
                <tr key={index} className="border-b border-slate-100 align-top">
                  <td className="px-3 py-3 text-slate-500">{index + 1}</td>
                  <td className="px-3 py-3">
                    <div className="font-medium text-slate-900">{product?.name}</div>
                    <div className="text-xs text-slate-500">
                      {product?.sku} · {product?.description}
                    </div>
                  </td>
                  <td className="px-3 py-3 text-slate-600">{product?.hsCode}</td>
                  <td className="px-3 py-3">
                    {line.quantity} {product?.unit}
                  </td>
                  <td className="px-3 py-3">{formatMoney(line.unitPrice, shipment.currency)}</td>
                  <td className="px-3 py-3 text-right font-medium">
                    {formatMoney(line.quantity * line.unitPrice, shipment.currency)}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>

        <div className="mt-6 flex justify-end">
          <div className="w-full max-w-xs space-y-2 text-sm">
            <div className="flex justify-between border-t border-slate-200 pt-3 text-base font-semibold">
              <span>Total</span>
              <span>{formatMoney(totals.amount, shipment.currency)}</span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2">
          <div className="text-sm text-slate-600">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bank details</div>
            <div className="mt-2">
              {company.bankName}
              <br />
              A/C {company.bankAccount}
              <br />
              IFSC {company.bankIfsc}
              <br />
              SWIFT {company.bankSwift}
            </div>
          </div>
          <div className="text-sm text-slate-600">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Notes</div>
            <div className="mt-2">{shipment.notes || 'Goods are of Indian origin.'}</div>
            <div className="mt-8 text-right">
              <div className="text-xs text-slate-500">For {company.name}</div>
              <div className="mt-10 text-sm font-medium text-slate-800">Authorized Signatory</div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
