import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Download, RotateCcw, Upload } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { useToast } from '../components/Toast'
import { Button, Card, PageHeader } from '../components/ui'

export function SettingsPage() {
  const { exportDealJson, importDealJson, resetDeal, deal } = useStore()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Settings & backup"
        subtitle="Export your deal JSON, restore a backup, or reset the demo shipment. Data stays on this device."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">Deal backup</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Download a JSON file you can keep in Drive/WhatsApp Documents. Import later on this phone or another
            browser.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              onClick={() => {
                const blob = new Blob([exportDealJson()], { type: 'application/json' })
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url
                a.download = `exporthub-backup-${new Date().toISOString().slice(0, 10)}.json`
                a.click()
                URL.revokeObjectURL(url)
                toast.success('Backup downloaded')
              }}
            >
              <Download className="h-4 w-4" />
              Export JSON
            </Button>
            <Button variant="secondary" onClick={() => fileRef.current?.click()}>
              <Upload className="h-4 w-4" />
              Import JSON
            </Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={async (e) => {
                const file = e.target.files?.[0]
                if (!file) return
                const text = await file.text()
                const result = importDealJson(text)
                if (result.ok) toast.success('Backup imported')
                else toast.error(result.error)
                e.target.value = ''
              }}
            />
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">Demo reset</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Clears local progress and restores the Teja S17 playbook defaults. Use before a sales demo.
          </p>
          <Button
            className="mt-4"
            variant="danger"
            onClick={() => {
              if (!confirm('Reset the demo deal on this device?')) return
              resetDeal()
              toast.info('Demo deal reset')
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset demo deal
          </Button>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-slate-900">Product links</div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200" to="/">
              Marketing site
            </Link>
            <Link className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200" to="/pricing">
              Pricing & sell script
            </Link>
            <Link className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200" to="/report">
              Completion report
            </Link>
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            Active company: <span className="font-medium text-slate-800">{deal.company.legalName || deal.companyName}</span>
            {' · '}
            Storage key <code className="rounded bg-white px-1">exporthub-first-deal-v5</code>
          </div>
        </Card>
      </div>
    </div>
  )
}
