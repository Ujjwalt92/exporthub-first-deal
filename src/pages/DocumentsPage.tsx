import { useStore } from '../lib/StoreContext'
import type { DocumentNode } from '../types'
import { Badge, Card, PageHeader, Select } from '../components/ui'

const sideLabel: Record<DocumentNode['side'], string> = {
  exporter_basic: 'Exporter basics',
  buyer: 'Buyer side',
  sales: 'Sales docs',
  logistics: 'Logistics',
  customs: 'Customs / PQ',
  banking: 'Banking',
}

const tone: Record<DocumentNode['status'], 'slate' | 'amber' | 'blue' | 'green' | 'rose'> = {
  not_started: 'slate',
  in_progress: 'amber',
  ready: 'green',
  received: 'blue',
  locked: 'rose',
}

export function DocumentsPage() {
  const { deal, updateDocument } = useStore()
  const groups = (Object.keys(sideLabel) as DocumentNode['side'][]).map((side) => ({
    side,
    docs: deal.documents.filter((d) => d.side === side),
  }))

  return (
    <div>
      <PageHeader
        title="Export Document Map"
        subtitle="पूरी तस्वीर पहले — बिना भारी हुए। हर document का छोटा intro; detail तब आएगी जब deal के उस stage पर पहुँचोगे।"
      />

      <Card className="mb-6 p-5 text-sm leading-7 text-slate-600">
        Flow reminder: <strong>IEC / RCMC</strong> → clarify + cost → <strong>Proforma Invoice</strong> →
        buyer <strong>PO / LC</strong> → vendor → production → packing list + commercial invoice →
        shipping bill / phyto / COO → B/L → payment.
      </Card>

      <div className="space-y-6">
        {groups.map((group) =>
          group.docs.length === 0 ? null : (
            <div key={group.side}>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-500">
                {sideLabel[group.side]}
              </h2>
              <div className="grid gap-4 lg:grid-cols-2">
                {group.docs.map((doc) => (
                  <Card key={doc.id} className="p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="text-base font-semibold text-slate-900">{doc.name}</div>
                      <Badge tone={tone[doc.status]}>{doc.status.replace('_', ' ')}</Badge>
                    </div>
                    <div className="mt-1 text-xs text-slate-500">{doc.stage}</div>
                    <p className="mt-3 text-sm leading-6 text-slate-600">{doc.shortIntro}</p>
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      <strong>When:</strong> {doc.whenNeeded}
                    </p>
                    <div className="mt-4 max-w-xs">
                      <Select
                        value={doc.status}
                        onChange={(e) =>
                          updateDocument(doc.id, {
                            status: e.target.value as DocumentNode['status'],
                          })
                        }
                      >
                        <option value="not_started">Not started</option>
                        <option value="in_progress">In progress</option>
                        <option value="ready">Ready</option>
                        <option value="received">Received</option>
                        <option value="locked">Locked (later stage)</option>
                      </Select>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ),
        )}
      </div>
    </div>
  )
}
