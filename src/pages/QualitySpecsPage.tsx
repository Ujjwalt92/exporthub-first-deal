import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { Badge, Button, Card, Field, Input, PageHeader, Select } from '../components/ui'

export function QualitySpecsPage() {
  const { deal, updateQualitySpec } = useStore()
  const specs = deal.teaching.qualitySpecs
  const checked = specs.filter((s) => s.pass !== null).length
  const failed = specs.filter((s) => s.pass === false).length

  return (
    <div>
      <PageHeader
        title="Teja S17 quality specs"
        subtitle="Unshared remaining depth: Super Deluxe stemless के लिए practical QC sheet — moisture, stems, broken, foreign matter, ASTA, pesticide."
        actions={
          <Link to="/production">
            <Button variant="secondary">Back to production</Button>
          </Link>
        }
      />

      <Card className="mb-6 flex flex-wrap gap-2 p-4 text-sm">
        <Badge tone="blue">{checked}/{specs.length} reviewed</Badge>
        <Badge tone={failed ? 'rose' : 'green'}>
          {failed ? `${failed} failing — do not ship blind` : 'No failed marks yet'}
        </Badge>
      </Card>

      <div className="grid gap-4">
        {specs.map((spec) => (
          <Card key={spec.id} className="grid gap-3 p-5 lg:grid-cols-12">
            <div className="lg:col-span-3">
              <div className="text-sm font-semibold">{spec.parameter}</div>
              <div className="mt-1 text-xs text-slate-500">Target: {spec.target} {spec.unit}</div>
            </div>
            <div className="lg:col-span-3">
              <Field label={`Actual (${spec.unit})`}>
                <Input
                  value={spec.actual}
                  onChange={(e) => updateQualitySpec(spec.id, { actual: e.target.value })}
                  placeholder="Enter lab / QC value"
                />
              </Field>
            </div>
            <div className="lg:col-span-2">
              <Field label="Pass?">
                <Select
                  value={spec.pass === null ? '' : spec.pass ? 'yes' : 'no'}
                  onChange={(e) =>
                    updateQualitySpec(spec.id, {
                      pass: e.target.value === '' ? null : e.target.value === 'yes',
                    })
                  }
                >
                  <option value="">Unchecked</option>
                  <option value="yes">Pass</option>
                  <option value="no">Fail</option>
                </Select>
              </Field>
            </div>
            <div className="lg:col-span-4 text-xs leading-5 text-slate-500">
              <div className="font-medium text-slate-700">Why it matters</div>
              {spec.whyItMatters}
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
