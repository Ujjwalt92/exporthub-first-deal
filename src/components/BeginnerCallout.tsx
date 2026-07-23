import { Link } from 'react-router-dom'
import { BEGINNER_ACTORS } from '../data/beginner'
import { Card } from './ui'

export function BeginnerCallout({
  stageIds,
  title = 'For absolute beginners',
}: {
  stageIds: string[]
  title?: string
}) {
  const actors = BEGINNER_ACTORS.filter((a) => a.linkedStages.some((s) => stageIds.includes(s)))
  if (actors.length === 0) return null

  return (
    <Card className="no-print mb-6 border-sky-200 bg-sky-50 p-5">
      <div className="text-sm font-semibold text-sky-950">{title}</div>
      <div className="mt-3 space-y-3">
        {actors.map((actor) => (
          <div key={actor.id} className="rounded-xl bg-white/80 p-3 text-sm leading-6 text-slate-700">
            <div className="font-semibold text-slate-900">{actor.name}</div>
            <div className="mt-1">{actor.plainMeaning}</div>
            <div className="mt-2 text-xs text-slate-500">
              <strong>Where to find:</strong> {actor.whereToFind[0]}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              <strong>Ask:</strong> {actor.whatToAsk[0]}
            </div>
            <div className="mt-1 text-xs text-slate-500">
              <strong>Rough money:</strong> {actor.whatTheyChargeRoughly}
            </div>
          </div>
        ))}
      </div>
      <Link to="/beginner" className="mt-3 inline-block text-sm font-medium text-sky-800 hover:underline">
        Open full Beginner Guide (who / where / costing) →
      </Link>
    </Card>
  )
}
