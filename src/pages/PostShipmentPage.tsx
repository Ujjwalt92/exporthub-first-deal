import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { DISCREPANCY_PLAYBOOK } from '../data/teaching'
import { Button, Card, Field, PageHeader, Select, Textarea } from '../components/ui'

export function PostShipmentPage() {
  const { deal, updateIncentive } = useStore()

  return (
    <div>
      <PageHeader
        title="Post-shipment & incentives"
        subtitle="Payment के बाद भी deal खत्म नहीं — discrepancy handling, FIRC/e-BRC, और RoDTEP/drawback जैसी चीज़ें existing traders track करते हैं।"
        actions={
          <div className="flex flex-wrap gap-2">
            <Link to="/payment">
              <Button variant="secondary">Payment</Button>
            </Link>
            <Link to="/cost-sheet">
              <Button variant="secondary">Update actual costs</Button>
            </Link>
          </div>
        }
      />

      <Card className="mb-6 p-5">
        <div className="mb-2 text-sm font-semibold">Discrepancy playbook</div>
        <pre className="whitespace-pre-wrap rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
          {DISCREPANCY_PLAYBOOK}
        </pre>
      </Card>

      <div className="grid gap-4">
        {deal.teaching.incentives.map((item) => (
          <Card key={item.id} className="grid gap-3 p-5 md:grid-cols-12">
            <div className="md:col-span-4">
              <div className="text-sm font-semibold">{item.name}</div>
            </div>
            <div className="md:col-span-3">
              <Field label="Status">
                <Select
                  value={item.status}
                  onChange={(e) =>
                    updateIncentive(item.id, {
                      status: e.target.value as typeof item.status,
                    })
                  }
                >
                  <option value="not_applicable">Not applicable</option>
                  <option value="to_check">To check</option>
                  <option value="applied">Applied</option>
                  <option value="received">Received</option>
                </Select>
              </Field>
            </div>
            <div className="md:col-span-5">
              <Field label="Note">
                <Textarea
                  rows={2}
                  value={item.note}
                  onChange={(e) => updateIncentive(item.id, { note: e.target.value })}
                />
              </Field>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 border-teal-100 bg-teal-50 p-5 text-sm leading-7 text-teal-950">
        Closing habit of experienced exporters: cost sheet में हर line का <strong>Actual Paid</strong>{' '}
        भरकर real margin निकालो। अगली UAE enquiry पर तुम्हारा quote तेज़ और सुरक्षित होगा।
      </Card>
    </div>
  )
}
