import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import type { CheckStatus } from '../types'
import { Badge, Button, Card, Field, Input, PageHeader, Select, Textarea } from '../components/ui'

const statusTone: Record<CheckStatus, 'slate' | 'green' | 'rose' | 'amber'> = {
  unchecked: 'slate',
  match: 'green',
  mismatch: 'rose',
  needs_amendment: 'amber',
}

export function PoLcPage() {
  const { deal, updateDeal, updateLcCheck, markLcCleared, setStage, updateDocument } = useStore()
  const matched = deal.lcChecks.filter((c) => c.status === 'match').length
  const blocked = deal.lcChecks.some((c) => c.status === 'mismatch' || c.status === 'needs_amendment')
  const allMatch = deal.lcChecks.every((c) => c.status === 'match')
  const canClear = deal.lcReceived && allMatch && !blocked

  return (
    <div>
      <PageHeader
        title="PO / LC Review"
        subtitle="Buyer ने PI accept कर ली। असली export यहीं से शुरू होता है। Rule no. 5: LC पूरी तरह पढ़े बिना माल तैयार मत करो।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/sample-lc">
              <Button variant="secondary">Sample LC lab</Button>
            </Link>
            <Link to="/proforma">
              <Button variant="secondary">Back to PI</Button>
            </Link>
            <Button
              disabled={!canClear}
              onClick={() => {
                markLcCleared()
                setStage('vendor')
              }}
            >
              LC clear → Vendor confirmation
            </Button>
          </div>
        }
      />

      <Card className="mb-6 border-amber-200 bg-amber-50 p-5 text-sm leading-7 text-amber-950">
        <div className="flex items-start gap-2">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          <div>
            <strong>Rule no. 5:</strong> Beneficiary name, quantity, incoterm, shipment date और documents
            list चेक करो। गलती हो तो पहले <em>amendment</em> करवाओ — production/dispatch मत शुरू करो।
          </div>
        </div>
      </Card>

      <div className="mb-6 grid gap-4 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <div className="text-sm font-semibold text-slate-900">Purchase Order</div>
          <Field label="PO number">
            <Input
              value={deal.poNumber}
              onChange={(e) => updateDeal({ poNumber: e.target.value })}
              placeholder="PO-UAE-...."
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={deal.poReceived}
              onChange={(e) => {
                updateDeal({ poReceived: e.target.checked, stage: 'po_lc' })
                updateDocument('po', { status: e.target.checked ? 'received' : 'not_started' })
              }}
            />
            PO received and matches PI basics
          </label>
        </Card>

        <Card className="space-y-4 p-5">
          <div className="text-sm font-semibold text-slate-900">Letter of Credit</div>
          <Field label="LC number">
            <Input
              value={deal.lcNumber}
              onChange={(e) => updateDeal({ lcNumber: e.target.value })}
              placeholder="LC...."
            />
          </Field>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input
              type="checkbox"
              checked={deal.lcReceived}
              onChange={(e) => {
                updateDeal({ lcReceived: e.target.checked, stage: 'po_lc', lcClearedForProduction: false })
                updateDocument('lc', { status: e.target.checked ? 'in_progress' : 'not_started' })
              }}
            />
            LC received from advising bank
          </label>
          <div className="text-xs text-slate-500">
            Checklist progress: {matched}/{deal.lcChecks.length} matched
            {deal.lcClearedForProduction ? ' · Cleared for production' : ''}
          </div>
        </Card>
      </div>

      <Card className="overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-5 py-4">
          <div className="text-sm font-semibold text-slate-900">LC line-by-line checklist</div>
          <Badge tone={canClear ? 'green' : blocked ? 'rose' : 'amber'}>
            {canClear ? 'Ready to clear' : blocked ? 'Amendment needed' : 'Review in progress'}
          </Badge>
        </div>
        <div className="divide-y divide-slate-100">
          {deal.lcChecks.map((item) => (
            <div key={item.id} className="grid gap-3 p-5 lg:grid-cols-12">
              <div className="lg:col-span-3">
                <div className="text-sm font-semibold text-slate-900">{item.label}</div>
                <div className="mt-1 text-xs text-slate-500">Expected: {item.expected}</div>
              </div>
              <div className="lg:col-span-4">
                <Field label="Found in LC">
                  <Input
                    value={item.foundInLc}
                    onChange={(e) => updateLcCheck(item.id, { foundInLc: e.target.value })}
                    placeholder="Paste / type what LC says"
                  />
                </Field>
              </div>
              <div className="lg:col-span-2">
                <Field label="Status">
                  <Select
                    value={item.status}
                    onChange={(e) =>
                      updateLcCheck(item.id, { status: e.target.value as CheckStatus })
                    }
                  >
                    <option value="unchecked">Unchecked</option>
                    <option value="match">Match</option>
                    <option value="mismatch">Mismatch</option>
                    <option value="needs_amendment">Needs amendment</option>
                  </Select>
                </Field>
              </div>
              <div className="lg:col-span-3">
                <Field label="Note">
                  <Textarea
                    rows={2}
                    value={item.note}
                    onChange={(e) => updateLcCheck(item.id, { note: e.target.value })}
                    placeholder="Amendment wording / risk note"
                  />
                </Field>
                <div className="mt-2">
                  <Badge tone={statusTone[item.status]}>{item.status.replace('_', ' ')}</Badge>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
