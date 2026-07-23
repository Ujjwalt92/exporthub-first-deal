import { Link } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { usd } from '../lib/costing'
import { Button, Card } from '../components/ui'

export function CommercialInvoicePage() {
  const { deal } = useStore()
  const unit = deal.unitPriceUsd
  const total = unit ? unit * deal.quantityKg : null
  const c = deal.company
  const d = deal.dispatch

  return (
    <div className="mx-auto max-w-4xl">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/dispatch" className="text-sm font-medium text-teal-700 hover:underline">
          ← Back to dispatch
        </Link>
        <Button onClick={() => window.print()} disabled={!unit}>
          <Printer className="h-4 w-4" />
          Print / PDF
        </Button>
      </div>

      {!unit ? (
        <Card className="no-print mb-4 border-rose-200 bg-rose-50 p-4 text-sm text-rose-900">
          Lock FOB unit price in Cost Sheet / PI before issuing Commercial Invoice.
        </Card>
      ) : null}

      <Card className="print-sheet p-8">
        <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              Commercial Invoice
            </div>
            <div className="mt-2 text-2xl font-semibold">{c.legalName || deal.companyName}</div>
            <div className="mt-2 whitespace-pre-line text-sm text-slate-600">
              {c.address}
              {'\n'}
              {c.city}, {c.state} {c.postalCode}
              {'\n'}
              {c.country}
              {'\n'}
              {c.email} · {c.phone}
              {'\n'}
              IEC {c.iec} · GSTIN {c.gstin}
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold">{d.ciNumber || 'CI-pending'}</div>
            <div className="text-slate-500">Date: {d.ciDate || '—'}</div>
            <div className="mt-2 text-slate-500">Against PI {deal.piNumber}</div>
            <div className="text-slate-500">LC {deal.lcNumber || '—'}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 text-sm">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Consignee / Buyer</div>
            <div className="mt-2 font-semibold">{deal.buyerName}</div>
            <div className="text-slate-600">
              {deal.buyerCountry}
              <br />
              {deal.buyerEmail}
            </div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Shipment</div>
            <div className="mt-2 space-y-1 text-slate-600">
              <div>Incoterm: {deal.incoterm}</div>
              <div>From: {deal.portOfLoading}</div>
              <div>To: {deal.portOfDischarge}</div>
              <div>Container: {d.containerNumber || '—'}</div>
              <div>Seal: {d.sealNumber || '—'}</div>
              <div>Vessel: {deal.vessel.vesselName || '—'}</div>
            </div>
          </div>
        </div>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">HSN</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Unit price</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 align-top">
              <td className="px-3 py-4">
                <div className="font-medium">{deal.productName}</div>
                <div className="text-xs text-slate-500">
                  {deal.packing} · {deal.totalBags} bags · Marks: {d.marksAndNumbers}
                </div>
              </td>
              <td className="px-3 py-4">{deal.hsnCode}</td>
              <td className="px-3 py-4">{deal.quantityKg.toLocaleString('en-IN')} kg</td>
              <td className="px-3 py-4">{unit ? `${usd(unit)} / kg` : '—'}</td>
              <td className="px-3 py-4 text-right font-semibold">{total ? usd(total) : '—'}</td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 grid gap-6 border-t border-slate-200 pt-6 sm:grid-cols-2 text-sm">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Bank details</div>
            <div className="mt-2 text-slate-600">
              {c.bankName}
              <br />
              A/C {c.bankAccount}
              <br />
              IFSC {c.bankIfsc}
              <br />
              SWIFT {c.bankSwift}
            </div>
          </div>
          <div className="text-slate-600">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Declaration</div>
            <div className="mt-2">
              We declare that this invoice shows the actual price of the goods described and that all
              particulars are true and correct.
            </div>
            <div className="mt-10 text-right font-medium">For {c.legalName || deal.companyName}</div>
            <div className="mt-8 text-right text-xs text-slate-500">Authorized Signatory</div>
          </div>
        </div>
      </Card>
    </div>
  )
}
