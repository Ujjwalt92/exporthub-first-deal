import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { createInitialDeal } from '../data/playbook'
import type { ClarifyingQuestion, CostLine, DealData, DealStage, DocumentNode } from '../types'
import { computeCostSummary } from './costing'

const STORAGE_KEY = 'exporthub-first-deal-v1'

interface Store {
  deal: DealData
  setStage: (stage: DealStage) => void
  updateClarifying: (id: string, patch: Partial<ClarifyingQuestion>) => void
  updateCost: (id: string, patch: Partial<CostLine['money']> & { notes?: string }) => void
  updateDeal: (patch: Partial<DealData>) => void
  updateDocument: (id: string, patch: Partial<DocumentNode>) => void
  applySuggestedUnitPrice: () => void
  resetDeal: () => void
}

const Ctx = createContext<Store | null>(null)

function load(): DealData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return createInitialDeal()
    return { ...createInitialDeal(), ...JSON.parse(raw) }
  } catch {
    return createInitialDeal()
  }
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
      updateDocument: (id, patch) =>
        setDeal((d) => ({
          ...d,
          documents: d.documents.map((doc) => (doc.id === id ? { ...doc, ...patch } : doc)),
        })),
      applySuggestedUnitPrice: () =>
        setDeal((d) => {
          const summary = computeCostSummary(d)
          if (!summary.canSendFinalPrice) return d
          return {
            ...d,
            unitPriceUsd: Number(summary.unitPriceUsd.toFixed(2)),
            stage: 'proforma',
            documents: d.documents.map((doc) =>
              doc.id === 'pi' ? { ...doc, status: 'ready' } : doc,
            ),
          }
        }),
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
