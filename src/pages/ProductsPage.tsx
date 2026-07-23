import { useMemo, useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useStore } from '../lib/StoreContext'
import { formatMoney } from '../lib/store'
import type { Currency, Product } from '../types'
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

const emptyProduct = {
  sku: '',
  name: '',
  description: '',
  hsCode: '',
  unit: 'PCS',
  unitPrice: 0,
  currency: 'USD' as Currency,
  netWeightKg: 0,
  grossWeightKg: 0,
  cbm: 0,
}

export function ProductsPage() {
  const { data, addProduct, updateProduct, deleteProduct } = useStore()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [form, setForm] = useState(emptyProduct)
  const [query, setQuery] = useState('')

  const products = useMemo(() => {
    const q = query.trim().toLowerCase()
    return data.products.filter(
      (p) =>
        !q ||
        p.name.toLowerCase().includes(q) ||
        p.sku.toLowerCase().includes(q) ||
        p.hsCode.toLowerCase().includes(q),
    )
  }, [data.products, query])

  function openCreate() {
    setEditing(null)
    setForm(emptyProduct)
    setOpen(true)
  }

  function openEdit(product: Product) {
    setEditing(product)
    setForm({
      sku: product.sku,
      name: product.name,
      description: product.description,
      hsCode: product.hsCode,
      unit: product.unit,
      unitPrice: product.unitPrice,
      currency: product.currency,
      netWeightKg: product.netWeightKg,
      grossWeightKg: product.grossWeightKg,
      cbm: product.cbm,
    })
    setOpen(true)
  }

  function save() {
    if (!form.name.trim() || !form.sku.trim()) return
    if (editing) updateProduct({ ...editing, ...form })
    else addProduct(form)
    setOpen(false)
  }

  return (
    <div>
      <PageHeader
        title="Products"
        subtitle="Export catalog with HS codes and packing defaults"
        actions={
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" />
            Add product
          </Button>
        }
      />

      <div className="mb-4 max-w-md">
        <Input
          placeholder="Search by name, SKU, or HS code"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {products.length === 0 ? (
        <EmptyState title="No products" description="Add products so you can build shipment lines quickly." />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 font-medium">SKU</th>
                  <th className="px-4 py-3 font-medium">Product</th>
                  <th className="px-4 py-3 font-medium">HS code</th>
                  <th className="px-4 py-3 font-medium">Unit price</th>
                  <th className="px-4 py-3 font-medium">Weight / CBM</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {products.map((product) => (
                  <tr key={product.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-3 font-medium text-slate-900">{product.sku}</td>
                    <td className="px-4 py-3">
                      <div className="font-medium text-slate-900">{product.name}</div>
                      <div className="text-xs text-slate-500">{product.description}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-600">{product.hsCode}</td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatMoney(product.unitPrice, product.currency)} / {product.unit}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      NW {product.netWeightKg} kg · GW {product.grossWeightKg} kg · {product.cbm} CBM
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-end gap-2">
                        <Button variant="secondary" onClick={() => openEdit(product)}>
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          className="text-rose-600"
                          onClick={() => {
                            if (confirm(`Delete ${product.name}?`)) deleteProduct(product.id)
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      <Modal open={open} title={editing ? 'Edit product' : 'Add product'} onClose={() => setOpen(false)}>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="SKU">
            <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
          </Field>
          <Field label="Name">
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Description">
              <Textarea
                rows={2}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </Field>
          </div>
          <Field label="HS code">
            <Input value={form.hsCode} onChange={(e) => setForm({ ...form, hsCode: e.target.value })} />
          </Field>
          <Field label="Unit">
            <Input value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} />
          </Field>
          <Field label="Unit price">
            <Input
              type="number"
              value={form.unitPrice}
              onChange={(e) => setForm({ ...form, unitPrice: Number(e.target.value) })}
            />
          </Field>
          <Field label="Currency">
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
          <Field label="Net weight (kg)">
            <Input
              type="number"
              value={form.netWeightKg}
              onChange={(e) => setForm({ ...form, netWeightKg: Number(e.target.value) })}
            />
          </Field>
          <Field label="Gross weight (kg)">
            <Input
              type="number"
              value={form.grossWeightKg}
              onChange={(e) => setForm({ ...form, grossWeightKg: Number(e.target.value) })}
            />
          </Field>
          <Field label="CBM">
            <Input
              type="number"
              value={form.cbm}
              onChange={(e) => setForm({ ...form, cbm: Number(e.target.value) })}
            />
          </Field>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={save}>Save product</Button>
        </div>
      </Modal>
    </div>
  )
}
