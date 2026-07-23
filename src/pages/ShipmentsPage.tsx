import { Link } from 'react-router-dom'
import { Plus } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { formatMoney, shipmentTotals } from '../lib/store'
import { StatusBadge } from '../components/StatusBadge'
import { Button, Card, EmptyState, PageHeader } from '../components/ui'

export function ShipmentsPage() {
  const { data } = useStore()

  return (
    <div>
      <PageHeader
        title="Shipments"
        subtitle="Track export orders from confirmation to delivery"
        actions={
          <Link to="/shipments/new">
            <Button>
              <Plus className="h-4 w-4" />
              New shipment
            </Button>
          </Link>
        }
      />

      {data.shipments.length === 0 ? (
        <EmptyState title="No shipments" description="Create your first shipment to generate invoices and packing lists." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">Reference</th>
                  <th className="px-4 py-3 font-medium">Buyer</th>
                  <th className="px-4 py-3 font-medium">Route</th>
                  <th className="px-4 py-3 font-medium">Value</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.shipments.map((shipment) => {
                  const buyer = data.buyers.find((b) => b.id === shipment.buyerId)
                  const totals = shipmentTotals(shipment)
                  return (
                    <tr key={shipment.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-900">{shipment.reference}</div>
                        <div className="text-xs text-slate-500">
                          {shipment.invoiceNumber} · {shipment.incoterm}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{buyer?.company ?? '—'}</td>
                      <td className="px-4 py-3 text-xs text-slate-500">
                        {shipment.originPort}
                        <br />→ {shipment.destinationPort}
                      </td>
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {formatMoney(totals.amount, shipment.currency)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={shipment.status} />
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`/shipments/${shipment.id}`} className="text-sm font-medium text-teal-700 hover:underline">
                          Open
                        </Link>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  )
}
