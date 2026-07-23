import { useMemo, useState } from 'react'
import { useStore } from '../lib/StoreContext'
import { Card, Input, PageHeader } from '../components/ui'

export function HelpPage() {
  const { deal } = useStore()
  const [q, setQ] = useState('')
  const terms = useMemo(() => {
    const needle = q.trim().toLowerCase()
    return deal.glossary.filter(
      (g) =>
        !needle ||
        g.term.toLowerCase().includes(needle) ||
        g.meaning.toLowerCase().includes(needle),
    )
  }, [deal.glossary, q])

  return (
    <div>
      <PageHeader
        title="Trader help & glossary"
        subtitle="IEC, PI, LC, Phyto, B/L, FIRC — short meanings + practical tips. New traders यहीं से vocabulary सीखें।"
      />

      <div className="mb-4 max-w-md">
        <Input placeholder="Search terms…" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>

      <Card className="mb-6 p-5 text-sm leading-7 text-slate-600">
        <div className="font-semibold text-slate-900">How to use this app (both new & existing traders)</div>
        <ol className="mt-2 list-decimal space-y-1 pl-5">
          <li>Company setup भरें (IEC/bank exact names).</li>
          <li>Buyer clarify → cost sheet → lock FOB → send PI.</li>
          <li>PO/LC review (Rule 5) → vendor confirm → production.</li>
          <li>Dispatch docs (CI/PL) → customs/LEO → vessel/B/L → bank payment.</li>
          <li>हर खर्च Estimated / Quoted / Actual में update रखें。</li>
        </ol>
      </Card>

      <div className="grid gap-4 md:grid-cols-2">
        {terms.map((g) => (
          <Card key={g.id} className="p-5">
            <div className="text-base font-semibold text-slate-900">{g.term}</div>
            <p className="mt-2 text-sm leading-6 text-slate-600">{g.meaning}</p>
            <p className="mt-3 rounded-lg bg-teal-50 px-3 py-2 text-xs leading-5 text-teal-900">
              Tip: {g.tip}
            </p>
          </Card>
        ))}
      </div>
    </div>
  )
}
