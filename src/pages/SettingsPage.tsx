import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { Cloud, Download, HardDrive, RotateCcw, Upload } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { useAuth } from '../lib/AuthContext'
import { getApiBase, setApiBase } from '../lib/api'
import { useToast } from '../components/Toast'
import { Badge, Button, Card, Field, Input, PageHeader } from '../components/ui'

export function SettingsPage() {
  const { exportDealJson, importDealJson, resetDeal, deal, syncState } = useStore()
  const { mode, switchMode, workspace, user } = useAuth()
  const toast = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [apiUrl, setApiUrl] = useState(getApiBase())

  return (
    <div>
      <PageHeader
        eyebrow="Workspace"
        title="Settings & backup"
        subtitle="Cloud sync, plan, JSON export, and demo reset for the active deal."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-slate-900">Cloud API endpoint</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Point the app at your deployed ExportHub API (Render/Belmo/Fly). Leave empty to use the built-in local
            SaaS vault on this device.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <Field label="API base URL">
              <Input
                placeholder="https://exporthub-api.onrender.com"
                value={apiUrl}
                onChange={(e) => setApiUrl(e.target.value)}
              />
            </Field>
            <div className="flex items-end">
              <Button
                onClick={async () => {
                  setApiBase(apiUrl || null)
                  await switchMode(apiUrl.trim() ? 'cloud' : 'local')
                  toast.success(apiUrl.trim() ? 'API saved — sign in again' : 'Using local vault — sign in again')
                }}
              >
                Save API URL
              </Button>
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between gap-2">
            <div className="text-sm font-semibold text-slate-900">SaaS sync</div>
            <Badge tone={mode === 'cloud' ? 'teal' : 'amber'}>{mode}</Badge>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Signed in as <span className="font-medium text-slate-800">{user?.email}</span> · workspace{' '}
            <span className="font-medium text-slate-800">{workspace?.name}</span> · plan{' '}
            <span className="font-medium text-slate-800">{workspace?.plan}</span>
          </p>
          <p className="mt-2 text-xs text-slate-500">Deal sync status: {syncState}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant={mode === 'cloud' ? 'primary' : 'secondary'}
              onClick={async () => {
                await switchMode('cloud')
                toast.info('Switched to cloud mode — sign in again')
              }}
            >
              <Cloud className="h-4 w-4" />
              Prefer cloud API
            </Button>
            <Button
              variant={mode === 'local' ? 'primary' : 'secondary'}
              onClick={async () => {
                await switchMode('local')
                toast.info('Switched to local SaaS vault — sign in again')
              }}
            >
              <HardDrive className="h-4 w-4" />
              Prefer local vault
            </Button>
          </div>
        </Card>

        <Card className="p-5">
          <div className="text-sm font-semibold text-slate-900">Deal backup</div>
          <p className="mt-2 text-sm leading-6 text-slate-500">
            Download a JSON file of the active deal. Useful before demos or when migrating devices.
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
            Resets the active deal back to the Teja S17 playbook defaults (keeps the deal record).
          </p>
          <Button
            className="mt-4"
            variant="danger"
            onClick={() => {
              if (!confirm('Reset the active deal content?')) return
              resetDeal()
              toast.info('Deal content reset')
            }}
          >
            <RotateCcw className="h-4 w-4" />
            Reset deal content
          </Button>
        </Card>

        <Card className="p-5 lg:col-span-2">
          <div className="text-sm font-semibold text-slate-900">Product links</div>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <Link className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200" to="/app">
              Dashboard
            </Link>
            <Link className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200" to="/app/billing">
              Billing
            </Link>
            <Link className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200" to="/app/team">
              Team
            </Link>
            <Link className="rounded-lg bg-slate-100 px-3 py-2 text-slate-700 hover:bg-slate-200" to="/">
              Marketing site
            </Link>
          </div>
          <div className="mt-4 rounded-xl bg-slate-50 px-4 py-3 text-xs leading-5 text-slate-500">
            Active company in deal:{' '}
            <span className="font-medium text-slate-800">{deal.company.legalName || deal.companyName}</span>
          </div>
        </Card>
      </div>
    </div>
  )
}
