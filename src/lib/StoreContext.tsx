import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
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
import { useAuth } from './AuthContext'
import { computeCostSummary, dealProgress } from './costing'
import { saas } from './saas'

interface Store {
  deal: DealData
  dealLoading: boolean
  syncState: 'idle' | 'saving' | 'saved' | 'error'
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
  updateTeaching: (patch: Partial<DealData['teaching']>) => void
  updateQualitySpec: (id: string, patch: Partial<DealData['teaching']['qualitySpecs'][number]>) => void
  updateChaTask: (id: string, patch: Partial<TaskItem>) => void
  updateBankDoc: (id: string, patch: Partial<DealData['teaching']['bankDocMatches'][number]>) => void
  updateIncentive: (id: string, patch: Partial<DealData['teaching']['incentives'][number]>) => void
  updateOnboardingItem: (id: string, done: boolean) => void
  markWelcomeSeen: () => void
  completeOnboarding: () => void
  exportDealJson: () => string
  importDealJson: (raw: string) => { ok: true } | { ok: false; error: string }
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

export function mergeDeal(parsed: Partial<DealData> | null | undefined): DealData {
  const base = createInitialDeal()
  if (!parsed || typeof parsed !== 'object') return base
  const merged: DealData = {
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
    teaching: {
      ...base.teaching,
      ...(parsed.teaching ?? {}),
      qualitySpecs: parsed.teaching?.qualitySpecs ?? base.teaching.qualitySpecs,
      chaChecklist: parsed.teaching?.chaChecklist ?? base.teaching.chaChecklist,
      bankDocMatches: parsed.teaching?.bankDocMatches ?? base.teaching.bankDocMatches,
      incentives: parsed.teaching?.incentives ?? base.teaching.incentives,
    },
    onboarding: {
      ...base.onboarding,
      ...(parsed.onboarding ?? {}),
      checklist: parsed.onboarding?.checklist?.length
        ? parsed.onboarding.checklist
        : base.onboarding.checklist,
    },
  }
  if (!merged.onboarding?.checklist?.length) merged.onboarding = base.onboarding
  return merged
}

function patchDoc(
  docs: DocumentNode[],
  updates: Partial<Record<string, DocumentNode['status']>>,
): DocumentNode[] {
  return docs.map((doc) => (updates[doc.id] ? { ...doc, status: updates[doc.id]! } : doc))
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const { activeDealId, user, refresh } = useAuth()
  const [deal, setDeal] = useState<DealData>(() => createInitialDeal())
  const [dealLoading, setDealLoading] = useState(false)
  const [syncState, setSyncState] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const loadedFor = useRef<string | null>(null)
  const skipNextSave = useRef(false)

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      if (!user || !activeDealId) {
        loadedFor.current = null
        setDeal(createInitialDeal())
        return
      }
      if (loadedFor.current === activeDealId) return
      setDealLoading(true)
      try {
        const res = await saas.getDeal(activeDealId)
        if (cancelled) return
        const merged = mergeDeal(res.deal.data)
        skipNextSave.current = true
        setDeal(merged)
        loadedFor.current = activeDealId
        if (!res.deal.data) {
          await saas.saveDeal(activeDealId, {
            data: merged,
            progressPct: dealProgress(merged).pct,
          })
          await refresh()
        }
      } catch {
        if (!cancelled) {
          skipNextSave.current = true
          setDeal(createInitialDeal())
        }
      } finally {
        if (!cancelled) setDealLoading(false)
      }
    })()
    return () => {
      cancelled = true
    }
  }, [activeDealId, user, refresh])

  useEffect(() => {
    if (!user || !activeDealId || dealLoading) return
    if (loadedFor.current !== activeDealId) return
    if (skipNextSave.current) {
      skipNextSave.current = false
      return
    }
    setSyncState('saving')
    const handle = window.setTimeout(async () => {
      try {
        await saas.saveDeal(activeDealId, {
          data: deal,
          progressPct: dealProgress(deal).pct,
          title: `${deal.productName.split(' ').slice(0, 3).join(' ')} · ${deal.buyerName || 'Buyer'}`,
        })
        setSyncState('saved')
        await refresh()
      } catch {
        setSyncState('error')
      }
    }, 650)
    return () => window.clearTimeout(handle)
  }, [deal, activeDealId, user, dealLoading, refresh])

  const resetDeal = useCallback(() => {
    const next = createInitialDeal()
    setDeal(next)
  }, [])

  const value = useMemo<Store>(
    () => ({
      deal,
      dealLoading,
      syncState,
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
      updateTeaching: (patch) =>
        setDeal((d) => ({ ...d, teaching: { ...d.teaching, ...patch } })),
      updateQualitySpec: (id, patch) =>
        setDeal((d) => ({
          ...d,
          teaching: {
            ...d.teaching,
            qualitySpecs: d.teaching.qualitySpecs.map((q) =>
              q.id === id ? { ...q, ...patch } : q,
            ),
          },
        })),
      updateChaTask: (id, patch) =>
        setDeal((d) => ({
          ...d,
          teaching: {
            ...d.teaching,
            chaChecklist: d.teaching.chaChecklist.map((t) =>
              t.id === id ? { ...t, ...patch } : t,
            ),
          },
        })),
      updateBankDoc: (id, patch) =>
        setDeal((d) => ({
          ...d,
          teaching: {
            ...d.teaching,
            bankDocMatches: d.teaching.bankDocMatches.map((b) =>
              b.id === id ? { ...b, ...patch } : b,
            ),
          },
        })),
      updateIncentive: (id, patch) =>
        setDeal((d) => ({
          ...d,
          teaching: {
            ...d.teaching,
            incentives: d.teaching.incentives.map((i) => (i.id === id ? { ...i, ...patch } : i)),
          },
        })),
      updateOnboardingItem: (id, done) =>
        setDeal((d) => ({
          ...d,
          onboarding: {
            ...d.onboarding,
            checklist: d.onboarding.checklist.map((item) =>
              item.id === id ? { ...item, done } : item,
            ),
          },
        })),
      markWelcomeSeen: () =>
        setDeal((d) => ({
          ...d,
          onboarding: { ...d.onboarding, seenWelcome: true },
        })),
      completeOnboarding: () =>
        setDeal((d) => ({
          ...d,
          onboarding: {
            ...d.onboarding,
            seenWelcome: true,
            completedAt: new Date().toISOString(),
            checklist: d.onboarding.checklist.map((item) => ({ ...item, done: true })),
          },
        })),
      exportDealJson: () => JSON.stringify(deal, null, 2),
      importDealJson: (raw) => {
        try {
          const parsed = JSON.parse(raw) as Partial<DealData>
          if (!parsed || typeof parsed !== 'object') return { ok: false, error: 'Invalid JSON' }
          setDeal(mergeDeal(parsed))
          return { ok: true }
        } catch (e) {
          return { ok: false, error: e instanceof Error ? e.message : 'Failed to import' }
        }
      },
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
      resetDeal,
    }),
    [deal, dealLoading, syncState, resetDeal],
  )

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export function useStore() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('Store missing')
  return ctx
}
