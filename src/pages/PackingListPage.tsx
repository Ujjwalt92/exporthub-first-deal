import { Link } from 'react-router-dom'
import { Printer } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { Button, Card } from '../components/ui'

export function PackingListPage() {
  const { deal } = useStore()
  const d = deal.dispatch
  const p = deal.production
  const net = p.netWeightKg || deal.quantityKg
  const gross = p.grossWeightKg || Math.round(deal.quantityKg * 1.02)
  const bags = p.packedBags || deal.totalBags

  return (
    <div className="mx-auto max-w-4xl">
      <div className="no-print mb-4 flex flex-wrap items-center justify-between gap-3">
        <Link to="/dispatch" className="text-sm font-medium text-teal-700 hover:underline">
          ← Back to dispatch
        </Link>
        <Button onClick={() => window.print()}>
          <Printer className="h-4 w-4" />
          Print / PDF
        </Button>
      </div>

      <Card className="print-sheet p-8">
        <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">Packing List</div>
            <div className="mt-2 text-2xl font-semibold">{deal.company.legalName || deal.companyName}</div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold">{d.plNumber || 'PL-pending'}</div>
            <div className="text-slate-500">Linked CI: {d.ciNumber || '—'}</div>
            <div className="text-slate-500">Date: {d.ciDate || '—'}</div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Consignee</div>
            <div className="mt-2 font-semibold">{deal.buyerName}</div>
            <div className="text-slate-600">{deal.buyerCountry}</div>
          </div>
          <div className="text-slate-600">
            <div>From: {deal.portOfLoading}</div>
            <div>To: {deal.portOfDischarge}</div>
            <div>Container: {d.containerNumber || '—'}</div>
            <div>Seal: {d.sealNumber || '—'}</div>
          </div>
        </div>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">Packages</th>
              <th className="px-3 py-2">Net kg</th>
              <th className="px-3 py-2">Gross kg</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100">
              <td className="px-3 py-4">
                <div className="font-medium">{deal.productName}</div>
                <div className="text-xs text-slate-500">
                  HSN {deal.hsnCode} · {deal.packing}
                </div>
              </td>
              <td className="px-3 py-4">{bags} bags</td>
              <td className="px-3 py-4">{net.toLocaleString('en-IN')}</td>
              <td className="px-3 py-4">{gross.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
          <tfoot>
            <tr className="font-semibold">
              <td className="px-3 py-3">Totals</td>
              <td className="px-3 py-3">{bags}</td>
              <td className="px-3 py-3">{net.toLocaleString('en-IN')}</td>
              <td className="px-3 py-3">{gross.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>

        <div className="mt-8 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">
          <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Marks & numbers</div>
          <div className="mt-2">{d.marksAndNumbers}</div>
        </div>
      </Card>
    </div>
  )
}
