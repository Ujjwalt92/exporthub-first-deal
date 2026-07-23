import { useState } from 'react'
import { useStore } from '../lib/StoreContext'
import type { CompanyProfile } from '../types'
import { Button, Card, Field, Input, PageHeader } from '../components/ui'

export function SettingsPage() {
  const { data, updateCompany, resetDemoData } = useStore()
  const [form, setForm] = useState<CompanyProfile>(data.company)
  const [saved, setSaved] = useState(false)

  function save() {
    updateCompany(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 1800)
  }

  return (
    <div>
      <PageHeader
        title="Company profile"
        subtitle="Used on commercial invoices, packing lists, and document headers"
        actions={
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={() => {
                if (confirm('Reset all demo data? This clears local changes.')) {
                  const next = resetDemoData()
                  setForm(next.company)
                }
              }}
            >
              Reset demo data
            </Button>
            <Button onClick={save}>{saved ? 'Saved' : 'Save profile'}</Button>
          </div>
        }
      />

      <Card className="p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="GSTIN">
            <Input value={form.gstin} onChange={(e) => setForm({ ...form, gstin: e.target.value })} />
          </Field>
          <Field label="IEC">
            <Input value={form.iec} onChange={(e) => setForm({ ...form, iec: e.target.value })} />
          </Field>
          <Field label="Address">
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <Field label="City">
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </Field>
          <Field label="State">
            <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} />
          </Field>
          <Field label="Country">
            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </Field>
          <Field label="Postal code">
            <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
          </Field>
          <Field label="Bank name">
            <Input value={form.bankName} onChange={(e) => setForm({ ...form, bankName: e.target.value })} />
          </Field>
          <Field label="Bank account">
            <Input value={form.bankAccount} onChange={(e) => setForm({ ...form, bankAccount: e.target.value })} />
          </Field>
          <Field label="IFSC">
            <Input value={form.bankIfsc} onChange={(e) => setForm({ ...form, bankIfsc: e.target.value })} />
          </Field>
          <Field label="SWIFT">
            <Input value={form.bankSwift} onChange={(e) => setForm({ ...form, bankSwift: e.target.value })} />
          </Field>
        </div>
      </Card>
    </div>
  )
}
