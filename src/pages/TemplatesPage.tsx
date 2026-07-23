import { useMemo, useState } from 'react'
import { useStore } from '../lib/StoreContext'
import { fillTemplate } from '../lib/costing'
import { Button, Card, PageHeader } from '../components/ui'

export function TemplatesPage() {
  const { deal } = useStore()
  const [activeId, setActiveId] = useState(deal.templates[0]?.id)
  const tpl = deal.templates.find((t) => t.id === activeId) ?? deal.templates[0]
  const subject = useMemo(() => (tpl ? fillTemplate(tpl.subject, deal) : ''), [tpl, deal])
  const body = useMemo(() => (tpl ? fillTemplate(tpl.body, deal) : ''), [tpl, deal])

  return (
    <div>
      <PageHeader
        title="Email / WhatsApp templates"
        subtitle="New traders के लिए ready wording — copy करके भेजो। Existing traders अपनी tone में edit करके use करें।"
      />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="h-fit p-3">
          <div className="space-y-1">
            {deal.templates.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveId(t.id)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm ${
                  t.id === tpl?.id ? 'bg-teal-50 font-medium text-teal-900' : 'hover:bg-slate-50'
                }`}
              >
                <div>{t.title}</div>
                <div className="text-xs text-slate-500">{t.whenToUse}</div>
              </button>
            ))}
          </div>
        </Card>

        {tpl ? (
          <Card className="space-y-4 p-5 lg:col-span-2">
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Subject</div>
              <div className="mt-1 rounded-lg bg-slate-50 px-3 py-2 text-sm font-medium">{subject}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-wide text-slate-500">Message</div>
              <pre className="mt-1 whitespace-pre-wrap rounded-lg bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                {body}
              </pre>
            </div>
            <Button
              onClick={async () => {
                await navigator.clipboard.writeText(`Subject: ${subject}\n\n${body}`)
                alert('Copied to clipboard')
              }}
            >
              Copy template
            </Button>
          </Card>
        ) : null}
      </div>
    </div>
  )
}
