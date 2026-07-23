import { Link } from 'react-router-dom'
import { useStore } from '../lib/StoreContext'
import { TaskChecklist } from '../components/TaskChecklist'
import { Button, Card, PageHeader } from '../components/ui'

export function ChaChecklistPage() {
  const { deal, updateChaTask } = useStore()
  const done = deal.teaching.chaChecklist.filter((t) => t.done).length

  return (
    <div>
      <PageHeader
        title="CHA / Shipping Bill packet"
        subtitle="ICEGATE-oriented practical checklist — CHA को क्या देना है, SB draft पर क्या match करना है, LEO से पहले क्या verify करना है।"
        actions={
          <Link to="/customs">
            <Button variant="secondary">Customs stage</Button>
          </Link>
        }
      />

      <Card className="mb-6 p-5 text-sm leading-7 text-slate-600">
        <strong>Trader tip:</strong> ज्यादातर SB errors तब होती हैं जब CI/PL/LC description अलग-अलग होते
        हैं। Same product wording everywhere रखो — Teja S17 Stemless Super Deluxe Red Chilli · HSN
        09042120 · 12,000 kg.
        <div className="mt-2 text-xs text-slate-500">
          Checklist progress: {done}/{deal.teaching.chaChecklist.length}
        </div>
      </Card>

      <Card className="p-5">
        <TaskChecklist
          tasks={deal.teaching.chaChecklist}
          onToggle={(id, doneFlag) => updateChaTask(id, { done: doneFlag })}
          onNote={(id, note) => updateChaTask(id, { note })}
        />
      </Card>
    </div>
  )
}
