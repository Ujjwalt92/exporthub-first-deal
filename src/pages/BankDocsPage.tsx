import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { Badge, Button, Card, Field, Input, PageHeader, Select, Textarea } from '../components/ui'

export function BankDocsPage() {
  const { deal, updateBankDoc, updateTeaching } = useStore()
  const rows = deal.teaching.bankDocMatches
  const ready = rows.filter((r) => r.prepared && r.matchesLc === 'yes').length
  const bad = rows.filter((r) => r.matchesLc === 'no').length

  return (
    <div>
      <PageHeader
        title="Bank docs ↔ LC matcher"
        subtitle="Rule 6 teaching layer: LC में जो माँगा है वही set lodge करो। Document-by-document match करके discrepancy risk घटाओ।"
        actions={
          <Link to="/payment">
            <Button variant="secondary">Payment stage</Button>
          </Link>
        }
      />

      <Card className="mb-6 flex flex-wrap gap-2 p-4">
        <Badge tone="green">{ready} matched & prepared</Badge>
        <Badge tone={bad ? 'rose' : 'slate'}>{bad ? `${bad} mismatch` : 'No mismatch marked'}</Badge>
      </Card>

      <div className="space-y-4">
        {rows.map((row) => (
          <Card key={row.id} className="grid gap-3 p-5 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="text-sm font-semibold">{row.documentName}</div>
              <div className="mt-1 text-xs text-slate-500">{row.lcClause}</div>
            </div>
            <div className="lg:col-span-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={row.prepared}
                  onChange={(e) => updateBankDoc(row.id, { prepared: e.target.checked })}
                />
                Prepared
              </label>
            </div>
            <div className="lg:col-span-3">
              <Field label="Matches LC?">
                <Select
                  value={row.matchesLc}
                  onChange={(e) =>
                    updateBankDoc(row.id, {
                      matchesLc: e.target.value as typeof row.matchesLc,
                    })
                  }
                >
                  <option value="unchecked">Unchecked</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                </Select>
              </Field>
            </div>
            <div className="lg:col-span-4">
              <Field label="Note">
                <Input
                  value={row.note}
                  onChange={(e) => updateBankDoc(row.id, { note: e.target.value })}
                  placeholder="e.g. B/L says telex but LC asks originals"
                />
              </Field>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-5">
        <div className="mb-2 text-sm font-semibold">Discrepancy response notes</div>
        <Textarea
          rows={4}
          value={deal.teaching.discrepancyPlaybookNote}
          onChange={(e) => updateTeaching({ discrepancyPlaybookNote: e.target.value })}
          placeholder="Write what bank said / buyer waiver status / next action…"
        />
        <p className="mt-3 text-xs leading-5 text-slate-500">
          Tip: अगर mismatch है तो lodge से पहले सही करो। Lodge के बाद waiver या indemnity महंगा और
          slow पड़ता है।
        </p>
      </Card>
    </div>
  )
}
