import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppData, Buyer, CompanyProfile, Product, Shipment } from '../types'
import { loadData, resetData, saveData, uid } from './store'

interface AppStore {
  data: AppData
  updateCompany: (company: CompanyProfile) => void
  addBuyer: (buyer: Omit<Buyer, 'id' | 'createdAt'>) => void
  updateBuyer: (buyer: Buyer) => void
  deleteBuyer: (id: string) => void
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void
  updateProduct: (product: Product) => void
  deleteProduct: (id: string) => void
  addShipment: (shipment: Omit<Shipment, 'id' | 'createdAt' | 'updatedAt'>) => void
  updateShipment: (shipment: Shipment) => void
  deleteShipment: (id: string) => void
  resetDemoData: () => AppData
}

const StoreContext = createContext<AppStore | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<AppData>(() => loadData())

  useEffect(() => {
    saveData(data)
  }, [data])

  const value = useMemo<AppStore>(
    () => ({
      data,
      updateCompany: (company) => setData((prev) => ({ ...prev, company })),
      addBuyer: (buyer) =>
        setData((prev) => ({
          ...prev,
          buyers: [...prev.buyers, { ...buyer, id: uid('buyer'), createdAt: new Date().toISOString() }],
        })),
      updateBuyer: (buyer) =>
        setData((prev) => ({
          ...prev,
          buyers: prev.buyers.map((b) => (b.id === buyer.id ? buyer : b)),
        })),
      deleteBuyer: (id) =>
        setData((prev) => ({
          ...prev,
          buyers: prev.buyers.filter((b) => b.id !== id),
        })),
      addProduct: (product) =>
        setData((prev) => ({
          ...prev,
          products: [...prev.products, { ...product, id: uid('prod'), createdAt: new Date().toISOString() }],
        })),
      updateProduct: (product) =>
        setData((prev) => ({
          ...prev,
          products: prev.products.map((p) => (p.id === product.id ? product : p)),
        })),
      deleteProduct: (id) =>
        setData((prev) => ({
          ...prev,
          products: prev.products.filter((p) => p.id !== id),
        })),
      addShipment: (shipment) =>
        setData((prev) => ({
          ...prev,
          shipments: [
            {
              ...shipment,
              id: uid('ship'),
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
            ...prev.shipments,
          ],
        })),
      updateShipment: (shipment) =>
        setData((prev) => ({
          ...prev,
          shipments: prev.shipments.map((s) =>
            s.id === shipment.id ? { ...shipment, updatedAt: new Date().toISOString() } : s,
          ),
        })),
      deleteShipment: (id) =>
        setData((prev) => ({
          ...prev,
          shipments: prev.shipments.filter((s) => s.id !== id),
        })),
      resetDemoData: () => {
        const next = resetData()
        setData(next)
        return next
      },
    }),
    [data],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
