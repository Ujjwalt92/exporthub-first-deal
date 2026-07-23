import { Link } from 'react-router-dom'
import { Printer, ShieldAlert } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { computeCostSummary, usd } from '../lib/costing'
import { Badge, Button, Card, Field, Input, PageHeader } from '../components/ui'

export function ProformaPage() {
  const { deal, updateDeal } = useStore()
  const summary = computeCostSummary(deal)
  const locked = deal.unitPriceUsd != null
  const unit = deal.unitPriceUsd ?? summary.unitPriceUsd
  const total = unit * deal.quantityKg

  return (
    <div>
      <PageHeader
        title="Proforma Invoice (PI)"
        subtitle="Rule no. 4: PO/LC से पहले PI जाती है। Commercial Invoice बाद में — जब माल वास्तव में dispatch होने लगे।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/cost-sheet">
              <Button variant="secondary">Back to cost sheet</Button>
            </Link>
            <Button onClick={() => window.print()} disabled={!locked}>
              <Printer className="h-4 w-4" />
              Print / PDF
            </Button>
          </div>
        }
      />

      {!locked ? (
        <Card className="no-print mb-6 border-rose-200 bg-rose-50 p-5 text-sm text-rose-900">
          <div className="flex items-start gap-2">
            <ShieldAlert className="mt-0.5 h-4 w-4" />
            <div>
              Unit price अभी खाली है। Rule no. 1: पहले cost sheet complete करो, फिर “Lock suggested FOB
              into PI” दबाओ। बिना lock किए buyer को final PI मत भेजो।
            </div>
          </div>
        </Card>
      ) : (
        <Card className="no-print mb-6 border-emerald-200 bg-emerald-50 p-5 text-sm text-emerald-900">
          PI price locked at <strong>{usd(deal.unitPriceUsd!)}/kg FOB</strong> · Total{' '}
          <strong>{usd(total)}</strong>. Offer validity {deal.offerValidityDays} days.
        </Card>
      )}

      <Card className="no-print mb-6 grid gap-4 p-5 sm:grid-cols-3">
        <Field label="PI number">
          <Input value={deal.piNumber} onChange={(e) => updateDeal({ piNumber: e.target.value })} />
        </Field>
        <Field label="PI date">
          <Input type="date" value={deal.piDate} onChange={(e) => updateDeal({ piDate: e.target.value })} />
        </Field>
        <Field label="Buyer name (placeholder allowed)">
          <Input value={deal.buyerName} onChange={(e) => updateDeal({ buyerName: e.target.value })} />
        </Field>
      </Card>

      <Card className="print-sheet p-8">
        <div className="flex items-start justify-between gap-6 border-b border-slate-200 pb-6">
          <div>
            <div className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
              Proforma Invoice
            </div>
            <div className="mt-2 text-2xl font-semibold text-slate-900">{deal.company.legalName || deal.companyName}</div>
            <div className="mt-2 text-sm text-slate-500">Official quotation · Not a tax invoice</div>
            <div className="mt-2 text-xs text-slate-500">
              IEC {deal.company.iec} · {deal.company.email}
            </div>
          </div>
          <div className="text-right text-sm">
            <div className="font-semibold text-slate-900">{deal.piNumber}</div>
            <div className="text-slate-500">Date: {deal.piDate}</div>
            <div className="mt-2">
              <Badge tone={locked ? 'green' : 'rose'}>{locked ? 'Price locked' : 'Price pending'}</Badge>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 text-sm">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seller</div>
            <div className="mt-2 font-semibold text-slate-900">{deal.company.legalName || deal.companyName}</div>
          </div>
          <div>
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Buyer</div>
            <div className="mt-2 font-semibold text-slate-900">{deal.buyerName}</div>
          </div>
        </div>

        <table className="mt-8 w-full text-left text-sm">
          <thead>
            <tr className="border-y border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-3 py-2">Description</th>
              <th className="px-3 py-2">HSN</th>
              <th className="px-3 py-2">Qty</th>
              <th className="px-3 py-2">Packing</th>
              <th className="px-3 py-2">Unit price</th>
              <th className="px-3 py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 align-top">
              <td className="px-3 py-4">
                <div className="font-medium text-slate-900">{deal.productName}</div>
                <div className="mt-1 text-xs text-slate-500">{deal.container} container load</div>
              </td>
              <td className="px-3 py-4">{deal.hsnCode}</td>
              <td className="px-3 py-4">{deal.quantityKg.toLocaleString('en-IN')} kg</td>
              <td className="px-3 py-4">
                {deal.packing}
                <div className="text-xs text-slate-500">{deal.totalBags} bags</div>
              </td>
              <td className="px-3 py-4">
                {locked ? `${usd(unit)} / kg` : <span className="text-rose-600">TBD — cost sheet pending</span>}
              </td>
              <td className="px-3 py-4 text-right font-semibold">
                {locked ? usd(total) : '—'}
              </td>
            </tr>
          </tbody>
        </table>

        <div className="mt-8 grid gap-4 text-sm sm:grid-cols-2">
          <Info label="Incoterm" value={deal.incoterm} />
          <Info label="Payment terms" value={deal.paymentTerms} />
          <Info label="Port of loading" value={deal.portOfLoading} />
          <Info label="Port of discharge" value={deal.portOfDischarge} />
          <Info label="Shipment" value={deal.shipmentWindow} />
          <Info label="Offer validity" value={`${deal.offerValidityDays} days from PI date`} />
        </div>

        <div className="mt-8 rounded-xl bg-slate-50 p-4 text-sm leading-7 text-slate-600">
          <div className="font-semibold text-slate-800">Notes</div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>This is a Proforma Invoice / official quotation — not a commercial/tax invoice.</li>
            <li>Special tests: {deal.specialTestsNote || 'To be confirmed by buyer before LC.'}</li>
            <li>Subject to final LC terms. Do not start production before LC review (Rule no. 5).</li>
          </ul>
        </div>
      </Card>
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 px-4 py-3">
      <div className="text-xs uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 font-medium text-slate-900">{value}</div>
    </div>
  )
}
