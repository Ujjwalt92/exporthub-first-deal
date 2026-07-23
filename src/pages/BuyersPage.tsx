import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import type { Buyer, Currency } from '../types'
import {
  Button,
  Card,
  EmptyState,
  Field,
  Input,
  Modal,
  PageHeader,
  Select,
  Textarea,
} from '../components/ui'

const emptyBuyer = {
  name: '',
  company: '',
  email: '',
  phone: '',
  address: '',
  city: '',
  country: '',
  postalCode: '',
  currency: 'USD' as Currency,
  notes: '',
}

export function BuyersPage() {
  const { data, addBuyer, updateBuyer, deleteBuyer } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Buyer | null>(null)
  const [form, setForm] = useState(emptyBuyer)
  const [query, setQuery] = useState('')

  const buyers = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.buyers.filter(
      (b) =>
        !q ||
        b.company.toLowerCase().includes(q) ||
        b.name.toLowerCase().includes(q) ||
        b.country.toLowerCase().includes(q),
    )
  }, [data.buyers, query])

  function openCreate() {
    setEditing(null)
    setForm(emptyBuyer)
    setOpen(true)
  }

  function openEdit(buyer: Buyer) {
    setEditing(buyer)
    setForm({
      name: buyer.name,
      company: buyer.company,
      email: buyer.email,
      phone: buyer.phone,
      address: buyer.address,
      city: buyer.city,
      country: buyer.country,
      postalCode: buyer.postalCode,
      currency: buyer.currency,
      notes: buyer.notes ?? '',
    })
    setOpen(true)
  }

  function save() {
    if (!form.company.trim() || !form.name.trim()) return
    if (editing) {
      updateBuyer({ ...editing, ...form })
    } else {
      addBuyer(form)
    }
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Buyers"
        subtitle="International customers and consignees"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add buyer
          </Button>
        }
      />

      <div className="mb-4 max-w-md">
        <Input
          placeholder="Search buyers by company, contact, or country"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {buyers.length === 0 ? (
        <EmptyState title="No buyers yet" description="Add your first overseas buyer to start creating shipments." />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {buyers.map((buyer) => (
            <Card key={buyer.id} className="p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm font-semibold text-slate-900">{buyer.company}</div>
                  <div className="text-xs text-slate-500">{buyer.name}</div>
                </div>
                <div className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-slate-600">
                  {buyer.currency}
                </div>
              </div>
              <div className="mt-4 space-y-1 text-sm text-slate-600">
                <div>
                  {buyer.city}, {buyer.country}
                </div>
                <div>{buyer.email}</div>
                <div>{buyer.phone}</div>
              </div>
              <div className="mt-4 flex gap-2">
                <Button variant="secondary" onClick={() => openEdit(buyer)}>
                  Edit
                </Button>
                <Button
                  variant="ghost"
                  className="text-rose-600"
                  onClick={() => {
                    if (confirm(`Delete buyer ${buyer.company}?`)) deleteBuyer(buyer.id)
                  }}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal open={open} title={editing ? 'Edit buyer' : 'Add buyer'} onClose={() => setOpen(false)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Company">
            <Input value={form.company} onChange={(e) => setForm({ ...form, company: e.target.value })} />
          </Field>
          <Field label="Contact name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <Field label="Email">
            <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </Field>
          <Field label="Phone">
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
          </Field>
          <Field label="Address">
            <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
          </Field>
          <Field label="City">
            <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
          </Field>
          <Field label="Country">
            <Input value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })} />
          </Field>
          <Field label="Postal code">
            <Input value={form.postalCode} onChange={(e) => setForm({ ...form, postalCode: e.target.value })} />
          </Field>
          <Field label="Preferred currency">
            <Select
              value={form.currency}
              onChange={(e) => setForm({ ...form, currency: e.target.value as Currency })}
            >
              {['USD', 'EUR', 'GBP', 'INR', 'AED'].map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>
          </Field>
          <div className="sm:col-span-2">
            <Field label="Notes">
              <Textarea
                rows={3}
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
              />
            </Field>
          </div>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save buyer</Button>
        </div>
      </Modal>
    </div>
  )
}
