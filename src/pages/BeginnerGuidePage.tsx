import { Link } from 'react-router-dom'
import {
  BEGINNER_ACTORS,
  BEGINNER_COST_RANGES,
  BEGINNER_JOURNEY,
  BEGINNER_MYTHS,
} from '../data/beginner'
import { Badge, Button, Card, Input, PageHeader } from '../components/ui'
import { useMemo, useState } from 'react'

export function BeginnerGuidePage() {
  const [q, setQ] = useState('')
  const [tab, setTab] = useState<'journey' | 'people' | 'costs' | 'myths'>('journey')

  const actors = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return BEGINNER_ACTORS.filter(
      (a) =>
        !needle ||
        a.name.toLowerCase().includes(needle) ||
        a.plainMeaning.toLowerCase().includes(needle) ||
        a.alsoCalled.some((x) => x.toLowerCase().includes(needle)),
    )
  }, [q])

  return (
    <div>
      <PageHeader
        title="Absolute Beginner Guide"
        subtitle="अगर export की ABCD नहीं आती — यहीं से शुरू करो। Who to meet, where to find, what they do, rough costing, and common myths."
        actions={
          <Link to="/company">
            <Button>Start Day 0: Company setup</Button>
          </Link>
        }
      />

      <Card className="mb-6 border-teal-100 bg-teal-50 p-5 text-sm leading-7 text-teal-950">
        <strong>Simple picture:</strong> Buyer abroad wants chilli → you buy from Guntur → pack → truck to
        JNPT → customs (CHA) → ship (freight forwarder) → give documents to bank → get paid under LC.
        हर कदम पर अलग specialist मिलता है। अकेले सब कुछ “जादू” से नहीं होता।
      </Card>

      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            ['journey', 'Step-by-step journey'],
            ['people', 'Who to meet'],
            ['costs', 'Rough costing'],
            ['myths', 'Myths vs truth'],
          ] as const
        ).map(([id, label]) => (
          <Button key={id} variant={tab === id ? 'primary' : 'secondary'} onClick={() => setTab(id)}>
            {label}
          </Button>
        ))}
      </div>

      {tab === 'journey' ? (
        <div className="space-y-4">
          {BEGINNER_JOURNEY.map((step) => (
            <Card key={step.id} className="p-5">
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="teal">{step.dayLabel}</Badge>
                <div className="text-base font-semibold text-slate-900">{step.title}</div>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-700">{step.forSomeoneWhoKnowsNothing}</p>
              <div className="mt-4 grid gap-3 text-sm md:grid-cols-2">
                <Info label="Who to meet" value={step.whoToMeet.join(', ')} />
                <Info label="Where" value={step.where} />
                <Info label="Walk away with" value={step.whatYouWalkAwayWith} />
                <Info label="Common mistake" value={step.commonMistake} />
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === 'people' ? (
        <div>
          <div className="mb-4 max-w-md">
            <Input
              placeholder="Search: CHA, forwarder, bank, phyto…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="space-y-4">
            {actors.map((actor) => (
              <Card key={actor.id} className="p-5">
                <div className="text-lg font-semibold text-slate-900">{actor.name}</div>
                <div className="mt-1 text-xs text-slate-500">
                  Also called: {actor.alsoCalled.join(' · ')}
                </div>
                <p className="mt-3 text-sm leading-7 text-slate-700">{actor.plainMeaning}</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <Info label="When needed" value={actor.whenYouNeedThem} />
                  <Info label="Rough charges" value={actor.whatTheyChargeRoughly} />
                </div>
                <div className="mt-4 grid gap-4 md:grid-cols-3">
                  <List title="Where / how to find" items={actor.whereToFind} />
                  <List title="What to ask in first meeting" items={actor.whatToAsk} />
                  <List title="Red flags" items={actor.redFlags} />
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : null}

      {tab === 'costs' ? (
        <div className="space-y-4">
          <Card className="p-5 text-sm leading-7 text-slate-600">
            ये <strong>indicative</strong> ranges हैं — market बदलता रहता है। App के cost sheet में अपनी
            live quotes डालो (Estimated → Quoted → Actual). Never memorize one Google number as final.
          </Card>
          {BEGINNER_COST_RANGES.map((c) => (
            <Card key={c.id} className="p-5">
              <div className="text-base font-semibold">{c.item}</div>
              <p className="mt-2 text-sm leading-7 text-slate-700">{c.beginnerPlain}</p>
              <div className="mt-3 grid gap-3 text-sm md:grid-cols-3">
                <Info label="Typical range" value={c.typicalRangeInr} />
                <Info label="Depends on" value={c.dependsOn} />
                <Info label="Who quotes it" value={c.whoQuotesIt} />
              </div>
            </Card>
          ))}
        </div>
      ) : null}

      {tab === 'myths' ? (
        <div className="space-y-4">
          {BEGINNER_MYTHS.map((m) => (
            <Card key={m.myth} className="p-5">
              <div className="text-sm font-semibold text-rose-700">Myth: {m.myth}</div>
              <div className="mt-2 text-sm leading-7 text-emerald-800">Truth: {m.truth}</div>
            </Card>
          ))}
        </div>
      ) : null}
    </div>
  )
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-slate-50 px-3 py-3">
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-1 text-slate-800">{value}</div>
    </div>
  )
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</div>
      <ul className="mt-2 list-disc space-y-1 pl-5 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
    </div>
  )
}
