import { useStore } from '../lib/StoreContext'
import { Badge, Card, PageHeader } from '../components/ui'

export function RulesPage() {
  const { deal } = useStore()

  return (
    <div>
      <PageHeader
        title="Playbook Rules"
        subtitle="ये rules पहली deal के दौरान बार-बार याद आएंगे। Rule 1 और Rule 2 costing को discipline देते हैं; Rule 4 और Rule 5 documents/timing को।"
      />

      <div className="grid gap-4">
        {deal.rules.map((rule) => (
          <Card key={rule.id} className="p-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone="teal">Rule no. {rule.number}</Badge>
              <div className="text-base font-semibold text-slate-900">{rule.title}</div>
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-600">{rule.body}</p>
          </Card>
        ))}
      </div>
    </div>
  )
}
