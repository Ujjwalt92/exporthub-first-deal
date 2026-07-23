import { Link } from 'react-router-dom'
import { FileText } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { Button, Card, EmptyState, PageHeader } from '../components/ui'
import { StatusBadge } from '../components/StatusBadge'

export function DocumentsPage() {
  const { data } = useStore()

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="Generate commercial invoices and packing lists from shipment data"
      />

      {data.shipments.length === 0 ? (
        <EmptyState title="No documents yet" description="Create a shipment first, then generate export documents." />
      ) : (
        <div className="grid gap-4">
          {data.shipments.map((shipment) => {
            const buyer = data.buyers.find((b) => b.id === shipment.buyerId)
            return (
              <Card key={shipment.id} className="p-5">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <div className="text-sm font-semibold text-slate-900">{shipment.reference}</div>
                      <StatusBadge status={shipment.status} />
                    </div>
                    <div className="mt-1 text-sm text-slate-500">
                      {buyer?.company ?? 'Unknown buyer'} · Invoice {shipment.invoiceNumber} · Packing list{' '}
                      {shipment.packingListNumber}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Link to={`/documents/${shipment.id}/invoice`}>
                      <Button variant="secondary">
                        <FileText className="h-4 w-4" />
                        Commercial invoice
                      </Button>
                    </Link>
                    <Link to={`/documents/${shipment.id}/packing-list`}>
                      <Button variant="secondary">
                        <FileText className="h-4 w-4" />
                        Packing list
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
