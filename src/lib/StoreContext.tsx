import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createInitialDeal } from '../data/playbook'
import type {
  ClarifyingQuestion,
  CompanyProfile,
  CostLine,
  CustomsState,
  DealData,
  DealStage,
  DispatchState,
  DocumentNode,
  LcCheckItem,
  PaymentState,
  ProductionState,
  TaskItem,
  VendorOrder,
  VesselState,
} from '../types'
import { computeCostSummary } from './costing'

const STORAGE_KEY = 'exporthub-first-deal-v3'

interface Store {
  deal: DealData
  setStage: (stage: DealStage) => void
  updateClarifying: (id: string, patch: Partial<ClarifyingQuestion>) => void
  updateCost: (id: string, patch: Partial<CostLine['money']> & { notes?: string }) => void
  updateDeal: (patch: Partial<DealData>) => void
  updateCompany: (patch: Partial<CompanyProfile>) => void
  updateDocument: (id: string, patch: Partial<DocumentNode>) => void
  updateLcCheck: (id: string, patch: Partial<LcCheckItem>) => void
  updateVendor: (patch: Partial<VendorOrder>) => void
  updateProduction: (patch: Partial<ProductionState>) => void
  updateProductionTask: (id: string, patch: Partial<TaskItem>) => void
  updateDispatch: (patch: Partial<DispatchState>) => void
  updateCustoms: (patch: Partial<CustomsState>) => void
  updateCustomsTask: (id: string, patch: Partial<TaskItem>) => void
  updateVessel: (patch: Partial<VesselState>) => void
  updatePayment: (patch: Partial<PaymentState>) => void
  updatePaymentTask: (id: string, patch: Partial<TaskItem>) => void
  applySuggestedUnitPrice: () => void
  markLcCleared: () => void
  confirmVendor: () => void
  markProductionReady: () => void
  markDispatchDone: () => void
  markCustomsLeo: () => void
  markBlReceived: () => void
  markPaymentComplete: () => void
  resetDeal: () => void
}

const Ctx = createContext<Store | null>(null)

function load(): DealData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialDeal()
    const parsed = JSON.parse(raw) as Partial<DealData>
    const base = createInitialDeal()
    return {
      ...base,
      ...parsed,
      company: { ...base.company, ...(parsed.company ?? {}) },
      clarifying: parsed.clarifying ?? base.clarifying,
      costs: parsed.costs ?? base.costs,
      rules: base.rules,
      documents: parsed.documents ?? base.documents,
      lcChecks: parsed.lcChecks ?? base.lcChecks,
      vendor: { ...base.vendor, ...(parsed.vendor ?? {}) },
      production: {
        ...base.production,
        ...(parsed.production ?? {}),
        tasks: parsed.production?.tasks ?? base.production.tasks,
      },
      dispatch: { ...base.dispatch, ...(parsed.dispatch ?? {}) },
      customs: {
        ...base.customs,
        ...(parsed.customs ?? {}),
        tasks: parsed.customs?.tasks ?? base.customs.tasks,
      },
      vessel: { ...base.vessel, ...(parsed.vessel ?? {}) },
      payment: {
        ...base.payment,
        ...(parsed.payment ?? {}),
        tasks: parsed.payment?.tasks ?? base.payment.tasks,
      },
      templates: base.templates,
      glossary: base.glossary,
    }
  } catch {
    return createInitialDeal()
  }
}

function patchDoc(
  docs: DocumentNode[],
  updates: Partial<Record<string, DocumentNode['status']>>,
): DocumentNode[] {
  return docs.map((doc) => (updates[doc.id] ? { ...doc, status: updates[doc.id]! } : doc))
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [deal, setDeal] = useState<DealData>(() => load())

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(deal))
  }, [deal])

  const value = useMemo<Store>(
    () => ({
      deal,
      setStage: (stage) => setDeal((d) => ({ ...d, stage })),
      updateClarifying: (id, patch) =>
        setDeal((d) => ({
          ...d,
          clarifying: d.clarifying.map((q) =>
            q.id === id
              ? {
                  ...q,
                  ...patch,
                  answered:
                    patch.answered ??
                    (patch.answer != null ? patch.answer.trim().length > 0 : q.answered),
                }
              : q,
          ),
        })),
      updateCost: (id, patch) =>
        setDeal((d) => ({
          ...d,
          costs: d.costs.map((c) =>
            c.id === id
              ? {
                  ...c,
                  money: {
                    ...c.money,
                    estimatedInr:
                      'estimatedInr' in patch ? (patch.estimatedInr ?? null) : c.money.estimatedInr,
                    quotedInr: 'quotedInr' in patch ? (patch.quotedInr ?? null) : c.money.quotedInr,
                    actualPaidInr:
                      'actualPaidInr' in patch ? (patch.actualPaidInr ?? null) : c.money.actualPaidInr,
                    notes: 'notes' in patch ? patch.notes : c.money.notes,
                  },
                }
              : c,
          ),
        })),
      updateDeal: (patch) => setDeal((d) => ({ ...d, ...patch })),
      updateCompany: (patch) =>
        setDeal((d) => ({
          ...d,
          company: { ...d.company, ...patch },
          companyName: patch.legalName ?? d.companyName,
        })),
      updateDocument: (id, patch) =>
        setDeal((d) => ({
          ...d,
          documents: d.documents.map((doc) => (doc.id === id ? { ...doc, ...patch } : doc)),
        })),
      updateLcCheck: (id, patch) =>
        setDeal((d) => ({
          ...d,
          lcChecks: d.lcChecks.map((item) => (item.id === id ? { ...item, ...patch } : item)),
          lcClearedForProduction: false,
        })),
      updateVendor: (patch) => setDeal((d) => ({ ...d, vendor: { ...d.vendor, ...patch } })),
      updateProduction: (patch) =>
        setDeal((d) => ({ ...d, production: { ...d.production, ...patch } })),
      updateProductionTask: (id, patch) =>
        setDeal((d) => ({
          ...d,
          production: {
            ...d.production,
            tasks: d.production.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
          },
        })),
      updateDispatch: (patch) => setDeal((d) => ({ ...d, dispatch: { ...d.dispatch, ...patch } })),
      updateCustoms: (patch) => setDeal((d) => ({ ...d, customs: { ...d.customs, ...patch } })),
      updateCustomsTask: (id, patch) =>
        setDeal((d) => ({
          ...d,
          customs: {
            ...d.customs,
            tasks: d.customs.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
          },
        })),
      updateVessel: (patch) => setDeal((d) => ({ ...d, vessel: { ...d.vessel, ...patch } })),
      updatePayment: (patch) => setDeal((d) => ({ ...d, payment: { ...d.payment, ...patch } })),
      updatePaymentTask: (id, patch) =>
        setDeal((d) => ({
          ...d,
          payment: {
            ...d.payment,
            tasks: d.payment.tasks.map((t) => (t.id === id ? { ...t, ...patch } : t)),
          },
        })),
      applySuggestedUnitPrice: () =>
        setDeal((d) => {
          const summary = computeCostSummary(d)
          if (!summary.canSendFinalPrice) return d
          return {
            ...d,
            unitPriceUsd: Number(summary.unitPriceUsd.toFixed(2)),
            stage: 'proforma',
            documents: patchDoc(d.documents, { pi: 'ready' }),
          }
        }),
      markLcCleared: () =>
        setDeal((d) => {
          const allOk = d.lcChecks.every((c) => c.status === 'match')
          if (!d.lcReceived || !allOk) return d
          return {
            ...d,
            lcClearedForProduction: true,
            stage: 'vendor',
            documents: patchDoc(d.documents, {
              lc: 'received',
              ...(d.poReceived ? { po: 'received' } : {}),
            }),
          }
        }),
      confirmVendor: () =>
        setDeal((d) => {
          if (!d.lcClearedForProduction) return d
          return {
            ...d,
            vendor: { ...d.vendor, confirmed: true },
            stage: 'production',
            vendorPricePerKgInr: d.vendor.rateInrPerKg ?? d.vendorPricePerKgInr,
          }
        }),
      markProductionReady: () =>
        setDeal((d) => {
          if (!d.vendor.confirmed) return d
          return {
            ...d,
            production: { ...d.production, readyForPickup: true },
            stage: 'dispatch',
          }
        }),
      markDispatchDone: () =>
        setDeal((d) => {
          if (!d.dispatch.stuffed) return d
          return {
            ...d,
            dispatch: { ...d.dispatch, departedForPort: true },
            stage: 'customs',
            documents: patchDoc(d.documents, { ci: 'ready', pl: 'ready' }),
          }
        }),
      markCustomsLeo: () =>
        setDeal((d) => ({
          ...d,
          customs: { ...d.customs, leoReceived: true },
          stage: 'vessel',
          documents: patchDoc(d.documents, {
            sb: d.customs.shippingBillNo ? 'ready' : 'in_progress',
            phyto_doc: d.customs.phytoNo ? 'ready' : 'in_progress',
            coo_doc: d.customs.cooNo ? 'ready' : 'in_progress',
          }),
        })),
      markBlReceived: () =>
        setDeal((d) => ({
          ...d,
          vessel: { ...d.vessel, blReceived: true, onboardConfirmed: true },
          stage: 'payment',
          documents: patchDoc(d.documents, {
            bl: 'received',
            booking: 'ready',
          }),
        })),
      markPaymentComplete: () =>
        setDeal((d) => ({
          ...d,
          payment: { ...d.payment, paymentComplete: true },
          stage: 'closed',
          documents: patchDoc(d.documents, {
            bank_lodge: 'ready',
            firc: d.payment.fircRef ? 'received' : 'in_progress',
          }),
        })),
      resetDeal: () => {
        const next = createInitialDeal()
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
        setDeal(next)
      },
    }),
    [deal],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Store missing')
  return ctx
}
