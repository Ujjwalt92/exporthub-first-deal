import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Ship } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { formatMoney, shipmentTotals } from '../lib/store'
import { StatusBadge } from '../components/StatusBadge'
import { Button, Card, PageHeader, StatCard } from '../components/ui'

export function DashboardPage() {
  const { data } = useStore()
  const openShipments = data.shipments.filter((s) => !['delivered', 'cancelled'].includes(s.status))
  const ready = data.shipments.filter((s) => s.status === 'ready_to_ship').length
  const totalValue = data.shipments.reduce((sum, s) => sum + shipmentTotals(s).amount, 0)

  return (
    <div>
      <PageHeader
        title="Dashboard"
        subtitle="Overview of your export pipeline"
        actions={
          <Link to="/shipments">
            <Button>
              New shipment workflow
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Open shipments" value={String(openShipments.length)} hint="Active pipeline" />
        <StatCard label="Ready to ship" value={String(ready)} hint="Need docs / booking" />
        <StatCard label="Buyers" value={String(data.buyers.length)} hint="International customers" />
        <StatCard
          label="Pipeline value"
          value={formatMoney(totalValue, 'USD')}
          hint="Sum across all currencies shown in USD-style total"
        />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
              <Ship className="h-4 w-4 text-teal-700" />
              Recent shipments
            </div>
            <Link to="/shipments" className="text-sm font-medium text-teal-700 hover:underline">
              View all
            </Link>
          </div>
          <div className="divide-y divide-slate-100">
            {data.shipments.slice(0, 5).map((shipment) => {
              const buyer = data.buyers.find((b) => b.id === shipment.buyerId)
              const totals = shipmentTotals(shipment)
              return (
                <Link
                  key={shipment.id}
                  to={`/shipments/${shipment.id}`}
                  className="flex items-center justify-between gap-4 px-5 py-4 hover:bg-slate-50"
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-semibold text-slate-900">{shipment.reference}</div>
                    <div className="truncate text-xs text-slate-500">
                      {buyer?.company ?? 'Unknown buyer'} · {shipment.originPort} → {shipment.destinationPort}
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="hidden text-right sm:block">
                      <div className="text-sm font-medium text-slate-900">
                        {formatMoney(totals.amount, shipment.currency)}
                      </div>
                      <div className="text-xs text-slate-500">{shipment.incoterm}</div>
                    </div>
                    <StatusBadge status={shipment.status} />
                  </div>
                </Link>
              )
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4 text-sm font-semibold text-slate-900">
            <FileText className="h-4 w-4 text-teal-700" />
            Quick documents
          </div>
          <div className="space-y-3 p-5">
            {data.shipments.slice(0, 3).map((shipment) => (
              <div key={shipment.id} className="rounded-xl border border-slate-200 p-3">
                <div className="text-sm font-medium text-slate-900">{shipment.reference}</div>
                <div className="mt-2 flex flex-wrap gap-2">
                  <Link to={`/documents/${shipment.id}/invoice`}>
                    <Button variant="secondary" className="!px-2.5 !py-1.5 text-xs">
                      Invoice
                    </Button>
                  </Link>
                  <Link to={`/documents/${shipment.id}/packing-list`}>
                    <Button variant="secondary" className="!px-2.5 !py-1.5 text-xs">
                      Packing list
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
            <Link to="/documents" className="block text-sm font-medium text-teal-700 hover:underline">
              Open document center →
            </Link>
          </div>
        </Card>
      </div>
    </div>
  )
}
